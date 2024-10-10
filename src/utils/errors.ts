export const ERRORS = {
  VALIDATION_ERROR: {
    statusCode: 400,
    message: 'Переданы некорректные данные',
  },
  NOT_FOUND_ERROR: {
    statusCode: 404,
    message: 'Не найдено',
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
    message: 'Ошибка на сервере',
  },
  INVALID_ID_ERROR: {
    statusCode: 400,
    message: 'Передан некорректный _id',
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
