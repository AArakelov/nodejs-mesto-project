import { format, transports } from 'winston';
import path from 'path';
import expressWinston from 'express-winston';

const logFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.json(),
);
// Логгер для запросов
const requestLogger = expressWinston.logger({
  format: logFormat,
  transports: [
    new transports.File({
      filename: path.join(__dirname, 'logs/request.log'),
      level: 'info',
    }),
  ],
});
const errorLogger = expressWinston.errorLogger({
  format: logFormat,
  transports: [
    new transports.File({
      filename: path.join(__dirname, 'logs/error.log'),
      level: 'error',
    }),
  ],
});

export { requestLogger, errorLogger };
