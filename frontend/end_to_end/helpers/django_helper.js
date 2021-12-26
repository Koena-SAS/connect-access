"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
const helper_1 = __importDefault(require("@codeceptjs/helper"));
const child_process_1 = __importDefault(require("child_process"));
const execSync = child_process_1.default.execSync;
class DjangoHelper extends helper_1.default {
  constructor(config) {
    super(config);
    this.backendPath = config.backendPath;
    this.database = config.database;
  }
  runDjangoCommand(command) {
    const djangoEnv = `cd ${this.backendPath} && DATABASE_URL=${this.database}`;
    execute(`${djangoEnv} python manage.py ${command}`);
  }
}
function execute(command) {
  let output = execSync(command, {
    encoding: "utf-8",
  });
  if (output) {
    console.log("__________\n", output);
  }
}
module.exports = DjangoHelper;
