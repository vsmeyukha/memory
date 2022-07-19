const errors = {
  forbiddenMovie: 'НЕ покушайся на чужой фильм',
  conflictInDatabase: 'Похоже, человек с такими данными уже есть на сайте:',
  notFoundMovie: 'Нет такого фильма',
  strangeRequest: 'Вы прислали странный запрос',
  conflictEmail: 'Пользователь с такой почтой уже зарегистрирован',
  authorizationEmailOrPassword: 'Неправильные почта или пароль',
  notFoundUser: 'Такого пользователя нет в базе',
  notFoundDeadPerson: 'Кажется, такого человека нет на сайте',
  notFoundMemory: 'Кажется, это воспоминание не найдено',
  notFoundComment: 'Кажется, этот комментарий уже удалён',
  notFoundPage: 'Запрашиваемый ресурс не найден',
  authorization: 'Необходимо авторизоваться',
  authorizationToken: 'Неверный токен',
  invalidEmail: 'Емэйл невалиден',
  invalidLink: 'Ссылка на ресурс невалидна',
  serverError: 'Ошибка на сервере',
};

module.exports = errors;
