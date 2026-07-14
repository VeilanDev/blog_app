/**
 * ПАГИНАЦИЯ ПОЛЬЗОВАТЕЛЕЙ
 */

// Настройки пагинации
const USERS_PER_PAGE = 10;

let currentPage = 0;
let isLoading = false;
let hasMore = true;
let searchQuery = '';
let isSearching = false;
let searchTimeout = null;

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

    let url = `/api/users?page=${currentPage}&size=${USERS_PER_PAGE}`;

    // Если есть поисковый запрос — добавляем его в URL
    if (searchQuery && searchQuery.trim()) {
        url += `&query=${encodeURIComponent(searchQuery.trim())}`;
    }

    fetch(url, {
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
            if (currentPage === 0) {
                showNoUsersFound();
            } else {
                showNoMoreUsers();
            }
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
 * Поиск пользователей с debounce (задержка 500ms)
 */
function searchUsers(query) {
    searchQuery = query;

    // Отменяем предыдущий таймер
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

     if (!searchQuery || !searchQuery.trim()) {
        searchTimeout = setTimeout(() => {
            clearSearch();
        }, 300); // Небольшая задержка для плавности
        return;
    }

    // Устанавливаем новый таймер
    searchTimeout = setTimeout(() => {
        performSearch();
    }, 500);
}

/**
 * Выполнение поиска
 */
function performSearch() {
    // Сбрасываем пагинацию
    currentPage = 0;
    hasMore = true;
    isSearching = true;

    // Очищаем список
    const usersList = document.querySelector('.users-list');
    if (usersList) {
        usersList.innerHTML = '';
    }

    // Скрываем старые сообщения
    const noMore = document.getElementById('noMoreUsers');
    if (noMore) noMore.style.display = 'none';

    const noResults = document.getElementById('noResults');
    if (noResults) noResults.remove();

    // Загружаем первую страницу
    loadMoreUsers();
}

/**
 * Создание HTML для одного пользователя
 */
function createUserElement(user) {
    const displayName = user.name || user.login;
    const isCurrentUser = user.login === currentUserLogin;
    const currentUserLabel = isCurrentUser ? ' <span class="user-name">(Вы)</span>' : '';

    return `
        <li>
            <div class="user-item" onclick="window.location.href='/home/${escapeHtml(user.login)}'">
                <div class="user-info">
                    <div class="user-name">${escapeHtml(displayName)}${currentUserLabel}</div>
                    <div class="user-login">${escapeHtml(user.login)}</div>
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
        const list = document.querySelector('.users-list');
        if (list && list.parentNode) {
            list.parentNode.appendChild(indicator);
        }
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
 * Показывает сообщение "Конец списка пользователей"
 */
function showNoMoreUsers() {
    let noMore = document.getElementById('noMoreUsers');
    if (!noMore) {
        noMore = document.createElement('div');
        noMore.id = 'noMoreUsers';
        noMore.className = 'no-more-users';
        noMore.textContent = 'Конец списка пользователей';
        const list = document.querySelector('.users-list');
        if (list && list.parentNode) {
            list.parentNode.appendChild(noMore);
        }
    }
    noMore.style.display = 'block';
}

/**
 * Показывает сообщение "Пользователи не найдены"
 */
function showNoUsersFound() {
    let noResults = document.getElementById('noResults');
    if (!noResults) {
        noResults = document.createElement('div');
        noResults.id = 'noResults';
        noResults.className = 'no-results';
        noResults.textContent = 'Пользователи не найдены';
        const list = document.querySelector('.users-list');
        if (list && list.parentNode) {
            list.parentNode.appendChild(noResults);
        }
    }
    noResults.style.display = 'block';
}

/**
 * Очистка поиска (показывает всех пользователей)
 */
function clearSearch() {
    searchQuery = '';
    currentPage = 0;
    hasMore = true;
    isSearching = false;

    // Отменяем таймер, если был
    if (searchTimeout) {
        clearTimeout(searchTimeout);
        searchTimeout = null;
    }

    // Очищаем список
    const usersList = document.querySelector('.users-list');
    if (usersList) {
        usersList.innerHTML = '';
    }

    // Скрываем старые сообщения
    const noMore = document.getElementById('noMoreUsers');
    if (noMore) noMore.style.display = 'none';

    const noResults = document.getElementById('noResults');
    if (noResults) noResults.remove();

    // Загружаем всех пользователей
    loadMoreUsers();
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

// Добавляем обработчик клавиши Enter для мгновенного поиска
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('searchInput');
        if (document.activeElement === input) {
            // Отменяем таймер и выполняем поиск сразу
            if (searchTimeout) {
                clearTimeout(searchTimeout);
                searchTimeout = null;
            }
            if (!searchQuery || !searchQuery.trim()) {
                clearSearch();
            } else {
                performSearch();
            }
        }
    }
});

// Инициализация: загрузка первой порции пользователей
document.addEventListener('DOMContentLoaded', function() {
    loadMoreUsers();
});