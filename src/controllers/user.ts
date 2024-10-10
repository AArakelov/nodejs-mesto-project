import { Request, Response } from 'express';
import User from '../../models/user';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch(() => {
      res.status(500).json({ message: 'Ошибка на сервере' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).json(user)) // Успешно создали пользователя
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).json({ message: 'Ошибка на сервере' });
    });
};

export const getUserById = (req: Request, res: Response) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Пользователь по указанному _id не найден' }); // Пользователь не найден
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Передан некорректный _id пользователя' }); // Некорректный _id
      }
      return res.status(500).json({ message: 'Ошибка на сервере' }); // Ошибка по умолчанию
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
        return res.status(404).json({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // Если данные не прошли валидацию, возвращаем 400
        return res.status(400).json({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Передан некорректный _id' });
      }
      return res.status(500).json({ message: 'Ошибка на сервере' });
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
      return res.status(404).json({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.json(user);
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Передан некорректный _id пользователя' });
    }
    return res.status(500).json({ message: 'Ошибка на сервере' });
  });
};
