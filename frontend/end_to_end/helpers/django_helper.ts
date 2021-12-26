import Helper from "@codeceptjs/helper";
import child from "child_process";

const execSync = child.execSync;

class DjangoHelper extends Helper {
  private backendPath: string;
  private database: string;

  constructor(config: { backendPath: string; database: string }) {
    super(config);
    this.backendPath = config.backendPath;
    this.database = config.database;
  }
  runDjangoCommand(command: string): void {
    const djangoEnv = `cd ${this.backendPath} && DATABASE_URL=${this.database}`;
    execute(`${djangoEnv} python manage.py ${command}`);
  }
}

function execute(command: string): void {
  let output = execSync(command, {
    encoding: "utf-8",
  });
  if (output) {
    console.log("__________\n", output);
  }
}

export = DjangoHelper;
