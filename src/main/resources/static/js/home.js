/**
 * Переключение выпадающего меню (три точки)
 */
function toggleDropdown(button) {
    // Находим родительский .dropdown
    const dropdown = button.closest('.dropdown');
    if (!dropdown) {
        console.warn('Dropdown container not found');
        return;
    }

    const menu = dropdown.querySelector('.dropdown-menu');
    if (!menu) {
        console.warn('Dropdown menu not found');
        return;
    }

    // Закрываем все другие меню
    document.querySelectorAll('.dropdown-menu.show').forEach(m => {
        if (m !== menu) {
            m.classList.remove('show');
        }
    });

    menu.classList.toggle('show');
}

/**
 * Закрытие выпадающего меню при клике вне
 */
document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

/**
 * Включение режима редактирования
 */
function enableEdit(button) {
    // Находим родительский пост
    const postItem = button.closest('.post-item');
    if (!postItem) {
        console.warn('Post item not found');
        return;
    }

    const postId = postItem.id.replace('post-', '');

    // Ищем контейнер с текстом поста
    const textContainer = postItem.querySelector('.post-text');
    const editElement = document.getElementById('edit-' + postId);

    if (!textContainer || !editElement) {
        console.warn('Text container or edit element not found for post:', postId);
        return;
    }

    // Получаемтекст из textarea
    // Или из атрибута data-text
    const originalText = editElement.value || textContainer.textContent.trim();

    // Скрываем контейнер с текстом, показываем поле для редактирования
    textContainer.style.display = 'none';
    editElement.style.display = 'block';
    editElement.value = originalText;

    // Закрываем выпадающее меню
    const dropdown = button.closest('.dropdown');
    if (dropdown) {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.classList.remove('show');
        }
    }

    // Показываем кнопки сохранения/отмены в футере
    const footer = postItem.querySelector('.post-footer');
    if (footer) {
        const saveBtn = footer.querySelector('.btn-save');
        const cancelBtn = footer.querySelector('.btn-cancel');

        if (saveBtn) saveBtn.style.display = 'inline-flex';
        if (cancelBtn) cancelBtn.style.display = 'inline-flex';
    }
}

/**
  * Отмена редактирования
  */
 function cancelEdit(button) {
     const postItem = button.closest('.post-item');
     if (!postItem) {
         console.warn('Post item not found');
         return;
     }

     const postId = postItem.id.replace('post-', '');

     const textContainer = postItem.querySelector('.post-text');
     const editElement = document.getElementById('edit-' + postId);

     if (!textContainer || !editElement) {
         console.warn('Text container or edit element not found for post:', postId);
         return;
     }

     // Возвращаем исходное состояние
     textContainer.style.display = 'block';
     editElement.style.display = 'none';

     // Скрываем кнопки сохранения/отмены
     const footer = postItem.querySelector('.post-footer');
     if (footer) {
         const saveBtn = footer.querySelector('.btn-save');
         const cancelBtn = footer.querySelector('.btn-cancel');

         if (saveBtn) saveBtn.style.display = 'none';
         if (cancelBtn) cancelBtn.style.display = 'none';
     }
 }

 /**
  * Сохранение поста
  */
 function savePost(button) {
     const postItem = button.closest('.post-item');
     if (!postItem) {
         console.warn('Post item not found');
         return;
     }

     const postId = postItem.id.replace('post-', '');
     const editElement = document.getElementById('edit-' + postId);

     if (!editElement) {
         console.warn('Edit element not found for post:', postId);
         return;
     }

     const newText = editElement.value.trim();

     if (!newText) {
         alert('Текст поста не может быть пустым');
         return;
     }

     // Получаем CSRF токен
     const csrfToken = document.querySelector('meta[name="_csrf"]').content;
     const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

     // Отправляем запрос на сервер
     fetch('/posts/' + postId + '/update', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
             [csrfHeader]: csrfToken
         },
         body: 'text=' + encodeURIComponent(newText)
     })
     .then(response => {
         if (response.ok) {
             location.reload();
         } else {
             alert('Ошибка при сохранении поста');
         }
     })
     .catch(error => {
         console.error('Error:', error);
         alert('Ошибка при сохранении поста');
     });
 }

/**
 * Показывает модальное окно подтверждения удаления
 */
function confirmDelete(button) {
    const postItem = button.closest('.post-item');
    if (!postItem) {
        console.warn('Post item not found');
        return;
    }

    const postId = postItem.id.replace('post-', '');

    // Ищем контейнер с текстом поста (по классу)
    const textContainer = postItem.querySelector('.post-text');
    if (!textContainer) {
        console.warn('Text container not found for post:', postId);
        return;
    }

    // Получаем текст из контейнера (очищаем от HTML-тегов)
    let postText = textContainer.textContent.trim();

    // Если текст слишком длинный, обрезаем его для отображения в модалке
    if (postText.length > 200) {
        postText = postText.substring(0, 200) + '...';
    }

    // Сохраняем ID поста в data-атрибуте модального окна
    const modal = document.getElementById('deleteModal');
    if (!modal) {
        console.warn('Delete modal not found');
        return;
    }

    modal.dataset.postId = postId;

    // Показываем текст поста
    const modalPostText = document.getElementById('modalPostText');
    if (modalPostText) {
        modalPostText.textContent = '"' + postText + '"';
    }

    // Показываем модальное окно
    modal.style.display = 'flex';

    // Закрываем выпадающее меню
    const dropdown = button.closest('.dropdown');
    if (dropdown) {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.classList.remove('show');
        }
    }
}

/**
 * Закрывает модальное окно
 */
function closeModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Удаляет пост
 */
function deletePost() {
    const modal = document.getElementById('deleteModal');
    if (!modal) {
        console.warn('Delete modal not found');
        return;
    }

    const postId = modal.dataset.postId;
    if (!postId) {
        console.warn('Post ID not found in modal');
        return;
    }

    // Получаем CSRF токен
    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

    // Отправляем запрос на удаление
    fetch('/posts/' + postId + '/delete', {
        method: 'POST',
        headers: {
            [csrfHeader]: csrfToken
        }
    })
    .then(response => {
        if (response.ok) {
            // Удаляем пост из DOM
            const postItem = document.getElementById('post-' + postId);
            if (postItem) {
                postItem.remove();
            }

            // Закрываем модальное окно
            closeModal();

            // Проверяем, остались ли посты
            const postList = document.querySelector('.post-list');
            if (postList && postList.children.length === 0) {
                // Показываем сообщение "Нет постов"
                const noPosts = document.createElement('div');
                noPosts.className = 'no-posts';
                noPosts.textContent = 'У вас пока нет публикаций';
                postList.parentNode.insertBefore(noPosts, postList);
                postList.remove();
            }
        } else {
            alert('Ошибка при удалении поста');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при удалении поста');
    });
}

// Закрытие модального окна по клику на фон
document.addEventListener('click', function(event) {
    const modal = document.getElementById('deleteModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Закрытие модального окна по Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

/**
 * Поставить/убрать лайк
 */
function toggleLike(button) {
    const postId = button.dataset.postId;
    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

    fetch('/posts/' + postId + '/like', {
        method: 'POST',
        headers: {
            [csrfHeader]: csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Обновляем иконку
            const heartSpan = button.querySelector('span:first-child');
            if (data.action === 'liked') {
                heartSpan.textContent = '❤️';
            } else {
                heartSpan.textContent = '🤍';
            }

            // Обновляем счетчик
            const countSpan = button.querySelector('.likes-count');
            countSpan.textContent = data.likesCount;
        } else {
            alert(data.message || 'Ошибка при обновлении лайка');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при обновлении лайка');
    });
}

/**
 * ПАГИНАЦИЯ ПОСТОВ
 */

// Настройки пагинации
const POSTS_PER_PAGE = 10;  // количество отображаемых страниц за раз

let currentPage = 0;
let isLoading = false;
let hasMore = true;
let totalItems = 0;

/**
 * Загрузка следующей порции постов
 */
function loadMorePosts() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    showLoadingIndicator();

    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

    const userId = document.querySelector('meta[name="userId"]').content;

    fetch(`/api/posts/user/${userId}?page=${currentPage}&size=${POSTS_PER_PAGE}`, {
        method: 'GET',
        headers: {
            [csrfHeader]: csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.posts && data.posts.length > 0) {
            // Добавляем посты в DOM
            const postList = document.querySelector('.post-list');
            data.posts.forEach(post => {
                const postHtml = createPostElement(post);
                postList.insertAdjacentHTML('beforeend', postHtml);
            });

            currentPage++;
            hasMore = data.hasNext;
            totalItems = data.totalItems;

            if (!hasMore) {
                showNoMorePosts();
            }
        } else {
            hasMore = false;
            showNoMorePosts();
        }

        isLoading = false;
        hideLoadingIndicator();
    })
    .catch(error => {
        console.error('Error loading posts:', error);
        isLoading = false;
        hideLoadingIndicator();
    });
}

/**
 * Создание HTML для одного поста
 */
function createPostElement(post) {
    let formattedDate = '';

    if (post.createdAt && Array.isArray(post.createdAt)) {
        const [year, month, day, hour, minute, second] = post.createdAt;
        const date = new Date(year, month - 1, day, hour, minute, second);

        if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    } else if (typeof post.createdAt === 'string') {
        const date = new Date(post.createdAt);
        if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            formattedDate = post.createdAt;
        }
    }

    const redactedHtml = post.redacted ? '<span class="redacted">(ред.)</span> ' : '';
    const heart = post.likedByCurrentUser ? '❤️' : '🤍';

    const currentUserLogin = document.querySelector('meta[name="currentUserLogin"]')?.content || '';
    const showDropdown = post.authorLogin === currentUserLogin;

    const markdownHtml = post.useMarkdown ? '<span class="redacted">(md)</span> ' : '';

    let contentHtml;
    if (post.useMarkdown == true) {
        contentHtml = post.htmlContent
    } else {
        contentHtml = post.text;
    }

    return `
        <li>
            <!-- Клик на весь пост открывает модалку, но кнопки перехватывают событие -->
            <div class="post-item" id="post-${post.id}" onclick="openPostModal(${post.id})">
                <div class="post-header">
                    <span class="post-author">${post.authorName || post.authorLogin}</span>
                    <div class="post-header-right">
                        <span class="post-date">
                            ${markdownHtml}
                            ${redactedHtml}
                            ${formattedDate}
                        </span>
                        ${showDropdown ? `
                        <div class="dropdown" onclick="event.stopPropagation();">
                            <button class="dropdown-toggle" onclick="event.stopPropagation(); toggleDropdown(this)" type="button">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="5" r="1.5"/>
                                    <circle cx="12" cy="12" r="1.5"/>
                                    <circle cx="12" cy="19" r="1.5"/>
                                </svg>
                            </button>
                            <div class="dropdown-menu">
                                <button class="comment-dropdown-item btn-edit-comment" onclick="event.stopPropagation(); enableEdit(this)">Редактировать</button>
                                <button class="comment-dropdown-item btn-delete-comment" onclick="event.stopPropagation(); confirmDelete(this)">Удалить</button>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="post-content" onclick="event.stopPropagation();">
                    <div class="post-text ${post.useMarkdown ? 'markdown-body' : ''}">${contentHtml}</div>
                    <textarea class="post-edit-textarea" id="edit-${post.id}" style="display: none;">${post.text}</textarea>
                </div>
                ${post.imagePath ? `<div class="post-image" onclick="event.stopPropagation();"><img src="${post.imagePath}" alt="Изображение к посту" /></div>` : ''}
                <div class="post-footer" onclick="event.stopPropagation();">
                    <div class="post-footer-left">
                        <button class="btn-like"
                                data-post-id="${post.id}"
                                onclick="event.stopPropagation(); toggleLike(this)">
                            <span class="heart ${post.likedByCurrentUser ? 'liked' : ''}">${heart}</span>
                            <span class="likes-count">${post.likes || 0}</span>
                        </button>
                        <span class="post-comments-count" onclick="event.stopPropagation(); openPostModal(${post.id})">
                            💬 <span>${post.comments || 0}</span>
                        </span>
                    </div>
                     ${showDropdown ? `
                    <div class="post-footer-right" onclick="event.stopPropagation();">
                        <button class="btn-save"
                                data-post-id="${post.id}"
                                style="display: none;"
                                onclick="event.stopPropagation(); savePost(this)">Сохранить</button>
                        <button class="btn-cancel"
                                data-post-id="${post.id}"
                                style="display: none;"
                                onclick="event.stopPropagation(); cancelEdit(this)">Отмена</button>
                    </div>
                    ` : ''}
                </div>
            </div>
        </li>
    `;
}

/**
 * Экранирование HTML для защиты от XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Показывает индикатор загрузки
 */
function showLoadingIndicator() {
    let indicator = document.getElementById('loadingIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'loadingIndicator';
        indicator.className = 'loading-indicator';
        indicator.textContent = 'Загрузка...';
        document.querySelector('.post-list').parentNode.appendChild(indicator);
    }
    indicator.style.display = 'block';
}

/**
 * Скрывает индикатор загрузки
 */
function hideLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

/**
 * Показывает сообщение "Все посты загружены"
 */
function showNoMorePosts() {
    let noMore = document.getElementById('noMorePosts');
    if (!noMore) {
        noMore = document.createElement('div');
        noMore.id = 'noMorePosts';
        noMore.className = 'no-more-posts';
        noMore.textContent = 'Постов больше нет';
        document.querySelector('.post-list').parentNode.appendChild(noMore);
    }
    noMore.style.display = 'block';
}

/**
 * Отслеживание прокрутки для бесконечной загрузки
 */
let scrollTimeout;
document.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.body.offsetHeight;

        // Если дошли до 200px до конца страницы
        if (pageHeight - scrollPosition < 200) {
            loadMorePosts();
        }
    }, 100);
});

/**
 * Обновленная функция toggleLike для работы с новым HTML
 */
function toggleLike(button) {
    const postId = button.dataset.postId;
    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

    fetch('/posts/' + postId + '/like', {
        method: 'POST',
        headers: {
            [csrfHeader]: csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Обновляем иконку
            const heartSpan = button.querySelector('.heart');
            if (data.action === 'liked') {
                heartSpan.textContent = '❤️';
                heartSpan.classList.add('liked');
            } else {
                heartSpan.textContent = '🤍';
                heartSpan.classList.remove('liked');
            }

            // Обновляем счетчик
            const countSpan = button.querySelector('.likes-count');
            countSpan.textContent = data.likesCount;
        } else {
            alert(data.message || 'Ошибка при обновлении лайка');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при обновлении лайка');
    });
}

// Инициализация: загрузка первой порции постов
document.addEventListener('DOMContentLoaded', function() {
    // Удаляем старые посты, если они были загружены через Thymeleaf
    const postList = document.querySelector('.post-list');
    if (postList) {
        postList.innerHTML = '';
    }
    loadMorePosts();
});


/**
 * Текущий ID поста в модалке
 */
let currentModalPostId = null;

// ==========================================
// ФУНКЦИИ ДЛЯ КОММЕНТАРИЕВ
// ==========================================

/**
 * Загрузка комментариев для поста
 */
function loadComments(postId) {
    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;
    const currentUserLogin = document.querySelector('meta[name="currentUserLogin"]')?.content || '';

    return fetch(`/api/comments/post/${postId}?page=0&size=20`, {
        method: 'GET',
        headers: {
            [csrfHeader]: csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';

        if (data.comments && data.comments.length > 0) {
            data.comments.forEach(comment => {
                comment.isAuthor = comment.authorLogin === currentUserLogin;
                const commentHtml = createCommentElement(comment);
                commentsList.insertAdjacentHTML('beforeend', commentHtml);
            });
        } else {
            commentsList.innerHTML = '<div class="no-comments">Пока нет комментариев</div>';
        }
    })
    .catch(error => {
        console.error('Error loading comments:', error);
    });
}

/**
 * Создание HTML для одного комментария
 */
function createCommentElement(comment) {

    let formattedDate = '';

    if (comment.createdAt && Array.isArray(comment.createdAt)) {
        const [year, month, day, hour, minute, second] = comment.createdAt;
        const date = new Date(year, month - 1, day, hour, minute, second);

        if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    } else if (typeof comment.createdAt === 'string') {
        const date = new Date(comment.createdAt);
        if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            formattedDate = comment.createdAt;
        }
    }

    const redactedHtml = comment.redacted ? '<span class="comment-redacted">(ред.)</span> ' : '';
    const showDropdown = comment.isAuthor;
    const heart = comment.likedByCurrentUser ? '❤️' : '🤍';

    // Экранируем текст комментария
    const escapedText = escapeHtml(comment.text);

    return `
        <div class="comment-item" id="comment-${comment.id}">
            <div class="comment-header">
                <div class="comment-header-left">
                    <span class="comment-author">${comment.authorName || comment.authorLogin}</span>
                    <span class="comment-login">${comment.authorLogin}</span>
                </div>
                <div class="comment-header-right">
                    <span class="comment-date">
                        ${redactedHtml}
                        ${formattedDate}
                    </span>
                    ${showDropdown ? `
                    <div class="comment-dropdown">
                        <button class="comment-dropdown-toggle" onclick="event.stopPropagation(); toggleCommentDropdown(this)" type="button">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="5" r="1.5"/>
                                <circle cx="12" cy="12" r="1.5"/>
                                <circle cx="12" cy="19" r="1.5"/>
                            </svg>
                        </button>
                        <div class="comment-dropdown-menu">
                            <button class="comment-dropdown-item btn-edit-comment" onclick="event.stopPropagation(); editComment(${comment.id})">Редактировать</button>
                            <button class="comment-dropdown-item btn-delete-comment" onclick="event.stopPropagation(); deleteComment(${comment.id})">Удалить</button>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
            <p class="comment-text" id="comment-text-${comment.id}">${escapedText}</p>
            <textarea class="comment-edit-textarea" id="comment-edit-${comment.id}" style="display: none;">${escapedText}</textarea>
            <div class="comment-edit-actions" id="comment-edit-actions-${comment.id}" style="display: none;">
                <button class="btn-save-comment" onclick="saveComment(${comment.id})">Сохранить</button>
                <button class="btn-cancel-comment" onclick="cancelEditComment(${comment.id})">Отмена</button>
            </div>

            <div class="comment-footer">
                <button class="btn-like-comment"
                        data-comment-id="${comment.id}"
                        onclick="event.stopPropagation(); toggleLikeComment(this)">
                    <span class="heart ${comment.likedByCurrentUser ? 'liked' : ''}">${heart}</span>
                    <span class="likes-count">${comment.likes || 0}</span>
                </button>
            </div>
        </div>
    `;
}

/**
 * Поставить/убрать лайк комментария
 */
function toggleLikeComment(button) {
    const commentId = button.dataset.commentId;
    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

    fetch('/comments/' + commentId + '/like', {
        method: 'POST',
        headers: {
            [csrfHeader]: csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Обновляем иконку
            const heartSpan = button.querySelector('.heart');
            if (data.action === 'liked') {
                heartSpan.textContent = '❤️';
                heartSpan.classList.add('liked');
            } else {
                heartSpan.textContent = '🤍';
                heartSpan.classList.remove('liked');
            }

            // Обновляем счетчик
            const countSpan = button.querySelector('.likes-count');
            countSpan.textContent = data.likesCount;
        } else {
            alert(data.message || 'Ошибка при обновлении лайка');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при обновлении лайка');
    });
}

/**
 * Переключение выпадающего меню комментария
 */
function toggleCommentDropdown(button) {
    const dropdown = button.closest('.comment-dropdown');
    if (!dropdown) return;

    const menu = dropdown.querySelector('.comment-dropdown-menu');
    if (!menu) return;

    document.querySelectorAll('.comment-dropdown-menu.show').forEach(m => {
        if (m !== menu) {
            m.classList.remove('show');
        }
    });

    menu.classList.toggle('show');
}

/**
  * Обновление счетчика комментариев у поста
  */
 function updateCommentCount(postId, newCount) {
     // Обновляем в модальном окне
     const modalCommentsCount = document.getElementById('modalCommentsCountValue');
     if (modalCommentsCount) {
         modalCommentsCount.textContent = newCount;
     }

     // Обновляем в списке постов
     const postItem = document.getElementById('post-' + postId);
     if (postItem) {
         const commentsCountSpan = postItem.querySelector('.post-comments-count span');
         if (commentsCountSpan) {
             commentsCountSpan.textContent = newCount;
         }
     }
 }

 /**
  * Отправка комментария
  */
 function submitComment() {
     const modal = document.getElementById('postModal');
     const postId = modal.dataset.postId;
     const input = document.getElementById('commentInput');
     const text = input.value.trim();

     if (!text) {
         alert('Напишите текст комментария');
         return;
     }

     const csrfToken = document.querySelector('meta[name="_csrf"]').content;
     const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

     fetch('/comments/create', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
             [csrfHeader]: csrfToken
         },
         body: `postId=${postId}&text=${encodeURIComponent(text)}`
     })
     .then(response => {
         if (response.ok) {
             // Очищаем поле ввода
             input.value = '';

             // Загружаем обновленный список комментариев
             loadComments(postId);

             // Получаем актуальное количество комментариев
             return fetch(`/api/posts/${postId}/detail`, {
                 method: 'GET',
                 headers: {
                     [csrfHeader]: csrfToken
                 }
             });
         } else {
             alert('Ошибка при добавлении комментария');
             throw new Error('Failed to add comment');
         }
     })
     .then(response => response.json())
     .then(post => {
         // Обновляем счетчик комментариев
         if (post && post.commentsCount !== undefined) {
             updateCommentCount(postId, post.commentsCount);
         }
     })
     .catch(error => {
         console.error('Error:', error);
         // Если не удалось получить обновленный пост, просто увеличиваем счетчик на 1
         // (это может быть неточно, но лучше чем ничего)
         const currentModalCount = document.getElementById('modalCommentsCountValue');
         if (currentModalCount) {
             const currentCount = parseInt(currentModalCount.textContent) || 0;
             updateCommentCount(postId, currentCount + 1);
         }
     });
 }

/**
 * Редактирование комментария
 */
function editComment(commentId) {
    const textElement = document.getElementById('comment-text-' + commentId);
    const editElement = document.getElementById('comment-edit-' + commentId);
    const actionsElement = document.getElementById('comment-edit-actions-' + commentId);

    textElement.style.display = 'none';
    editElement.style.display = 'block';
    editElement.value = textElement.textContent.trim();
    actionsElement.style.display = 'flex';

    // Закрываем dropdown
    const dropdown = document.querySelector(`#comment-${commentId} .comment-dropdown-menu`);
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

/**
 * Отмена редактирования комментария
 */
function cancelEditComment(commentId) {
    const textElement = document.getElementById('comment-text-' + commentId);
    const editElement = document.getElementById('comment-edit-' + commentId);
    const actionsElement = document.getElementById('comment-edit-actions-' + commentId);

    textElement.style.display = 'block';
    editElement.style.display = 'none';
    actionsElement.style.display = 'none';
}

/**
 * Удаление комментария (с локальным обновлением)
 */
function deleteComment(commentId) {
    if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) {
        return;
    }

    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

    fetch('/comments/' + commentId + '/delete', {
        method: 'POST',
        headers: {
            [csrfHeader]: csrfToken
        }
    })
    .then(response => {
        if (response.ok) {
            const modal = document.getElementById('postModal');
            const postId = modal.dataset.postId;

            // Загружаем обновленный список комментариев
            return loadComments(postId).then(() => {
                // Получаем текущее значение счетчика из модального окна
                const currentModalCount = document.getElementById('modalCommentsCountValue');
                if (currentModalCount) {
                    const currentCount = parseInt(currentModalCount.textContent) || 0;
                    const newCount = Math.max(0, currentCount - 1);
                    // Обновляем счетчик локально
                    updateCommentCount(postId, newCount);
                }
            });
        } else {
            alert('Ошибка при удалении комментария');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при удалении комментария');
    });
}

 /**
  * Сохранение комментария (после редактирования)
  */
 function saveComment(commentId) {
     const editElement = document.getElementById('comment-edit-' + commentId);
     const newText = editElement.value.trim();

     if (!newText) {
         alert('Текст комментария не может быть пустым');
         return;
     }

     const csrfToken = document.querySelector('meta[name="_csrf"]').content;
     const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

     fetch('/comments/' + commentId + '/update', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
             [csrfHeader]: csrfToken
         },
         body: 'text=' + encodeURIComponent(newText)
     })
     .then(response => {
         if (response.ok) {
             const modal = document.getElementById('postModal');
             const postId = modal.dataset.postId;

             // Загружаем обновленный список комментариев
             loadComments(postId);

             // Счетчик комментариев не меняется при редактировании,
             // но можно обновить на всякий случай
             return fetch(`/api/posts/${postId}/detail`, {
                 method: 'GET',
                 headers: {
                     [csrfHeader]: csrfToken
                 }
             });
         } else {
             alert('Ошибка при сохранении комментария');
             throw new Error('Failed to save comment');
         }
     })
     .then(response => response.json())
     .then(post => {
         if (post && post.commentsCount !== undefined) {
             updateCommentCount(postId, post.commentsCount);
         }
     })
     .catch(error => {
         console.error('Error:', error);
     });
 }

// Закрытие комментарий dropdown при клике вне
document.addEventListener('click', function(event) {
    if (!event.target.closest('.comment-dropdown')) {
        document.querySelectorAll('.comment-dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

/**
 * Открытие модального окна с постом
 */
function openPostModal(postId) {
    currentModalPostId = postId;

    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

    fetch(`/api/posts/${postId}/detail`, {
        method: 'GET',
        headers: {
            [csrfHeader]: csrfToken
        }
    })
    .then(response => response.json())
    .then(post => {
        // Заполняем данные
        document.getElementById('modalPostAuthor').textContent = post.authorName || post.authorLogin;
        document.getElementById('modalPostLogin').textContent = post.authorLogin;

        // Форматируем дату
        let formattedDate = '';
        if (post.createdAt && Array.isArray(post.createdAt)) {
            const [year, month, day, hour, minute] = post.createdAt;
            const date = new Date(year, month - 1, day, hour, minute);
            if (!isNaN(date.getTime())) {
                formattedDate = date.toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        }
        document.getElementById('modalPostDate').textContent = formattedDate;

        // Отметка (ред.)
        const redactedSpan = document.getElementById('modalPostRedacted');
        if (post.redacted) {
            redactedSpan.style.display = 'inline';
        } else {
            redactedSpan.style.display = 'none';
        }

        const markdownSpan = document.getElementById('modalPostMarkdown')
        if (post.useMarkdown == true) {
            markdownSpan.style.display = 'inline';
        } else {
            markdownSpan.style.display = 'none';
        }

        let contentHtml;
        if (post.useMarkdown == true) {
            contentHtml = post.htmlContent
        } else {
            contentHtml = post.text;
        }
        // Текст поста с Markdown (используем htmlContent)
        document.getElementById('modalPostDetailText').innerHTML = contentHtml;
        document.getElementById('modalEditText').value = post.text;
        document.getElementById('modalEditText').style.display = 'none';
        document.getElementById('modalPostDetailText').style.display = 'block';

        // Изображение
        const imageContainer = document.getElementById('modalPostImage');
        const imageSrc = document.getElementById('modalPostImageSrc');
        if (post.imagePath) {
            imageContainer.style.display = 'block';
            imageSrc.src = post.imagePath;
        } else {
            imageContainer.style.display = 'none';
        }

        // Лайк
        const heartSpan = document.getElementById('modalHeart');
        if (post.likedByCurrentUser) {
            heartSpan.textContent = '❤️';
            heartSpan.classList.add('liked');
        } else {
            heartSpan.textContent = '🤍';
            heartSpan.classList.remove('liked');
        }
        document.getElementById('modalLikesCount').textContent = post.likes || 0;

         // Количество комментариев
        document.getElementById('modalCommentsCountValue').textContent = post.commentsCount || 0;

        // Сохраняем ID поста
        document.getElementById('postModal').dataset.postId = postId;
        document.getElementById('postModal').dataset.isAuthor = post.isAuthor ? 'true' : 'false';

        // Показываем/скрываем dropdown для автора
        const dropdown = document.getElementById('modalPostDropdown');
        if (post.isAuthor) {
            dropdown.style.display = 'inline-block';
        } else {
            dropdown.style.display = 'none';
        }

        // Скрываем кнопки сохранения/отмены
        document.getElementById('modalFooterActions').style.display = 'none';

        loadComments(postId);

        // Показываем модальное окно
        document.getElementById('postModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    })
    .catch(error => {
        console.error('Error loading post detail:', error);
        alert('Ошибка при загрузке поста');
    });
}

/**
 * Закрытие модального окна поста
 */
function closePostModal() {
    document.getElementById('postModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentModalPostId = null;
}

/**
 * Редактирование из модального окна
 */
function editFromModal() {
    const modal = document.getElementById('postModal');
    const postId = modal.dataset.postId;
    const postItem = document.getElementById('post-' + postId);

    // Показываем поле редактирования
    const textElement = document.getElementById('modalPostDetailText');
    const editElement = document.getElementById('modalEditText');

    // Получаем исходный текст из скрытого поля или из data-атрибута
    let originalText = editElement.value;
    if (!originalText || originalText === 'Текст поста') {
        // Если в editElement нет текста, берем из textElement (но только текст, без HTML)
        originalText = textElement.textContent.trim();
    }

    textElement.style.display = 'none';
    editElement.style.display = 'block';
    editElement.value = originalText;

    // Показываем кнопки сохранения/отмены
    document.getElementById('modalFooterActions').style.display = 'flex';

    // Закрываем dropdown
    const dropdown = document.getElementById('modalPostDropdown');
    if (dropdown) {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.classList.remove('show');
        }
    }
}

/**
 * Отмена редактирования из модального окна
 */
function cancelEditFromModal() {
    const textElement = document.getElementById('modalPostDetailText');
    const editElement = document.getElementById('modalEditText');

    // Возвращаем исходное состояние
    textElement.style.display = 'block';
    editElement.style.display = 'none';
    document.getElementById('modalFooterActions').style.display = 'none';
}

/**
 * Сохранение поста из модального окна
 */
function savePostFromModal() {
    const modal = document.getElementById('postModal');
    const postId = modal.dataset.postId;
    const editElement = document.getElementById('modalEditText');
    const newText = editElement.value.trim();

    if (!newText) {
        alert('Текст поста не может быть пустым');
        return;
    }

    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

    fetch('/posts/' + postId + '/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            [csrfHeader]: csrfToken
        },
        body: 'text=' + encodeURIComponent(newText)
    })
    .then(response => {
        if (response.ok) {
            // Загружаем обновленный пост с сервера
            return fetch('/api/posts/' + postId + '/detail', {
                method: 'GET',
                headers: {
                    [csrfHeader]: csrfToken
                }
            });
        } else {
            alert('Ошибка при сохранении поста');
            throw new Error('Save failed');
        }
    })
    .then(response => response.json())
    .then(post => {
        // Обновляем текст в модалке с учетом Markdown
        const textElement = document.getElementById('modalPostDetailText');
        if (textElement) {
            textElement.innerHTML = post.htmlContent || escapeHtml(post.text);
            // Обновляем класс для Markdown
            if (post.useMarkdown) {
                textElement.classList.add('markdown-body');
            } else {
                textElement.classList.remove('markdown-body');
            }
        }

        // Обновляем скрытое поле в модалке
        const editElement = document.getElementById('modalEditText');
        if (editElement) {
            editElement.value = post.text;
        }

        // Обновляем текст на странице (в списке постов)
        const postItem = document.getElementById('post-' + postId);
        if (postItem) {
            const postTextContainer = postItem.querySelector('.post-text');
            if (postTextContainer) {
                postTextContainer.innerHTML = post.htmlContent || escapeHtml(post.text);
                // Обновляем класс для Markdown
                if (post.useMarkdown) {
                    postTextContainer.classList.add('markdown-body');
                } else {
                    postTextContainer.classList.remove('markdown-body');
                }
            }

            // Обновляем скрытое поле для редактирования в списке
            const editTextarea = document.getElementById('edit-' + postId);
            if (editTextarea) {
                editTextarea.value = post.text;
            }

            // Добавляем отметку (ред.)
            const redactedSpan = document.getElementById('modalPostRedacted');
            if (redactedSpan && post.redacted) {
                redactedSpan.style.display = 'inline';
            }

            const dateSpan = postItem.querySelector('.post-date');
            if (dateSpan && post.redacted) {
                let redactedInPost = dateSpan.querySelector('.redacted');
                if (!redactedInPost) {
                    redactedInPost = document.createElement('span');
                    redactedInPost.className = 'redacted';
                    redactedInPost.textContent = '(ред.) ';
                    dateSpan.prepend(redactedInPost);
                }
            }
        }

        // Возвращаем обычный режим
        cancelEditFromModal();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при сохранении поста');
    });
}

/**
 * Удаление из модального окна
 */
function deleteFromModal() {
    const modal = document.getElementById('postModal');
    const postId = modal.dataset.postId;

    // Закрываем модальное окно
    closePostModal();

    // Находим пост в списке
    const postItem = document.getElementById('post-' + postId);
    if (!postItem) {
        console.warn('Post item not found for deletion:', postId);
        return;
    }

    // Ищем кнопку удаления в посте
    const deleteBtn = postItem.querySelector('.btn-delete-dropdown');
    if (deleteBtn) {
        // Имитируем клик по кнопке удаления
        setTimeout(() => {
            deleteBtn.click();
        }, 300);
    } else {
        // Если кнопка не найдена, используем confirmDelete с переданной кнопкой
        const dropdownBtn = postItem.querySelector('.dropdown-toggle');
        if (dropdownBtn) {
            setTimeout(() => {
                confirmDelete(dropdownBtn);
            }, 300);
        } else {
            alert('Ошибка: не удалось найти кнопку удаления');
        }
    }
}

/**
 * Лайк из модального окна
 */
function toggleLikeFromModal(event) {
    if (event) {
        event.stopPropagation();
    }

    const modal = document.getElementById('postModal');
    const postId = modal.dataset.postId;

    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

    fetch('/posts/' + postId + '/like', {
        method: 'POST',
        headers: {
            [csrfHeader]: csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Обновляем лайк в модальном окне
            const heartSpan = document.getElementById('modalHeart');
            if (data.action === 'liked') {
                heartSpan.textContent = '❤️';
                heartSpan.classList.add('liked');
            } else {
                heartSpan.textContent = '🤍';
                heartSpan.classList.remove('liked');
            }
            document.getElementById('modalLikesCount').textContent = data.likesCount;

            // Обновляем лайк на посте в списке
            const postItem = document.getElementById('post-' + postId);
            if (postItem) {
                const likeButton = postItem.querySelector('.btn-like');
                if (likeButton) {
                    const heartSpanInList = likeButton.querySelector('.heart');
                    const likesCountInList = likeButton.querySelector('.likes-count');

                    if (heartSpanInList) {
                        if (data.action === 'liked') {
                            heartSpanInList.textContent = '❤️';
                            heartSpanInList.classList.add('liked');
                        } else {
                            heartSpanInList.textContent = '🤍';
                            heartSpanInList.classList.remove('liked');
                        }
                    }

                    if (likesCountInList) {
                        likesCountInList.textContent = data.likesCount;
                    }
                }
            }
        } else {
            alert(data.message || 'Ошибка при обновлении лайка');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при обновлении лайка');
    });
}

// Закрытие модального окна по клику на фон
document.addEventListener('click', function(event) {
    const modal = document.getElementById('postModal');
    if (event.target === modal) {
        closePostModal();
    }
});

// Закрытие модального окна по Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePostModal();
    }
});