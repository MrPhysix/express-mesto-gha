const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  getJwt,
} = require('../utils/jwt');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const RegisteredEmailError = require('../errors/RegisteredEmailError');
const LoginError = require('../errors/LoginError');

async function updateUser(req, res, next) {
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
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
}

async function updateUserAvatar(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
      new: true,
      runValidators: true,
      upsert: false,
    });
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
}

async function getUsers(req, res, next) {
  try {
    const user = await User.find({});
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      throw new ValidationError('Невалидный [id]');
    } else next(err);
  }
}

async function createUser(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashedPassword, name, about, avatar,
    });
    res.status(200).send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new RegisteredEmailError('Указанный Email уже зарегистрирован'));
    } else next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    const token = getJwt(user);
    if (!token) {
      throw new LoginError('Пользователь не найден [token]');
    }
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    }).send({ token });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      throw new ValidationError('Невалидный [id]');
    } else next(err);
  }
}
async function getCurrentUserInfo(req, res, next) {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
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
