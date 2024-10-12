// app.ts
import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import {errors} from 'celebrate';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import {httpErrors} from './utils/constants';

import auth from './middlewares/auth';
import {createUser, login} from './controllers/user';
import errorHandler from './middlewares/error-handler';
import {errorLogger, requestLogger} from './middlewares/logger';
import config from './config';

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
      };
    }
  }
}
const app = express();

app.use(express.json());
app.use(requestLogger);
app.post('/signin', login);
app.post('/signup', createUser);

// авторизация
app.use(auth);

app.use(userRoutes);
app.use(cardRoutes);
app.use((req: Request, res: Response) => {
  res.status(httpErrors.NOT_FOUND_ERROR.statusCode)
    .json({message: httpErrors.NOT_FOUND_ERROR.message});
});
// Подключение к MongoDB
const {port} = config;
const dbUrl: string = config.dbUrl as string;
mongoose.connect(dbUrl)
  .then(() => {
    console.log('MongoDb connected');
  })
  .catch(() => {
  });

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listen port: http://localhost:${port}`);
});
