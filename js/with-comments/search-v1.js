'use strict';

const search = function () {
  // Сперва находим родительский элемент ".search-block", а дальше в нём находим тэг "input"
  const input = document.querySelector('.search-block > input');
  const searchButton = document.querySelector('.search-block > button');

  // Событие ловит любой ввод в поле ввода.
  // Каждая функция, которую мы передаём в "addEventListener" будет вызвана этим методом, когда произойдёт событие "input". В эту функцию будет передан аргумент "event". "even" - это объект самого события.
  // searchButton.addEventListener('click', () => {
  // Свойство "target" объекта "event" хранить тот элемент (здесь: поле ввода) на котором и произошло событие (ввод текста).
  // У каждого input, как у объекта есть свойство "value", в котором хранится всё введённое в него значение.
  // console.log(input.value);
  // })
  // Получим value и попытаемся поискать среди названий полученных карточек совпадение с этим value.
  searchButton.addEventListener('click', () => {
    console.log(input.value);
  });

  // Когда мы вешаем обработчики событий, то можем проверять их с помощью try {...} catch (e) {...}
  // В try мы вставим какие-то методы, которые могут вызвать ошибку. И мы можем вывести её в консоль, избегая критических ошибок. Если этого не делать, то на этом месте рухнул бы весь остальной код, а так откажет только эта часть и код ниже продолжить работу.
  // try {
  //     searchButton.addEventListener('click', () => {
  //         console.log(input.value);
  //     })
  // } catch (e) {
  //     console.error(e.message);
  // }
};

search();
