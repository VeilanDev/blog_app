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

    const textElement = document.getElementById('text-' + postId);
    const editElement = document.getElementById('edit-' + postId);

    if (!textElement || !editElement) {
        console.warn('Text or edit element not found for post:', postId);
        return;
    }

    // Скрываем текст, показываем поле для редактирования
    textElement.style.display = 'none';
    editElement.style.display = 'block';
    editElement.value = textElement.textContent.trim();

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

    const textElement = document.getElementById('text-' + postId);
    const editElement = document.getElementById('edit-' + postId);

    if (!textElement || !editElement) {
        console.warn('Text or edit element not found for post:', postId);
        return;
    }

    // Возвращаем исходное состояние
    textElement.style.display = 'block';
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
            // Обновляем текст на странице
            const textElement = document.getElementById('text-' + postId);
            if (textElement) {
                textElement.textContent = newText;
            }

            // Обновляем отметку (ред.)
            const dateSpan = postItem.querySelector('.post-date');
            if (dateSpan) {
                let redactedSpan = dateSpan.querySelector('.redacted');
                if (!redactedSpan) {
                    redactedSpan = document.createElement('span');
                    redactedSpan.className = 'redacted';
                    redactedSpan.textContent = '(ред.) ';
                    dateSpan.prepend(redactedSpan);
                }
            }

            // Возвращаем обычный режим
            cancelEdit(button);
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
    const textElement = document.getElementById('text-' + postId);

    if (!textElement) {
        console.warn('Text element not found for post:', postId);
        return;
    }

    const postText = textElement.textContent.trim();

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
                noPosts.textContent = 'У вас пока нет публикаций. Создайте свой первый пост!';
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

    return `
        <li>
            <!-- Клик на весь пост открывает модалку, но кнопки перехватывают событие -->
            <div class="post-item" id="post-${post.id}" onclick="openPostModal(${post.id})">
                <div class="post-header">
                    <span class="post-author">${post.authorName || post.authorLogin}</span>
                    <div class="post-header-right">
                        <span class="post-date">
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
                                <button class="dropdown-item btn-edit-dropdown" onclick="event.stopPropagation(); enableEdit(this)" type="button">Редактировать</button>
                                <button class="dropdown-item btn-delete-dropdown" onclick="event.stopPropagation(); confirmDelete(this)" type="button">Удалить</button>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="post-content" onclick="event.stopPropagation();">
                    <p class="post-text" id="text-${post.id}">${escapeHtml(post.text)}</p>
                    <textarea class="post-edit-textarea" id="edit-${post.id}" style="display: none;">${escapeHtml(post.text)}</textarea>
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

        // Текст поста
        document.getElementById('modalPostDetailText').textContent = post.text;
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

    textElement.style.display = 'none';
    editElement.style.display = 'block';
    editElement.value = textElement.textContent.trim();

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
            // Обновляем текст в модалке
            const textElement = document.getElementById('modalPostDetailText');
            textElement.textContent = newText;

            // Обновляем текст на странице
            const postText = document.getElementById('text-' + postId);
            if (postText) {
                postText.textContent = newText;
            }

            // Добавляем отметку (ред.)
            const redactedSpan = document.getElementById('modalPostRedacted');
            redactedSpan.style.display = 'inline';

            const dateSpan = document.querySelector(`#post-${postId} .post-date`);
            if (dateSpan && !dateSpan.querySelector('.redacted')) {
                const redactedInPost = document.createElement('span');
                redactedInPost.className = 'redacted';
                redactedInPost.textContent = '(ред.) ';
                dateSpan.prepend(redactedInPost);
            }

            // Возвращаем обычный режим
            cancelEditFromModal();
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
            const heartSpan = document.getElementById('modalHeart');
            if (data.action === 'liked') {
                heartSpan.textContent = '❤️';
                heartSpan.classList.add('liked');
            } else {
                heartSpan.textContent = '🤍';
                heartSpan.classList.remove('liked');
            }
            document.getElementById('modalLikesCount').textContent = data.likesCount;
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
 * Удаление из модального окна
 */
function deleteFromModal() {
    const modal = document.getElementById('postModal');
    const postId = modal.dataset.postId;
    const postItem = document.getElementById('post-' + postId);

    closePostModal();

    setTimeout(() => {
        const deleteBtn = postItem.querySelector('.btn-delete-dropdown');
        if (deleteBtn) {
            deleteBtn.click();
        } else {
            confirmDelete(deleteBtn);
        }
    }, 300);
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