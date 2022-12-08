COMPOSE_FILE=local.yml

clean-backend:
	cd backend \
	&& rm requirements.dev.txt \
	&& rm wheels -rf \
	&& find . -name '*.pyc' -delete \
	&& find . -name '__pycache__' -delete \
	&& rm -Rf *.egg-info \
	&& rm -Rf dist/ \
	&& rm -Rf build/ \

clean : clean-backend

install: poetry
	cd backend \
	poetry install --with dev

poetry:
	@if ! poetry --version &> /dev/null; then\
		curl -sSL https://install.python-poetry.org | python3 -;\
	fi

requirements-dev: poetry
	cd backend \
	&& poetry lock \
	&& poetry export --with dev,plugins -o requirements.dev.txt --without-hashes

wheels:
	cd backend \
	&& pip wheel --wheel-dir ./wheels -r requirements.dev.txt

_docker-build:
	docker compose -f $(COMPOSE_FILE) build

docker-build: requirements-dev wheels _docker-build clean

docker-up:
	docker compose -f $(COMPOSE_FILE) up

docker-migrate:
	docker compose -f $(COMPOSE_FILE) run -w /app/backend/ django python manage.py migrate $(APPS)

docker-makemigrations:
	docker compose -f $(COMPOSE_FILE) run -w /app/backend/ django python manage.py makemigrations $(APPS)

docker-run-tests:
	docker compose -f $(COMPOSE_FILE) run \
		-w /app/backend/connect_access/ django \
		pytest
