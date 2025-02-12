import dotenv                from 'dotenv';
import {cleanEnv, port, str} from 'envalid';

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port({default: 3000}),
  DB_URL: str({default: 'mongodb://localhost:27017/mestodb;'}),
  JWT_SECRET: str({default: 'your-secret-key'}),
  JWT_EXPIRES_IN: str({default: '7d'}),
});

export default {
  port: env.PORT,
  dbUrl: env.DB_URL,
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN
};
