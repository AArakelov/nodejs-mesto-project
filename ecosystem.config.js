require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        JWT_SECRET: process.env.JWT_SECRET,
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
      'post-setup': 'ls -la',
      'pre-deploy': `scp ./*.env ${process.env.SERVER_USER}@${process.env.SERVER_HOST}:${process.env.SERVER_PATH}`,
      'post-deploy':`npm install && npm run build && pm2 reload ecosystem.config.js --env production`,
    },
  },
};
