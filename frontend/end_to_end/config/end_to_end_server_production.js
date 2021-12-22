const execSync = require("child_process").execSync;

module.exports = {
  buildServer: function (dockerPath, database, outputResult = true) {
    const dockerPathCd = `cd ${dockerPath}`;
    mergeEnvVariables(dockerPathCd, outputResult);
    changeEnvVariables(dockerPathCd, outputResult, database);
    buildDockerImage(dockerPathCd, outputResult);
  },
  startServer: function (dockerPath, outputResult = true) {
    const dockerPathCd = `cd ${dockerPath}`;
    stopDockerImage(dockerPathCd, outputResult);
    prepareDatabase(dockerPathCd, outputResult);
    startDockerImage(dockerPathCd, outputResult);
    execute(`sleep 25`, outputResult);
    showLogs(dockerPathCd, outputResult);
  },
  stopServer: function (dockerPath, outputResult = true) {
    const dockerPathCd = `cd ${dockerPath}`;
    stopDockerImage(dockerPathCd, outputResult);
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

function mergeEnvVariables(dockerPathCd, outputResult) {
  execute(
    `${dockerPathCd} && ./merge_production_dotenvs_in_dotenv.sh`,
    outputResult
  );
}

function changeEnvVariables(dockerPathCd, outputResult, database) {
  execute(
    `${dockerPathCd} && echo "DATABASE_URL=${database}" >> .env_production`,
    outputResult
  );
  /* when run for end to end tests, we make sure the real emails will not be sent */
  changeEnvVariable("DJANGO_EMAIL_HOST", "", dockerPathCd, outputResult);
  execute(
    `${dockerPathCd} && echo 'DJANGO_EMAIL_HOST_USER=""' >> .env_production`,
    outputResult
  );
  execute(
    `${dockerPathCd} && echo 'DJANGO_EMAIL_HOST_PASSWORD=""' >> .env_production`,
    outputResult
  );
  changeEnvVariable("APPLICATION_PORT", "6001", dockerPathCd, outputResult);
  changeEnvVariable(
    "DATA_PLATFORM_NAME",
    "Connect Access",
    dockerPathCd,
    outputResult
  );
  if (process.env.CI) {
    changeEnvVariable(
      "DJANGO_ALLOWED_HOSTS",
      "docker,localhost",
      dockerPathCd,
      outputResult
    );
  }
}

function changeEnvVariable(
  variableName,
  replaceValue,
  dockerPathCd,
  outputResult
) {
  execute(
    `${dockerPathCd} && grep -v "${variableName}" .env_production > .env_production_temp && rm .env_production && mv .env_production_temp .env_production && echo '${variableName}=${replaceValue}' >> .env_production`,
    outputResult
  );
}

function buildDockerImage(dockerPathCd, outputResult) {
  execute(`echo "REACT_APP_CI=1" > .env`, outputResult);
  execute(
    `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production build --build-arg BUILDKIT_INLINE_CACHE=1`,
    outputResult
  );
  execute(`rm .env`, outputResult);
}

function stopDockerImage(dockerPathCd, outputResult) {
  execute(
    `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production down`,
    outputResult
  );
}

function prepareDatabase(dockerPathCd, outputResult) {
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
}

function startDockerImage(dockerPathCd, outputResult) {
  execute(
    `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production up -d`,
    outputResult
  );
}

function showLogs(dockerPathCd, outputResult) {
  execute(
    `echo 'docker-compose -f production.yml --env-file .env_production logs' && ${dockerPathCd} && docker-compose -f production.yml --env-file .env_production logs`,
    outputResult
  );
}
