const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AccessError = require('../errors/AccessError');

async function dislikeCard(req, res, next) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Такой карточки нет');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Невалидный [id]'));
    } else next(err);
  }
}

// 62628694cf729ca7a27856ec
// .orFail((err) => err);
async function likeCard(req, res, next) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Такой карточки нет');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Невалидный [id]'));
    } else next(err);
  }
}

async function getCards(req, res, next) {
  try {
    const card = await Card.find({});
    res.send(card);
  } catch (err) {
    next(err);
  }
}

async function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Невалидные данные'));
    } else next(err);
  }
}

async function removeCard(req, res, next) {
  const userId = req.user._id;
  let card;
  try {
    card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError('Такой карточки нет');
    }
    const ownerId = card.owner.toString();
    if (ownerId !== userId) {
      throw new AccessError('Вы не можете удалить чужую карточку');
    }
    card = await Card.findByIdAndRemove(req.params.cardId);
    res.send(card);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new ValidationError('Невалидный [id]'));
    } else next(err);
  }
}

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
