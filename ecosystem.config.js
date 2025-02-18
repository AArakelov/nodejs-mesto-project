require('dotenv').config({ path: '.env.deploy' }); // Подключаем переменные из .env.deploy

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DB_URL: process.env.DB_URL,
        JWT_SECRET: process.env.JWT_SECRET,
      },
    },
    {
      name: 'mesto-frontend',
      script: 'npx serve -s build',
      env: {
        NODE_ENV: 'production',
        PORT: 80,
      },
    },
  ],

  deploy: {
    production: {
      user: process.env.SERVER_USER,
      host: process.env.SERVER_HOST,
      ref: 'origin/main',
      repo: process.env.GIT_REPO,
      path: process.env.SERVER_PATH,
      'pre-setup': 'sudo apt update && sudo apt install -y git',
      'post-setup': 'ls -la',
      'pre-deploy': `scp ./*.env ${process.env.SERVER_USER}@${process.env.SERVER_HOST}:${process.env.SERVER_PATH}`,
      'post-deploy': `npm install && npm run build && pm2 reload ecosystem.config.js --env production`,
    },
  },
};
