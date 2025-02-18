require('dotenv').config({ path: '.env.deploy' });

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        JWT_SECRET: process.env.JWT_SECRET,
      },
    },
    {
      name: 'mesto-frontend',
      script: 'npx serve -s build',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.FRONTEND_PORT,
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

      'post-deploy': `
        export NVM_DIR=~/.nvm
        source ~/.nvm/nvm.sh
        npm install
        npm run build
        pm2 reload ecosystem.config.js --env production
      `,
    },
  },
};
