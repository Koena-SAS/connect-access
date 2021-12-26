require("ts-node/register");
const { setHeadlessWhen } = require("@codeceptjs/configure");

setHeadlessWhen(process.env.CI);

var server = require("./end_to_end_server_dvelopment");
const backendPath = "../backend";
const database =
  "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB_END_TO_END";

exports.config = {
  tests: "../*_test.ts",
  output: "../output",
  helpers: {
    Playwright: {
      url: "http://localhost:3501",
      show: true,
      browser: "chromium",
    },
    AxeHelper: {
      require: "../helpers/axe_helper.ts",
    },
    ApiDataFactory: {
      endpoint: "http://localhost:3501",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      factories: {
        user: {
          uri: "/auth/users/",
          factory: "../factories/user",
          delete: () => ({
            method: "delete",
            url: "/users/me/",
            data: { current_password: "strongestpasswordever" },
          }),
        },
      },
    },
    DjangoHelper: {
      require: "../helpers/django_helper.ts",
      database: database,
      backendPath: backendPath,
    },
  },
  include: {
    I: "./steps_file.js",
  },
  async bootstrap() {
    await server.startBackend(backendPath, database, false);
    await server.startFrontend(true);
  },
  async teardown() {
    await server.stopFrontend(false);
    await server.stopBackend(false);
  },
  mocha: {},
  name: "connect_access",
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
    customLocator: {
      enabled: true,
      attribute: "data-testid",
    },
  },
};
