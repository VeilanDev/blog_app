# Приложение для введения блога

---

<img width="1857" height="989" alt="mYY-9QF-tHOEHwFpAiSETiReZabYyZvxBOqSvlU2CSWcdo2hpLb0IAWa897Zoue5uEbc5iYWj_Cf2PICe5s4OFuOAWGOyg" src="https://github.com/user-attachments/assets/516685af-b340-415e-94bc-799bee11cc7b" />
<img width="1855" height="990" alt="pPdGILO0Jd3Ik85vJspRvkdpvNrk9RdnY1YU3G5g3ivzDDUuDbeieihaVNSKZWbN8KORvuOr7DBsS_Aj3yMLqWmk" src="https://github.com/user-attachments/assets/9af26a43-24f9-4d83-a0e4-bf9e2a9eb6cf" />

---
# Требования

---
# Регистрация (/register)

- name, login, email, password
- login, email являются unique
- name может быть null.
  Если это поле не заполнить, то имени будет присвоен login
- на email приходит письмо с подтверждением данных

# Авторизация (/login)

- вход через login/email и password

# Стена публикаций (/home)

- есть поле для ввода текста с возможностью прикрепления фото
  (форма для создания поста)
- публикации (посты) выстраиваются в бесконечную скрол ленту
- публикации (посты) отсортированы по дате их создания;
  сверху - самые свежие, внизу самые старые.
- публикациям (постам) можно ставить лайки
- под публикациями (постами) можно писать комментарии

# Профиль пользователя (/user)

- отображаются все основные данные пользователя:
    - name
    - login
    - email
- форма для смены данных (name, login, email)
- форма для смены пароля (password)
- при смене пароля, на почту приходит письмо с подтверждением

# Список пользователей (/users_list)

- является списком всех зарегистрированных пользователей
- список представляет из себя бесконечную скрол ленту пользователей
- у пользователей отображается: name, login
- по нажатию на выбранного пользователя, тебя переключает на его стену публикаций
- есть поисковая панель. Поиск производиться по БД по значению name

---

---

# База данных (blog_db)


## Таблицы (tables)

---

### users

| PK  | id            |                  |
| :-: | :------------ | :--------------- |
|     | name          |                  |
|     | login         | unique, not null |
|     | email         | unique, not null |
|     | password_hash | not null         |
|     | role          |                  |
|     | user_hash     |                  |
|     | created_at    |                  |
|     | updated_at    |                  |

### posts

| PK  | id                   |          |
| :-: |:---------------------| :------- |
|     | text                 | not null |
|     | image_url            |          |
| FK  | author_id (users.id) |          |
|     | likes                |          |
|     | created_at           |          |
|     | updated_at           |          |
|     | redacted             | not null |
|     | use_markdown         | not null |

### likes_posts

| PK  | id      |     |
| :-: | ------- | --- |
| FK  | post_id |     |
| FK  | user_id |     |

### comments_post

| PK  | id         |          |
| :-: | ---------- | -------- |
| FK  | post_id    |          |
| FK  | author_id  |          |
|     | text       | not null |
|     | created_at |          |
|     | updated_at |          |

### likes_comments

| PK  | id         |     |
| :-: | ---------- | --- |
| FK  | comment_id |     |
| FK  | user_id    |     |


---

---
