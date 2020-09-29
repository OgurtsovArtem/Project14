
/* eslint-disable no-undef */
const router = require("express").Router();

const { getCard, deleteCardId, createCard, likeCard, dislikeCard } = require('../controllers/cards')

router.get("/cards", getCard);
router.post("/cards", createCard);
router.delete("/cards/:cardId", deleteCardId);
router.put("/cards/:cardId/likes", likeCard);
router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;