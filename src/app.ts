import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';
import { ERRORS } from './utils/errors';

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

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '670778e03d219421f3e8c87e',
  };

  next();
});
app.use(express.json());
app.use(userRoutes);
app.use(cardRoutes);
app.use((req: Request, res: Response) => {
  res.status(ERRORS.NOT_FOUND_ERROR.statusCode).json({ message: ERRORS.NOT_FOUND_ERROR.message });
});
// Подключение к MongoDB
const MONGO_URI = 'mongodb://localhost:27017/mestodb';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDb connected');
  })
  .catch(() => {
  });

app.listen(PORT, () => {
  console.log(`Server listen port: http://localhost:${PORT}`);
});
