import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {ERROR_TYPES, httpErrors, SUCCESS} from '../utils/constants';
import User, {IUser} from '../models/user';
import BaseError from '../utils/base-error';
import config from "../config";

const {jwtSecret: jwtSecret = 'your-secret-key', jwtExpiresIn = '7d'} = config

export const login = (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body;
  return User.findUserByCredentials(email, password)
    .then((user: IUser) => {
      // Данные для шифрования
      const payload = { _id: user._id };



       const token = jwt.sign(
        payload,
        jwtSecret,
        { expiresIn: "1h" }
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      res.send({message: SUCCESS.OK.message});
    })
    .catch((err: Error) => next(err));
};
export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(SUCCESS.OK.statusCode)
      .json(users))
    .catch((e) => next(e));
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user: IUser) => {
      res.status(SUCCESS.CREATED.statusCode).send(user);
    }).catch((err: any) => {
    if (err.code === 11000) {
      return next(new BaseError(
        httpErrors.CONFLICT_ERROR.message,
        httpErrors.CONFLICT_ERROR.statusCode,
      ));
    }
    if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
      return next(new BaseError(
        httpErrors.VALIDATION_ERROR.message,
        httpErrors.VALIDATION_ERROR.statusCode,
      ));
    }
    return next(err);
  });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(httpErrors.USER_NOT_FOUND.statusCode)
          .json({message: httpErrors.USER_NOT_FOUND.message});
      }
      return res.status(SUCCESS.OK.statusCode)
        .json(user);
    })
    .catch((err) => {
      if (err.name === ERROR_TYPES.CAST_ERROR) {
        return next(new BaseError(
          httpErrors.INVALID_ID_ERROR.message,
          httpErrors.INVALID_ID_ERROR.statusCode,
        ));
      }
      return next(err);
    });
};
export const updateUserProfile = (req: Request, res: Response, next: NextFunction) => {
  const {name, about, email} = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    {name, about, email},
    {new: true, runValidators: true},
  )
    .then((user) => {
      if (!user) {
        return res.status(httpErrors.USER_NOT_FOUND.statusCode)
          .json({message: httpErrors.USER_NOT_FOUND.message});
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
        return next(new BaseError(
          httpErrors.VALIDATION_ERROR.message,
          httpErrors.VALIDATION_ERROR.statusCode,
        ));
      }
      if (err.name === ERROR_TYPES.CAST_ERROR) {
        return next(new BaseError(
          httpErrors.INVALID_ID_ERROR.message,
          httpErrors.INVALID_ID_ERROR.statusCode,
        ));
      }
      return next(err);
    });
};
export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch((err) => next(err));
};
export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const {avatar} = req.body;
  const userId = req.user._id;
  if (userId !== req.params.userId) {
    return next(new BaseError(
      httpErrors.NOT_PERMISSION.message,
      httpErrors.NOT_PERMISSION.statusCode,
    ));
  }
  return User.findByIdAndUpdate(
    userId,
    {avatar},
    {new: true, runValidators: true},
  ).then((user) => {
    if (!user) {
      throw new BaseError(
        httpErrors.USER_NOT_FOUND.message,
        httpErrors.USER_NOT_FOUND.statusCode,
      );
    }
    return res.json(user);
  }).catch((err) => {
    if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
      return next(new BaseError(
        httpErrors.INVALID_CARD_ERROR.message,
        httpErrors.INVALID_CARD_ERROR.statusCode,
      ));
    }
    if (err.name === ERROR_TYPES.CAST_ERROR) {
      return next(new BaseError(
        httpErrors.INVALID_ID_ERROR.message,
        httpErrors.INVALID_ID_ERROR.statusCode,
      ));
    }
    return next(err);
  });
};
