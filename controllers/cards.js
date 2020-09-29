const Card = require('../models/card');

module.exports.getCard = (req,res) => {
  Card.find({})
    .orFail()
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}
module.exports.deleteCardId = (req,res) => {
    Card.findById(req.params.cardId)
    .orFail(new Error('notFound'))
    .then((card) => {
      if(req.user._id != card.owner){
        return Promise.reject(new Error('notEnoughRights'));
      }else {
        Card.deleteOne({_id: req.params.cardId})
        .then((card)=>{
          res.send({ data: card })
        })
        .catch((err) => {res.status(500).send({ message: `${err}` })});
      }
    })
    .catch((err) => {
      if(err.message === 'notEnoughRights'){
        res.status(403).send({ message: `У вас недостаточно прав` })
        return
      }
      else if(err.message === 'notFound'){
        res.status(404).send({ message: `Карточка не найдена` })
        return
      }
      res.status(500).send({ message: `Что то пошло не так` })
    });
}
module.exports.createCard = (req, res) => {
  const { name, link, ownerId } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
      res.status(400).send({ message: `Переданы некорректные данные ${err}` });
    } else {
      res.status(500).send({ message: "Ошибка сервера" });
    }
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
.orFail()
.then(card => res.send({ data: card }))
.catch((err) => {
  if(err) {
    res.status(404).send({ message: `Карта не найдена${err}`})
    return
  }
  res.status(500).send({ message: 'Произошла ошибка' })
});
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
.orFail()
.then(card => res.send({ data: card }))
.catch((err) => {
  if(err) {
    res.status(404).send({ message: 'Карта не найдена' })
    return
  }
  res.status(500).send({ message: 'Произошла ошибка' })
});
};