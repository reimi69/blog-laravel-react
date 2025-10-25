# Блог с комментариями

Полноценное приложение-блог, разработанное на **Laravel (Backend)** и **React (Frontend)**, с контейнеризацией через **Docker**.  
Реализован базовый CRUD для статей и возможность добавления комментариев.

---

## Функционал

### Backend (Laravel)
- REST API для статей и комментариев:
  - `GET /api/articles` — список статей  
  - `GET /api/articles/{id}` — просмотр статьи  
  - `POST /api/articles` — добавление статьи  
  - `POST /api/articles/{id}/comments` — добавление комментария
- Подключение к MySQL  
- Настроен CORS для работы с фронтендом  

### Frontend (React)
- Просмотр списка статей в виде блога  
- Просмотр отдельной статьи  
- Создание новой статьи  
- Отправка комментариев  
- Современный адаптивный интерфейс на TailwindCSS  

## Технологии
- **Backend**: Laravel, PHP, MySQL, Docker
- **Frontend**: React, TailwindCSS

## Доступ к приложению

Frontend: http://localhost:3000

Backend (API): http://localhost:8000/api/articles


##  Установка и запуск

1. **Клонировать репозиторий**
```bash
git clone https://github.com/reimi69/blog-laravel-react.git
```

2. **Запустить контейнеры**
```bash
cd blog-app/docker
docker-compose up -d --build
```

3. **Установить зависимости Laravel**
```bash
docker-compose exec app composer install
```

4. **Скопировать .env и сгенерировать ключ**
```bash
docker-compose exec app cp .env.example .env
docker-compose exec app php artisan key:generate
```

5. **Выполнить миграции и сиды**
```bash
docker-compose exec app php artisan migrate --seed
```

6. **Установить зависимости фронтенда**
```bash
cd ../frontend
npm install
```

7. **Запустить фронтенд**
```bash
npm start
```

### Структура проекта
```bash
blog-app/
│
├── backend/           # Laravel API
│
├── frontend/          # React-приложение
│
└── docker/            # Docker-конфигурация
```
