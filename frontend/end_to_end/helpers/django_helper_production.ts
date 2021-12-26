import Helper from "@codeceptjs/helper";
import child from "child_process";

const execSync = child.execSync;

class DjangoProductionHelper extends Helper {
  private dockerPath: string;
  private databasePath: string;

  constructor(config: { dockerPath: string; database: string }) {
    super(config);
    this.dockerPath = config.dockerPath;
    this.databasePath = config.database;
  }
  runDjangoCommand(command: string): void {
    const dockerPathCd = `cd ${this.dockerPath}`;
    const databaseEnv = `-e DATABASE_URL=${this.databasePath}`;
    execute(
      `${dockerPathCd} && docker-compose -f production.yml --env-file .env_production run ${databaseEnv} django python backend/manage.py ${command}`
    );
  }
}

function execute(command: string): void {
  execSync(command, {
    encoding: "utf-8",
    stdio: "inherit",
  });
}

export = DjangoProductionHelper;
