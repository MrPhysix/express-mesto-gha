function errorHandler(res, err, linked) {
  let ERROR_CODE;

  if (err.code === 11000) {
    ERROR_CODE = 409;
    res.status(ERROR_CODE).send({
      message: 'Пользователь с таким email уже зарегистрирован',
    });
    return;
  }

  switch (err.name) {
    case 'ValidationError': {
      ERROR_CODE = 400;
      res.status(ERROR_CODE).send({
        message: `${Object.values(err.errors).map(() => `Ошибка: ${err.message}`).join('\n ')}`,
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
    case 'LoginError': {
      ERROR_CODE = 401;
      res.status(ERROR_CODE).send({
        message: 'Неправильные почта или пароль',
      });
      break;
    }
    default: res.status(500).send(`Произошла ошибка ${err}`);
  }
}

module.exports = errorHandler;
