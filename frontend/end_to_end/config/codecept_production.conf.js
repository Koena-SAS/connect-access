require("ts-node/register");
const { setHeadlessWhen } = require("@codeceptjs/configure");

setHeadlessWhen(process.env.CI);
const host = process.env.CI ? "docker" : "localhost";

const server = require("./end_to_end_server_production");
const dockerPath = "../";
const database =
  "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB_END_TO_END";

exports.config = {
  tests: "../tests/*_test.ts",
  output: "../output",
  helpers: {
    Playwright: {
      url: `http://${host}:6001`,
      show: true,
      browser: "chromium",
    },
    AxeHelper: {
      require: "../helpers/axe_helper.ts",
    },
    ApiDataFactory: {
      endpoint: `http://${host}:6001`,
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
      require: "../helpers/django_helper_production.ts",
      database: database,
      dockerPath: dockerPath,
    },
  },
  include: {
    I: "./steps_file.js",
  },
  async bootstrap() {
    await server.buildServer(dockerPath, database, true);
    await server.startServer(dockerPath, true);
  },
  async teardown() {
    await server.stopServer(dockerPath, true);
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
