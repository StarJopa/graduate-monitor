cat > README.md << 'EOF'
# Веб-приложение для визуализации и мониторинга профессиональных достижений выпускников колледжа

## Курсовой проект
**Студент**: [Ваша Фамилия И.О.]  
**Группа**: [Номер группы]  
**Специальность**: 09.02.07 Информационные системы и программирование  
**Руководитель**: Ларионов Дмитрий Ильич  
**Дата**: Апрель 2026 г.

## Технологический стек
| Компонент      | Технология                | Версия                 |
|----------------|---------------------------|------------------------|
| СУБД           | PostgreSQL                | 17.2-alpine            |
| Кэширование    | Redis                     | 7.4-alpine             |
| Бэкенд         | Python + FastAPI          | 3.12.8 + 0.116.1       |
| ORM            | SQLAlchemy + Alembic      | 2.0.38 + 1.15.1        |
| Фронтенд       | React + TypeScript + Vite | 19.1.0 + 5.8.3 + 6.2.0 |
| UI/Charts      | Ant Design + Recharts     | 5.24.2 + 2.15.2        |
| Стейт          | Zustand                   | 5.0.3                  |
| Инфраструктура | Docker Compose            | 3.9                    |

## Быстрый старт
### Требования
- Windows 11 + WSL2 (Ubuntu 24.04)
- Docker Desktop (интеграция с WSL включена)
- Git, Node.js 22.x, Python 3.12.x

### Установка
```bash
# 1. Клонировать репозиторий
git clone <URL-репозитория>
cd alumni-monitoring

# 2. Запустить инфраструктуру
docker compose -f infra/docker-compose.yml up -d

# 3. Настроить бэкенд
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# 4. Настроить фронтенд
cd ../frontend
npm install
npm run dev
