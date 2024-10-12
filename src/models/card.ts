// Интерфейс для карточки
import mongoose, { Document, Model } from 'mongoose';
import { URL_LINK_PATTERNS } from '../utils/patterns';

export interface ICard extends Document {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v: string) {
        return URL_LINK_PATTERNS.test(v);
      },
      message: (props: { value: string }) => `${props.value} is not a valid URL!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Модель карточки
const Card: Model<ICard> = mongoose.model('card', cardSchema);

export default Card;
