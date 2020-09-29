
const router = require("express").Router(); // создали роутер

const { createUser, getUserId, getUser, updateUser, updateUserAvatar } = require('../controllers/users');

router.get("/users", getUser);
router.get("/users/:userId", getUserId);

router.post("/users", createUser);

router.patch("/users/me", updateUser);
router.patch("/users/me/avatar", updateUserAvatar);



module.exports = router;
