/**
 * ПАГИНАЦИЯ ПОЛЬЗОВАТЕЛЕЙ
 */

// Настройки пагинации
const USERS_PER_PAGE = 10;

let currentPage = 0;
let isLoading = false;
let hasMore = true;

const currentUserLogin = document.querySelector('meta[name="currentUserLogin"]')?.content || '';

/**
 * Загрузка следующей порции пользователей
 */
function loadMoreUsers() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    showLoadingIndicator();

    const csrfToken = document.querySelector('meta[name="_csrf"]').content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

    fetch(`/api/users?page=${currentPage}&size=${USERS_PER_PAGE}`, {
        method: 'GET',
        headers: {
            [csrfHeader]: csrfToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.users && data.users.length > 0) {
            const usersList = document.querySelector('.users-list');
            data.users.forEach(user => {
                const userHtml = createUserElement(user);
                usersList.insertAdjacentHTML('beforeend', userHtml);
            });

            currentPage++;
            hasMore = data.hasNext;

            if (!hasMore) {
                showNoMoreUsers();
            }
        } else {
            hasMore = false;
            showNoMoreUsers();
        }

        isLoading = false;
        hideLoadingIndicator();
    })
    .catch(error => {
        console.error('Error loading users:', error);
        isLoading = false;
        hideLoadingIndicator();
    });
}

/**
 * Создание HTML для одного пользователя
 */
function createUserElement(user) {
    const displayName = user.name || user.login;
    const isCurrentUser = user.login === currentUserLogin;
    const currentUserLabel = isCurrentUser ? ' <span class="current-user-badge">(Вы)</span>' : '';

    return `
        <li>
            <div class="user-item">
                <div class="user-avatar" hidden>
                    <span class="avatar-placeholder">${displayName.charAt(0).toUpperCase()}</span>
                </div>
                <div class="user-info">
                    <div class="user-name">${escapeHtml(displayName)}${currentUserLabel}</div>
                    <div class="user-login">${escapeHtml(user.login)}</div>
                </div>
                <div class="user-actions">
                    <a href="/home/${escapeHtml(user.login)}" class="btn-view-profile">Перейти в профиль</a>
                </div>
            </div>
        </li>
    `;
}

/**
 * Экранирование HTML для защиты от XSS
 */
function escapeHtml(text) {
    if (!text) return '';
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
        document.querySelector('.users-list').parentNode.appendChild(indicator);
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
 * Показывает сообщение "Все пользователи загружены"
 */
function showNoMoreUsers() {
    let noMore = document.getElementById('noMoreUsers');
    if (!noMore) {
        noMore = document.createElement('div');
        noMore.id = 'noMoreUsers';
        noMore.className = 'no-more-users';
        noMore.textContent = '🎉 Все пользователи загружены';
        document.querySelector('.users-list').parentNode.appendChild(noMore);
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

        if (pageHeight - scrollPosition < 200) {
            loadMoreUsers();
        }
    }, 100);
});

// Инициализация: загрузка первой порции пользователей
document.addEventListener('DOMContentLoaded', function() {
    loadMoreUsers();
});