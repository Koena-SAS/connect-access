module.exports = {
  apps: [
    {
      name: "backend_connect_access",
      cwd: "../backend/",
      script: "manage.py",
      args: ["runserver", "127.0.0.1:3501"],
      env: {
        DATABASE_URL: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_END_TO_END}`,
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
