const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.getUser = (req,res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.getUserId = (req,res) => {
  User.findById(req.params.userId)
      .orFail()
      .then(user =>  res.send({ data: user }))
      .catch((err) => {
        if(err) {
          res.status(404).send({ message: "Такого пользователя нет" });
          return
        }
        res.status(500).send({ message: `Произошла ошибка` });
      });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash }))
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданы некорректные данные" });
    } else {
      res.status(500).send({ message: "Ошибка сервера" });
    }
    });
};

module.exports.updateUser = (req, res) => {
  const { name } = req.body;
  User.findByIdAndUpdate(req.user._id, { name: name })
  .orFail()
  .then(user => res.send({ data: user }))
  .catch((err) => {
    if(err) {
      res.status(404).send({ message: 'Ошибка авторизации' })
      return
    }
    res.status(500).send({ message: 'Произошла ошибка' })
  });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
  .then(user => res.send({ data: user }))
   .catch((err) => {
    if(err) {
      res.status(404).send({ message: 'Ошибка авторизации' })
      return
    }
    res.status(500).send({ message: 'Произошла ошибка' })
  });
};

module.exports.login = (req,res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {expiresIn:'7d'})
        res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true
    })
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
}

