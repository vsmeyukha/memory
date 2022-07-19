require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors, isCelebrateError, CelebrateError } = require('celebrate');
const CastError = require('./errors/castError');

const router = require('./routes/index');

const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

const app = express();

// ? вопросики: вот эти опции вызывают ошибку:
// ? useCreateIndex: true,
// ? useFindAndModify: false,
// todo узнать, почему

mongoose.connect('mongodb://localhost:27017/memorydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Подключено к базе данных - memory'));

app.use(helmet());

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

// app.use(errors());

app.use((err, req, res, next) => {
  if (isCelebrateError) {
    return next(err);
  } return next(err);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Слушаем на порту ${PORT}`);
});
