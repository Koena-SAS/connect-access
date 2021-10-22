module.exports = {
  apps: [
    {
      name: "frontend_connect_access",
      script: "node_modules/react-app-rewired/scripts/start.js",
      env: {
        PORT: "3502",
        BROWSER: "none",
      },
      exec_mode: "fork",
      instances: "1",
      wait_ready: true,
      autorestart: false,
      max_restarts: 5,
    },
  ],
};
