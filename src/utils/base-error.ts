export default class BaseError extends Error {
  // eslint-disable-next-line no-unused-vars
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}
