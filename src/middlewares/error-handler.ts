import { Request, Response } from 'express';
import { httpErrors } from '../utils/constants';
import BaseError from '../utils/base-error';

export default (err: BaseError, req: Request, res: Response) => {
  const statusCode = err.statusCode || httpErrors.SERVER_ERROR.statusCode;
  const message = err.message || httpErrors.SERVER_ERROR.message;

  res.status(statusCode).send({
    statusCode,
    message,
  });
};
