import { httpErrors } from './constants';
import BaseError from './base-error';

export default class UnauthorizedError extends BaseError {
  constructor(message = httpErrors.NOT_AUTHORIZED.message) {
    super(message, httpErrors.NOT_AUTHORIZED.statusCode);
  }
}
