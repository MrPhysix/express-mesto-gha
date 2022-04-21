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

    case 'CastError': {
      ERROR_CODE = 400;
      res.status(ERROR_CODE).send({
        message: `${linked === 'user' ? 'Пользователь' : 'Карточка'}`.concat(` с некорректным id: ${err.value}`),
      });
      break;
    }
    default: res.status(500).send(`Произошла ошибка ${err}`);
  }
}

module.exports = errorHandler;
