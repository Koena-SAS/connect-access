const execSync = require("child_process").execSync;

module.exports = {
  buildServer: function (dockerPath, database, outputResult = true) {
    const dockerPathCd = `cd ${dockerPath}`;
    execute(
      `${dockerPathCd} && ./merge_production_dotenvs_in_dotenv.sh`,
      outputResult
    );
    execute(
      `${dockerPathCd} && echo "REACT_APP_CI=1" >> .env_production`,
      outputResult
    );
    execute(
      `${dockerPathCd} && echo "DATABASE_URL=${database}" >> .env_production`,
      outputResult
    );
    /// when run for end to end tests, we make sure the real emails will not be sent
    execute(
      `${dockerPathCd} && grep -v "DJANGO_EMAIL_HOST" .env_production > .env_production_temp && rm .env_production && mv .env_production_temp .env_production && echo 'DJANGO_EMAIL_HOST=""' >> .env_production`,
      outputResult
    );
    execute(
      `${dockerPathCd} && echo 'DJANGO_EMAIL_HOST=""' >> .env_production`,
      outputResult
    );
    execute(
      `${dockerPathCd} && echo 'DJANGO_EMAIL_HOST_USER=""' >> .env_production`,
      outputResult
    );
    execute(
      `${dockerPathCd} && echo 'DJANGO_EMAIL_HOST_PASSWORD=""' >> .env_production`,
      outputResult
    );
    ///
    execute(
      `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production build --build-arg BUILDKIT_INLINE_CACHE=1`,
      outputResult
    );
  },
  startServer: function (dockerPath, outputResult = true) {
    const dockerPathCd = `cd ${dockerPath}`;
    execute(
      `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production down`,
      outputResult
    );
    execute(
      `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production run django python backend/manage.py reset_db --noinput`,
      outputResult
    );
    execute(
      `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production run django python backend/manage.py migrate --run-syncdb`,
      outputResult
    );
    const superUserEnv = "-e DJANGO_SUPERUSER_PASSWORD=admin";
    execute(
      `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production run ${superUserEnv} django python backend/manage.py createsuperuser --noinput --first_name="admin" --last_name="admin" --email="admin@admin.com"`,
      outputResult
    );
    execute(
      `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production up -d`,
      outputResult
    );
    execute(`sleep 5`, outputResult);
    execute(
      `echo 'Django server IP: ' && docker inspect --format="{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" connect_access_production_traefik_1`,
      outputResult
    );
  },
  stopServer: function (dockerPath, outputResult = true) {
    const dockerPathCd = `cd ${dockerPath}`;
    execute(
      `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production down`,
      outputResult
    );
  },
};

function execute(command, outputResult = true) {
  let options = {
    encoding: "utf-8",
  };
  if (outputResult) {
    options.stdio = "inherit";
  }
  execSync(command, options);
}
