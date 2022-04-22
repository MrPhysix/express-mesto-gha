const User = require('../models/user');
const errorHandler = require('../utils/errorHandler');

async function updateUser(req, res) {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true, // данные будут валидированы перед изменением (??)
      },
    );
    res.send(user);
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}

async function updateUserAvatar(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
      new: true,
      runValidators: true, // данные будут валидированы перед изменением (??)
      upsert: false,
    });
    res.send(user);
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}

async function getUsers(req, res) {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.userId).orFail((err) => err);
    res.send(user);
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}

async function createUser(req, res) {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
