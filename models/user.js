const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (data) => validator.isEmail(data),
        message: 'Некоректный email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: false,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      required: false,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      required: false,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (data) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w .-]*)*\/?$/gm.test(data),
        // validator: (data) => validator.isURL(data),
        message: 'Некоректный url',
      },
    },
  },
  { versionKey: false },
);
userSchema.statics.findUserByCredentials = function func(email, password) {
  const LoginError = new Error('incorrect email/pass');
  LoginError.name = 'LoginError';

  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw LoginError;
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw LoginError;
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
