module.exports = {
  apps: [
    {
      name: "backend_connect_access",
      cwd: "../backend/",
      script: "manage.py",
      args: ["runserver", "127.0.0.1:3501"],
      env: {
        DATABASE_URL: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_END_TO_END}`,
        DATA_PLATFORM_NAME: "Connect Access",
        DATA_PLATFORM_DOMAIN_NAME: "example.com",
        DATA_COMPANY_NAME: "Company",
        DATA_COMPANY_EMAIL: "mediation@example.com",
        DATA_ADMIN_NAME: "Roman",
        DATA_ADMIN_EMAIL: "roman@example.com",
        DATA_LOGO_FILENAME: "logo.png",
        DATA_LOGO_FILENAME_SMALL: "logo_small.png",
      },
      exec_mode: "fork",
      instances: "1",
      wait_ready: true,
      autorestart: false,
      max_restarts: 5,
      interpreter: "python",
    },
  ],
};
