require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
// eslint-disable-next-line no-undef
const routerUsers = require("./routes/users");
// eslint-disable-next-line no-undef
const routerCards = require("./routes/cards");
// const { createCard } = require("./controllers/cards");
const { login, createUser } = require("./controllers/users");
const {auth} = require("./middlewares/auth");

// eslint-disable-next-line no-undef
const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
 });

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.post('/signup', createUser);
app.post('/signin', login);


app.use(limiter);
app.use(auth);
app.use("/", routerUsers);
app.use("/", routerCards);
app.use("*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(PORT);