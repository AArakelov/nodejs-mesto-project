import { httpErrors } from './constants';
import BaseError from './base-error';

export default class BadRequestError extends BaseError {
  constructor(message = httpErrors.BAD_REQUEST.message) {
    super(message, httpErrors.BAD_REQUEST.statusCode);
  }
}
