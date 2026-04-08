.PHONY: setup install-db install-backend install-frontend seed run clean

setup:
	@echo "🔧 Настройка окружения..."
	@if [ ! -f infra/.env ]; then cp infra/.env.example infra/.env; echo " infra/.env создан"; fi
	@if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env; echo " backend/.env создан"; fi
	$(MAKE) install-db
	$(MAKE) install-backend
	$(MAKE) install-frontend
	$(MAKE) seed

install-db:
	@echo "Запуск PostgreSQL и Redis..."
	docker compose -f infra/docker-compose.yml up -d --wait
	@echo "Ожидание инициализации БД..."
	@sleep 5

install-backend:
	@echo "Установка зависимостей Python..."
	cd backend && python3.12 -m venv .venv && \
	source .venv/bin/activate && \
	pip install --upgrade pip && \
	pip install -r requirements.txt

install-frontend:
	@echo "Установка зависимостей Node.js..."
	cd frontend && npm install

seed:
	@echo "Применение миграций и наполнение БД..."
	cd backend && source .venv/bin/activate && \
	alembic upgrade head && \
	python -m scripts.seed

run:
	@echo "Запуск серверов..."
	@echo "   Backend:  http://127.0.0.1:8000/docs"
	@echo "   Frontend: http://localhost:5173"
	@cd backend && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000 &
	@cd frontend && npm run dev &

clean:
	docker compose -f infra/docker-compose.yml down -v
	rm -rf backend/.venv frontend/node_modules
	@echo "Окружение очищено"