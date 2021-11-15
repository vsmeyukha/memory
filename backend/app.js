const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;

const app = express();

// ? вопросики: вот эти опции вызывают ошибку:
// ? useCreateIndex: true,
// ? useFindAndModify: false,
// todo узнать, почему

// todo - создать схемы и модели
// todo - создать индекс емэйла в компасе, чтобы он был уникальным
mongoose.connect('mongodb://localhost:27017/memorydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Подключено к базе данных - memory'));

app.use(helmet());

app.use(cookieParser());

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Слушаем на порту ${PORT}`);
});
