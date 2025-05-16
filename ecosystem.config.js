module.exports = {
  apps: [
    {
      name: "Testboy",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "1",
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NODE_OPTIONS: "--max-old-space-size=1024",
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "/var/log/cycleai-nextjs-err.log",
      out_file: "/var/log/cycleai-nextjs-out.log",
      merge_logs: true,
    },
  ],
};
