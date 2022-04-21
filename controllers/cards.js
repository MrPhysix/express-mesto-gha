const Card = require('../models/card');
const errorHandler = require('../utils/errorHandler');

async function dislikeCard(req, res) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    res.send(card);
  } catch (err) {
    errorHandler(res, err);
  }
}
// .orFail(() => {
//   throw new Error('NotFound');
// });

async function likeCard(req, res) {
  const card = await Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => res.send({ 1: 1 }));
  res.send(card);
}

async function getCards(req, res) {
  try {
    const card = await Card.find({});
    res.send(card);
  } catch (err) {
    errorHandler(res, err);
  }
}

async function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    errorHandler(res, err);
  }
}

async function removeCard(req, res) {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    res.send(card);
  } catch (err) {
    errorHandler(res, err);
  }
}

module.exports = {
  getCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
