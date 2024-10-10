import { Request, Response } from 'express';
import Card from '../models/card';
import { ERROR_TYPES, ERRORS, SUCCESS } from '../utils/errors';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res
      .send({ cards }))
    .catch(() => res.status(ERRORS.SERVER_ERROR.statusCode)
      .json({ message: ERRORS.SERVER_ERROR.message }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(SUCCESS.CREATED.statusCode).send(card))
    .catch((err) => {
      if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
        return res.status(ERRORS.INVALID_CARD_ERROR.statusCode)
          .json({ message: ERRORS.INVALID_CARD_ERROR.message });
      }
      return res.status(ERRORS.SERVER_ERROR.statusCode)
        .json({ message: ERRORS.SERVER_ERROR.message });
    });
};
export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERRORS.NOT_FOUND_ERROR.statusCode)
          .send({ message: ERRORS.NOT_FOUND_ERROR.message });
      }
      return res.send(card);
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
export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERRORS.INVALID_CARD_ERROR.statusCode)
          .json({ message: ERRORS.INVALID_CARD_ERROR.message });
      }
      return res.json(card);
    })
    .catch((err) => {
      if (err.name === ERROR_TYPES.CAST_ERROR) {
        return res.status(ERRORS.INVALID_CARD_ERROR.statusCode)
          .json({ message: ERRORS.INVALID_CARD_ERROR.message });
      }
      return res.status(ERRORS.SERVER_ERROR.statusCode)
        .json({ message: ERRORS.SERVER_ERROR.message });
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERRORS.NOT_FOUND_ERROR.statusCode)
          .json({ message: ERRORS.NOT_FOUND_ERROR.message });
      }
      return res.json(card);
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
