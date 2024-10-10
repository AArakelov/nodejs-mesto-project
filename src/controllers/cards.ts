import { Request, Response } from 'express';
import Card from '../../models/card';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(500).json({ message: 'Ошибка на сервере' }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).json({ message: 'Ошибка на сервере' });
    });
};
export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Передан некорректный _id карточки' });
      }
      return res.status(500).json({ message: 'Ошибка на сервере' });
    });
};
export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).json({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.json(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Передан некорректный _id карточки' });
      }
      return res.status(500).json({ message: 'Ошибка на сервере' });
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).json({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.json(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Передан некорректный _id карточки' });
      }
      return res.status(500).json({ message: 'Ошибка на сервере' });
    });
};
