import { httpErrors } from './constants';
import BaseError from './base-error';

export default class NotFoundError extends BaseError {
  constructor(message = httpErrors.NOT_FOUND_ERROR.message) {
    super(message, httpErrors.NOT_FOUND_ERROR.statusCode);
  }
}
