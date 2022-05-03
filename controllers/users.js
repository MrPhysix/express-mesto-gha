const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  getJwt,
} = require('../utils/jwt');

const errorHandler = require('../utils/errorHandler');

async function updateUser(req, res) {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).send(user);
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}

async function updateUserAvatar(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
      new: true,
      runValidators: true,
      upsert: false,
    });
    res.status(200).send(user);
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}

async function getUsers(req, res) {
  try {
    const user = await User.find({});
    res.status(200).send(user);
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.userId).orFail((err) => err);
    res.status(200).send(user);
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}

async function createUser(req, res) {
  const {
    email, password, name, about, avatar,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashedPassword, name, about, avatar,
    });
    res.status(200).send({
      _id: user.id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = getJwt(user);
    res.status(200).send({ token });
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}
async function getCurrentUserInfo(req, res) {
  try {
    const user = await User.findById(req.user).orFail((err) => err);
    res.status(200).send(user);
  } catch (err) {
    errorHandler(res, err, 'user');
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  createUser,
  login,
  getCurrentUserInfo,
};
