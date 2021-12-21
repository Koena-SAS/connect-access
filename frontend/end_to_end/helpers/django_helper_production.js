const Helper = require("@codeceptjs/helper");
const execSync = require("child_process").execSync;

class DjangoHelper extends Helper {
  constructor(config) {
    super(config);
    this.dockerPath = config.dockerPath;
    this.database = config.database;
  }
  runDjangoCommand(command) {
    const dockerPathCd = `cd ${this.dockerPath}`;
    const databaseEnv = `-e DATABASE_URL=${this.database}`;
    execute(
      `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production run ${databaseEnv} django python backend/manage.py ${command}`
    );
  }
}

module.exports = DjangoHelper;

function execute(command) {
  execSync(command, {
    encoding: "utf-8",
    stdio: "inherit",
  });
}
