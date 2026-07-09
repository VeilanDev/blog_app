/**
 * Включение режима редактирования
 */
function enableEdit(button) {
    const postId = button.dataset.postId;
    const textElement = document.getElementById('text-' + postId);
    const editElement = document.getElementById('edit-' + postId);

    // Скрываем текст, показываем поле для редактирования
    textElement.style.display = 'none';
    editElement.style.display = 'block';
    editElement.value = textElement.textContent.trim();

    // Меняем кнопки
    button.style.display = 'none';
    document.querySelector(`.btn-save[data-post-id="${postId}"]`).style.display = 'inline-flex';
    document.querySelector(`.btn-cancel[data-post-id="${postId}"]`).style.display = 'inline-flex';
}

/**
 * Отмена редактирования
 */
function cancelEdit(button) {
    const postId = button.dataset.postId;
    const textElement = document.getElementById('text-' + postId);
    const editElement = document.getElementById('edit-' + postId);

    // Возвращаем исходное состояние
    textElement.style.display = 'block';
    editElement.style.display = 'none';

    // Возвращаем кнопки
    document.querySelector(`.btn-edit[data-post-id="${postId}"]`).style.display = 'inline-flex';
    document.querySelector(`.btn-cancel[data-post-id="${postId}"]`).style.display = 'none';
    document.querySelector(`.btn-save[data-post-id="${postId}"]`).style.display = 'none';
}

/**
 * Сохранение поста
 */
function savePost(button) {
    const postId = button.dataset.postId;
    const editElement = document.getElementById('edit-' + postId);
    const newText = editElement.value.trim();

    if (!newText) {
        alert('Текст поста не может быть пустым');
        return;
    }

    // Отправляем запрос на сервер
    fetch('/posts/' + postId + '/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').content
        },
        body: 'text=' + encodeURIComponent(newText)
    })
    .then(response => {
        if (response.ok) {
            // Обновляем текст на странице
            const textElement = document.getElementById('text-' + postId);
            textElement.textContent = newText;

            // Обновляем отметку (ред.)
            const postItem = document.getElementById('post-' + postId);
            const dateSpan = postItem.querySelector('.post-date');

            // Проверяем, есть ли уже отметка
            let redactedSpan = dateSpan.querySelector('.redacted');
            if (!redactedSpan) {
                redactedSpan = document.createElement('span');
                redactedSpan.className = 'redacted';
                redactedSpan.textContent = '(ред.) ';
                dateSpan.prepend(redactedSpan);
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