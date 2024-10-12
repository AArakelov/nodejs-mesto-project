import { httpErrors } from './constants';
import BaseError from './base-error';

export default class NotPermissions extends BaseError {
  constructor(public message = httpErrors.NOT_PERMISSION.message) {
    super(message, httpErrors.NOT_PERMISSION.statusCode);
  }
}
