function errorHandler(res, err, linked) {
  let ERROR_CODE;

  switch (err.name) {
    case 'ValidationError': {
      ERROR_CODE = 400;
      res.status(ERROR_CODE).send({
        message: `${Object.values(err.errors).map(() => `Ошибка в поле "${err.path}" : ${err.message}`).join('\n ')}`,
      });
      break;
    }

    case 'DocumentNotFoundError': {
      ERROR_CODE = 404;
      res.status(ERROR_CODE).send({
        message: `${linked === 'user' ? 'Пользователь' : 'Карточка'}`.concat(' с таким id не найден', `${linked !== 'user' ? 'a' : ''}`),
      });
      break;
    }
    case 'CastError': {
      ERROR_CODE = 400;
      res.status(ERROR_CODE).send({
        message: `Невалидный id ${linked === 'user' ? 'пользователя' : 'карточки'}`,
      });
      break;
    }
    default: res.status(500).send(`Произошла ошибка ${err}`);
  }
}

module.exports = errorHandler;
