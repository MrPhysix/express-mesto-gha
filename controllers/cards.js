const Card = require('../models/card');
const errorHandler = require('../utils/errorHandler');

async function dislikeCard(req, res) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).orFail((err) => err); // вот это я придумал ))
    res.send(card);
  } catch (err) {
    errorHandler(res, err);
  }
}

// 62628694cf729ca7a27856ec
async function likeCard(req, res) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail((err) => err);
    res.send(card);
  } catch (err) {
    errorHandler(res, err);
  }
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
  const userId = req.user._id;
  let card;
  try {
    card = await Card.findById(req.params.cardId).orFail((err) => err);
    const ownerId = card.owner.toString();
    if (ownerId !== userId) {
      res.status(401).send({
        message: 'Вы не можете удалить чужую карточку',
      });
      return;
    }
    card = await Card.findByIdAndRemove(req.params.cardId).orFail((err) => err);
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
