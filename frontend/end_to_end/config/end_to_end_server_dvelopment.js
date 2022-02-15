const execSync = require("child_process").execSync;

module.exports = {
  startBackend: function (backendPath, database, outputResult = true) {
    stopBackend(outputResult);
    const djangoEnv = `cd ${backendPath} && DATABASE_URL=${database}`;
    execute(`${djangoEnv} python manage.py reset_db --noinput`, true);
    execute(`${djangoEnv} python manage.py migrate --run-syncdb`, true);
    const superUserEnv = "DJANGO_SUPERUSER_PASSWORD=admin";
    execute(
      `${djangoEnv} ${superUserEnv} python manage.py createsuperuser --noinput --first_name="admin" --last_name="admin" --email="admin@admin.com"`,
      true
    );
    execute("node_modules/.bin/pm2 start pm2_backend.config.js", outputResult);
  },
  startFrontend: function (outputResult = true) {
    stopFrontend(outputResult);
    execute("node_modules/.bin/pm2 start pm2_frontend.config.js", outputResult);
  },
  stopFrontend: function (outputResult = true) {
    stopFrontend(outputResult);
  },
  stopBackend: function (outputResult = true) {
    stopBackend(outputResult);
  },
};

function stopFrontend(outputResult) {
  execute(
    "node_modules/.bin/pm2 stop frontend_connect_access || true",
    outputResult
  );
  execute(
    "node_modules/.bin/pm2 delete frontend_connect_access || true",
    false
  );
}

function stopBackend(outputResult) {
  execute(
    "node_modules/.bin/pm2 stop backend_connect_access || true",
    outputResult
  );
  execute("node_modules/.bin/pm2 delete backend_connect_access || true", false);
}

function execute(command, outputResult = true) {
  let options = {
    encoding: "utf-8",
  };
  if (outputResult) {
    options.stdio = "inherit";
  }
  execSync(command, options);
}
