COMPOSE_FILE=local.yml
DOCKER_COMPOSE_CMD="docker compose -f $(COMPOSE_FILE)"
DOCKER_RUN_CMD="$(DOCKER_COMPOSE_CMD) run -w /app/backend/ django"

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

poetry-lock:
	cd backend \
	&& poetry lock

export-requirements: poetry poetry-lock
	cd backend \
	&& poetry export -o requirements/base.txt --without-hashes \
	&& poetry export --only code_quality -o requirements/code_quality.txt --without-hashes \
	&& poetry export --with dev,code_quality,plugins -o requirements/local.txt --without-hashes \
	&& poetry export --with prod,plugins -o requirements/production.txt --without-hashes \

wheels:
	cd backend \
	&& pip wheel --wheel-dir ./wheels -r requirements.dev.txt


docker-build:
	# docker compose -f $(COMPOSE_FILE) build
	eval $(DOCKER_COMPOSE_CMD) build

docker-up:
	eval $(DOCKER_COMPOSE_CMD) up

docker-migrate:
	eval $(DOCKER_RUN_CMD) python manage.py migrate $(APPS)

docker-makemigrations:
	eval $(DOCKER_RUN_CMD) python manage.py makemigrations $(APPS)

docker-test:
	eval $(DOCKER_COMPOSE_CMD) run \
		-w /app/backend/connect_access/ django \
		pytest
