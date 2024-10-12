export const httpErrors = {
  CONFLICT_ERROR: {
    statusCode: 409,
    message: 'Пользователь с таким email уже существует',
  },
  VALIDATION_ERROR: {
    statusCode: 400,
    message: 'Переданы некорректные данные',
  },
  NOT_FOUND_ERROR: {
    statusCode: 404,
    message: 'Не найдено',
  },
  BAD_REQUEST: {
    statusCode: 400,
    message: 'Bad Request',
  },
  NOT_AUTHORIZED: {
    statusCode: 401,
    message: 'Не авторизован',
  },
  INCORRECT_EMAIL_OR_PASSWORD: {
    statusCode: 401,
    message: 'Неправильные почта или пароль',
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    message: 'Пользователь с указанным _id не найден',
  },
  CARD_NOT_FOUND: {
    statusCode: 404,
    message: 'Карточка с указанным _id не найдена',
  },
  SERVER_ERROR: {
    statusCode: 500,
    message: 'На сервере произошла ошибка',
  },
  INVALID_ID_ERROR: {
    statusCode: 400,
    message: 'Передан некорректный _id',
  },
  NOT_PERMISSION: {
    statusCode: 403,
    message: 'not permission',
  },
  INVALID_CARD_ERROR: {
    statusCode: 400,
    message: 'Переданы некорректные данные при создании карточки',
  },
};
export const ERROR_TYPES = {
  VALIDATION_ERROR: 'ValidationError',
  CAST_ERROR: 'CastError',
};
export const SUCCESS = {
  OK: {
    statusCode: 200,
    message: 'Успешно',
  },
  CREATED: {
    statusCode: 201,
    message: 'Ресурс успешно создан',
  },
};
