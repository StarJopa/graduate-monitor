SHELL := /bin/bash
.ONESHELL:
.PHONY: setup install-db install-backend install-frontend seed run clean

setup:
	@echo "🔧 Настройка окружения..."
	@if [ ! -f infra/.env ]; then cp infra/.env.example infra/.env; echo "infra/.env создан"; fi
	@if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env; echo "backend/.env создан"; fi
	$(MAKE) install-db
	$(MAKE) install-backend
	$(MAKE) install-frontend
	$(MAKE) seed

install-db:
	@echo "Запуск PostgreSQL и Redis..."
	docker compose -f infra/docker-compose.yml up -d --wait
	@echo "Ожидание инициализации БД (5 сек)..."
	@sleep 5

install-backend:
	@echo "Создание venv и установка зависимостей Python..."
	cd backend
	python3.12 -m venv .venv
	.venv/bin/pip install --upgrade pip
	.venv/bin/pip install -r requirements.txt

install-frontend:
	@echo "⚛️  Установка зависимостей Node.js..."
	cd frontend
	npm install

seed:
	@echo "🌱 Применение миграций..."
	@cd backend && \
	if ! .venv/bin/python -c "from sqlalchemy import create_engine, inspect; e=create_engine('$(shell grep DB_NAME backend/.env | cut -d= -f2)'); print('OK' if 'users' in inspect(e).get_table_names() else 'NO_TABLE')" 2>/dev/null | grep -q "NO_TABLE"; then \
	  .venv/bin/alembic upgrade head; \
	else \
	  echo "✅ Таблицы уже существуют, пропускаем миграцию"; \
	fi

run:
	@echo "Запуск серверов разработки..."
	@echo "   Backend:  http://127.0.0.1:8000/docs"
	@echo "   Frontend: http://localhost:5173"
	@echo "Для остановки нажмите Ctrl+C"
	cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000 &
	cd frontend && npx vite &
	wait

clean:
	@echo "Остановка контейнеров и удаление локальных зависимостей..."
	docker compose -f infra/docker-compose.yml down -v
	rm -rf backend/.venv frontend/node_modules