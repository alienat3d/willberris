// jshint esversion: 6
'use strict';

const search = function () {
  const input = document.querySelector('.search-block > input');
  const searchButton = document.querySelector('.search-block > button');

  const renderGoods = (goods) => {
    const goodsContainer = document.querySelector('.long-goods-list');

    goodsContainer.innerHTML = '';

    goods.forEach((good) => {
      const goodBlock = document.createElement('div');

      goodBlock.classList.add('col-lg-3');
      goodBlock.classList.add('col-sm-6');

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

      goodsContainer.append(goodBlock);
    });
  };

  // Поменяем логику получения 'array', чтобы каждый раз, когда мы нажимали на кнопку поиска мы каждый раз запускали получение данных и складировали в localStorge просто 'data'. Соответственно getData() будет получать атрибутом просто 'value'.
  // Зная value input`а мы можем внутри data перебрать методом filter() все наши элементы товаров и в name каждого элемента поискать подобную подстроку. Итак, что здесь происходит: когда мы перебираем data с помощью filter(), мы получаем каждый итерируемый элемент товара 'good'. У каждого 'good' есть свойство 'name'. Для того, чтобы не зависит от регистра, мы опускаем регистр в 'name' и в value, которое мы получаем из строки ввода поиска с помощью метода toLowerCase(). Метод includes() ищет в одной строке другую строку. Причём не важно в какой части строки попадается сочетание букв, которое мы ищем, мы либо получем false, если такого нет, либо true.
  const getData = (value) => {
    fetch(
      'https://willberris-eff37-default-rtdb.europe-west1.firebasedatabase.app/db.json'
    )
      .then((res) => res.json())
      .then((data) => {
        const array = data.filter((good) =>
          good.name.toLowerCase().includes(value.toLowerCase())
        );

        localStorage.setItem('goods', JSON.stringify(array));

        if (window.location.pathname !== '/goods.html') {
          window.location.href = 'goods.html';
        } else {
          renderGoods(array);
        }
      });
  };

  // Получим value и попытаемся поискать среди названий полученных карточек совпадение с этим value. По клику запускаем getData и передаём атрибутом значение в форме поиска.
  searchButton.addEventListener('click', () => {
    getData(input.value);
  });
};

search();
