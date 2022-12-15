COMPOSE_FILE=local.yml
DOCKER_COMPOSE_CMD="docker compose -f $(COMPOSE_FILE)"
DOCKER_RUN_CMD="$(DOCKER_COMPOSE_CMD) run -w /app/backend/ django"
POETRY_RUN_CMD="cd backend && poetry run"

MAKE_BACKEND="$(MAKE) -C backend/"

# docker

docker-build:
	eval $(DOCKER_COMPOSE_CMD) build

docker-up:
	eval $(DOCKER_COMPOSE_CMD) up
