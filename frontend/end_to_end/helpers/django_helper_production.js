"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
const helper_1 = __importDefault(require("@codeceptjs/helper"));
const child_process_1 = __importDefault(require("child_process"));
const execSync = child_process_1.default.execSync;
class DjangoProductionHelper extends helper_1.default {
  constructor(config) {
    super(config);
    this.dockerPath = config.dockerPath;
    this.databasePath = config.database;
  }
  runDjangoCommand(command) {
    const dockerPathCd = `cd ${this.dockerPath}`;
    const databaseEnv = `-e DATABASE_URL=${this.databasePath}`;
    execute(
      `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production run ${databaseEnv} django python backend/manage.py ${command}`
    );
  }
}
function execute(command) {
  execSync(command, {
    encoding: "utf-8",
    stdio: "inherit",
  });
}
module.exports = DjangoProductionHelper;
