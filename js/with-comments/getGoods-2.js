// jshint esversion: 6
'use strict';

const getGoods = () => {
  const links = document.querySelectorAll('.navigation-link');

  // Теперь отрисовываем данные. Функция будет принимать массив данных, т.е. goods.
  // Когда мы переходим с главной на goods.html нам нужно также запускать renderGoods и отправлять на рендер массив, что лежит на localStorage. Но когда мы уже на goods.html, то нам нужно не переход делать, а запускать renderGoods() с полученными данными.
  // Также проверяем ниже в forEach(), что если в localStorage что-то есть... (продолжение ниже)
  // Находим общий контейнер карточек товаров ".long-goods-list". Получим этот элемент.
  // Итак, теперь нам необходимо перебрать весь массив данных 'goods', каждый раз мы будем создавать новый блок, давать ему классы и записывать в этот блок вёрстку.
  const renderGoods = (goods) => {
    const goodsContainer = document.querySelector('.long-goods-list');

    // Для начала очистим стандртную вёрстку goods.html приравняв к пустой строке
    goodsContainer.innerHTML = '';

    goods.forEach((good) => {
      // Каждый раз мы будем получать каждый очередной итерируемый 'good' и создаём новый блок 'goodBlock' с помощью createElement().
      const goodBlock = document.createElement('div');

      // А также добавим этому div'у несколько классов с помощью classList.add('col-lg-3') & classList.add('col-sm-6'), которые есть у каждой карточки товара (см. вёрстку).
      goodBlock.classList.add('col-lg-3');
      goodBlock.classList.add('col-sm-6');

      // С помощью innerHTML пропишем вёрстку карточек.
      // Нам нужно выводить label только тогда, если <label> заполнен. Для это используем тернарный оператор. Спросить существует ли у нас label, если он существует то null, значит не добавлять никакой класс, а если его не существует, то мы добавим класс 'd-none'
      goodBlock.innerHTML = `
        <div class="goods-card">
					<span class="label ${good.label ? null : 'd-none'}">${good.label}</span>
					<img src="db/${good.img}" alt="image: ${good.name}" class="goods-image">
					<h3 class="goods-title">${good.name}</h3>
					<p class="goods-description">${good.description}</p>
					<button class="button goods-card-btn add-to-cart" data-id="${good.id}">
						<span class="button-price">$ ${good.price}</span>
					</button>
				</div>
      `;

      // Обратимся к goodsContainer и в каждом переборе будем использовать метод append(), чтобы добавлять в конце списка дочерних элементов очередной goodBlock. Теперь карточку будут отрисовываться, но нам надо ещё заполнить их определёнными данными. См. выше вёрстку с вкраплением JS-кода.
      goodsContainer.append(goodBlock);

      console.log(goodBlock);
    });
  };

  // (value, category) это полученные данные из цикла forEach снизу, которые берутся по клику на каждую из категорий в шапке сайта.
  const getData = (value, category) => {
    fetch(
      'https://willberris-eff37-default-rtdb.europe-west1.firebasedatabase.app/db.json'
    )
      .then((res) => res.json())
      .then((data) => {
        // Рассмотрим метод перебора массивов 'filter()', чтобы отфильтровать наш контент по категориям. Работает похоже на forEach, также получает callback function. А callback получает определённые элементы, например сам item. Метод filter() вернёт нам в массив только те данные, callback которых вернёт нам значение true. И мы можем обратиться к конкретному свойству item. Например 'gender'. И так как нам нужны 'womens', мы сравним значение gender с 'womens'. Таким образом только те элементы, чьё свойство 'gender' имеет значение 'Womens'.
        // Применим тернарный оператор, чтобы при значении true (у ссылки есть категория), данные фильтровались по этой категории, ну а если false (нет категории - ссылка 'All'), то просто выдавались все данные.
        const array = category
          ? data.filter((item) => item[category] === value)
          : data;

        // Также надо учесть, что нам нужно, если категории нет (клик по "All") то возвращать все данные, а если по другим из ссылок, то данные, соответствующие нажатой кнопке.
        // if (category) {
        //     console.log('Ура!')
        // } else {
        //     console.log('Oops!')
        // }
        // Тоже самое можно записать компактнее через тернарный оператор:
        // category ? console.log('Ура!') : console.log('Oops!');

        localStorage.setItem('goods', JSON.stringify(array));

        // Чтобы по клике на кнопку категорий юзера перебрасывало на специальную страницу goods.html, где будут отрисовываться наши карточки товаров, на основе данных из localStorage, используется свойство 'window.location.href'
        // window.location.href = '/goods.html';
        // Сделаем проверку, что если свойство pathname у window.location ≠ '/goods.html', то мы будем переходить на эту страницу, но если = '/goods.html', то нам переходить не нужно.
        if (window.location.pathname !== '/goods.html') {
          window.location.href = 'goods.html';
        } else {
          renderGoods(array);
        }
      });
  };

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      // Чтобы достать текстовое содержимое ссылки, используем свойство "textContent"
      const linkValue = link.textContent;
      // Чтобы достать значение атрибута data-field, используем свойство "dataset.%название data-атрибута%. В данном примере это data-set="...".
      const category = link.dataset.field;

      getData(linkValue, category);
    });
  });
  // Также проверяем ниже в forEach(), что если в localStorage что-то есть, то выполнить renderGoods() и массив передать localStorage.getItem('goods'), но только в формате JSON. Также нужна проверка, чтобы только на goods.html происходил рендер, но не на index.html. ( && window.location.pathname === '/goods.html')
  // То есть, только если у нас есть в local Storage под ключом "goods" и у нас страница goods.html, только в этом случае мы отправляем в renderGoods() данные.
  if (
    localStorage.getItem('goods') &&
    window.location.pathname === '/goods.html'
  ) {
    renderGoods(JSON.parse(localStorage.getItem('goods')));
  }
};

getGoods();
