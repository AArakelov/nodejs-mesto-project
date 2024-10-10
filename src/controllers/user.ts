import { Request, Response } from 'express';
import User from '../models/user';
import { ERROR_TYPES, ERRORS, SUCCESS } from '../utils/errors';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.status(SUCCESS.OK.statusCode)
      .json(users))
    .catch(() => {
      res.status(ERRORS.SERVER_ERROR.statusCode)
        .json({ message: ERRORS.SERVER_ERROR.message });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(SUCCESS.CREATED.statusCode)
      .json(user)) // Успешно создали пользователя
    .catch((err) => {
      if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
        return res.status(ERRORS.VALIDATION_ERROR.statusCode)
          .json({ message: ERRORS.VALIDATION_ERROR.message });
      }
      return res.status(ERRORS.SERVER_ERROR.statusCode)
        .json({ message: ERRORS.SERVER_ERROR.message });
    });
};

export const getUserById = (req: Request, res: Response) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERRORS.USER_NOT_FOUND.statusCode)
          .json({ message: ERRORS.USER_NOT_FOUND.message });
      }
      return res.status(SUCCESS.OK.statusCode)
        .json(user);
    })
    .catch((err) => {
      if (err.name === ERROR_TYPES.CAST_ERROR) {
        return res.status(ERRORS.INVALID_ID_ERROR.statusCode)
          .json({ message: ERRORS.INVALID_ID_ERROR.message });
      }
      return res.status(ERRORS.SERVER_ERROR.statusCode)
        .json({ message: ERRORS.SERVER_ERROR.message });
    });
};
export const updateUserProfile = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(ERRORS.USER_NOT_FOUND.statusCode)
          .json({ message: ERRORS.USER_NOT_FOUND.message });
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
        return res.status(ERRORS.VALIDATION_ERROR.statusCode)
          .json({ message: ERRORS.VALIDATION_ERROR.message });
      }
      if (err.name === ERROR_TYPES.CAST_ERROR) {
        return res.status(ERRORS.INVALID_ID_ERROR.statusCode)
          .json({ message: ERRORS.INVALID_ID_ERROR.message });
      }
      return res.status(ERRORS.SERVER_ERROR.statusCode)
        .json({ message: ERRORS.INVALID_ID_ERROR.message });
    });
};

export const updateUserAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  ).then((user) => {
    if (!user) {
      return res.status(ERRORS.USER_NOT_FOUND.statusCode)
        .json({ message: ERRORS.USER_NOT_FOUND.message });
    }
    return res.json(user);
  }).catch((err) => {
    if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
      return res.status(ERRORS.INVALID_CARD_ERROR.statusCode)
        .json({ message: ERRORS.INVALID_CARD_ERROR.message });
    }
    if (err.name === ERROR_TYPES.CAST_ERROR) {
      return res.status(ERRORS.INVALID_ID_ERROR.statusCode)
        .json({ message: ERRORS.INVALID_ID_ERROR.message });
    }
    return res.status(ERRORS.SERVER_ERROR.statusCode)
      .json({ message: ERRORS.SERVER_ERROR.message });
  });
};
