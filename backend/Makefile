ENV=local
COMPOSE_FILE=../${ENV}.yml
DOCKER_COMPOSE_CMD="docker compose -f $(COMPOSE_FILE)"
DOCKER_RUN_CMD="$(DOCKER_COMPOSE_CMD) run -w /app/backend/ django"

setup: install-poetry setup-poetry

setup-poetry:
	@if [ $(ENV) = "local" ]; then \
		poetry install --with dev,code_quality,plugins; \
	fi
	@if [ $(ENV) = "prod" ]; then \
		poetry install --with prod; \
	fi

clean:
	@find . -name '*.pyc' -delete
	@find . -name '__pycache__' -delete
	@rm -Rf *.egg-info
	@rm -Rf dist/
	@rm -Rf build/

install-poetry:
	@if [ "$(shell which poetry)" = "" ]; then \
		curl -sSL https://install.python-poetry.org | python3 -;\
	fi

poetry-lock:
	poetry lock

export-requirements: poetry-lock
	poetry export -o requirements/base.txt --without-hashes
	poetry export --only code_quality -o requirements/code_quality.txt --without-hashes
	poetry export --with dev,code_quality,plugins -o requirements/local.txt --without-hashes
	poetry export --with prod,plugins -o requirements/production.txt --without-hashes

wheels: poetry-lock
	pip wheel --wheel-dir ./wheels -r ./requirements/base.txt

### django management commands

django-command:
ifeq ($(USE_DOCKER), no)
	poetry run manage.py $(COMMAND)
else
	eval $(DOCKER_RUN_CMD) python manage.py $(COMMAND)
endif


migrate:
ifeq ($(USE_DOCKER), no)
	poetry run manage.py migrate $(APPS)
else
	eval $(DOCKER_RUN_CMD) python manage.py migrate $(APPS)
endif

makemigrations:
ifeq ($(USE_DOCKER), no)
	poetry run manage.py makemigrations $(APPS)
else
	eval $(DOCKER_RUN_CMD) python manage.py makemigrations $(APPS)
endif

django-shell:
ifeq ($(USE_DOCKER), no)
	poetry run manage.py shell
else
	eval $(DOCKER_RUN_CMD) python manage.py shell
endif

createsuperuser:
ifeq ($(USE_DOCKER), no)
	poetry run manage.py createsuperuser
else
	eval $(DOCKER_RUN_CMD) python manage.py createsuperuser
endif

### code quality

pytest:
ifeq ($(USE_DOCKER), no)
	poetry run -m pytest
else
	eval $(DOCKER_COMPOSE_CMD) run \
		-w /app/backend/connect_access/ django \
		pytest
endif

type-checking:
ifeq ($(USE_DOCKER), no)
	poetry run mypy connect_access config --config=setup.cfg
else
	eval $(DOCKER_RUN_CMD) mypy connect_access config --config=setup.cfg
endif

lint:
	poetry run flake8 --config=setup.cfg

formatting:
	poetry run black --check .

code-quality:
	$(MAKE) pytest ; true
	$(MAKE) lint ; true
	$(MAKE) type-checking ; true
	$(MAKE) formatting ; true
