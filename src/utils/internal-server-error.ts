import { httpErrors } from './constants';
import BaseError from './base-error';

export default class InternalServerError extends BaseError {
  constructor(message = httpErrors.SERVER_ERROR.message) {
    super(message, httpErrors.SERVER_ERROR.statusCode);
  }
}
