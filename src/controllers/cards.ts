import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { ERROR_TYPES, httpErrors, SUCCESS } from '../utils/constants';
import NotFoundError from '../utils/not-found-error';
import NotPermissions from '../utils/not-permissions';
import BaseError from '../utils/base-error';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res
      .send({ cards }))
    .catch((e) => next(e));
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(SUCCESS.CREATED.statusCode).send(card))
    .catch((err) => {
      if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
        return next(new BaseError(
          httpErrors.INVALID_CARD_ERROR.message,
          httpErrors.INVALID_CARD_ERROR.statusCode,
        ));
      }
      return next(err);
    });
};
export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }
      if (card.owner.toString() !== userId) {
        throw new NotPermissions();
      }
      return Card.findByIdAndDelete(cardId);
    }).then(() => res.status(200).json({ message: 'Карточка удалена' }))
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
export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new BaseError(
          httpErrors.INVALID_CARD_ERROR.message,
          httpErrors.INVALID_CARD_ERROR.statusCode,
        );
      }
      return res.json(card);
    })
    .catch((err) => {
      if (err.name === ERROR_TYPES.CAST_ERROR) {
        return next(new BaseError(
          httpErrors.INVALID_CARD_ERROR.message,
          httpErrors.INVALID_CARD_ERROR.statusCode,
        ));
      }
      return next(err);
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError();
      }
      return res.json(card);
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
