// app.ts
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import { httpErrors } from './utils/constants';

import auth from './middlewares/auth';
import { createUser, login } from './controllers/user';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';

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
const PORT = 3000;

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
    .json({ message: httpErrors.NOT_FOUND_ERROR.message });
});
// Подключение к MongoDB
const MONGO_URI = 'mongodb://localhost:27017/mestodb';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDb connected');
  })
  .catch(() => {
  });

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listen port: http://localhost:${PORT}`);
});
