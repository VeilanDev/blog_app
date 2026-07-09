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