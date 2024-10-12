import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { httpErrors } from '../utils/constants';
import { URL_LINK_PATTERNS } from '../utils/patterns';
import BaseError from '../utils/base-error';

export interface IUser extends mongoose.Document {
  name: string;
  about: string;
  email: string;
  password: string;
  avatar: string;
}

export interface UserModel extends mongoose.Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials(email: string, password: string): Promise<IUser>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    default: 'Жак-Ив Кусто',
    maxlength: 30,
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Пароль обязателен'],
    minlength: [8, 'Пароль должен быть минимум 8 символов'],
  },
  about: {
    type: String,
    default: 'developer',
    minlength: 2,
    maxlength: 200,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Некорректный формат email',
    },
  },
  avatar: {
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    type: String,
    validate: {
      validator(v: string) {
        return URL_LINK_PATTERNS.test(v);
      },
      message: (props: { value: string }) => `${props.value} is not a valid URL!`,
    },
  },
});
userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BaseError(
          httpErrors.INCORRECT_EMAIL_OR_PASSWORD.message,
          httpErrors.INCORRECT_EMAIL_OR_PASSWORD.statusCode,
        );
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BaseError(
              httpErrors.INCORRECT_EMAIL_OR_PASSWORD.message,
              httpErrors.INCORRECT_EMAIL_OR_PASSWORD.statusCode,
            );
          }
          return user;
        });
    });
});
const User = mongoose.model<IUser, UserModel>('user', userSchema);
export default User;
