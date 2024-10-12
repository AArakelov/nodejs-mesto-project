import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { httpErrors } from '../utils/constants';
import UnauthorizedError from '../utils/unauthorized-error';
import BaseError from '../utils/base-error';

const { JWT_SECRET = 'your-secret-key' } = process.env;

interface AuthRequest extends Request {
  user: { _id: string };
}

export default (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.jwt || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = { _id: (payload as JwtPayload)._id };
    next();
  } catch (e) {
    const err = new BaseError(
      httpErrors.NOT_AUTHORIZED.message,
      httpErrors.NOT_AUTHORIZED.statusCode,
    );
    next(err.statusCode);
  }
};
