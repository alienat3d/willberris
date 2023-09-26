// jshint esversion: 6
'use strict';

const getGoods = () => {
  const links = document.querySelectorAll('.navigation-link');
  //[#1] Реализуем функционал, чтобы по кнопке "View All на главной" открывалась goods.html с отображением всех товаров. И повесим на неё обработчик события, но повесим таким образом, чтобы он не вызвал ошибку на странице goods.html, к которой также подключен файлик getGoods.html. Для этого делаем проверку в самом низу, см. #2...
  const viewAllBtn = document.querySelector('.more');

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

  const getData = (value, category) => {
    fetch(
      'https://willberris-eff37-default-rtdb.europe-west1.firebasedatabase.app/db.json'
    )
      .then((res) => res.json())
      .then((data) => {
        const array = category
          ? data.filter((item) => item[category] === value)
          : data;

        localStorage.setItem('goods', JSON.stringify(array));

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

      const linkValue = link.textContent;
      const category = link.dataset.field;

      getData(linkValue, category);
    });
  });

  if (
    localStorage.getItem('goods') &&
    window.location.pathname === '/goods.html'
  ) {
    renderGoods(JSON.parse(localStorage.getItem('goods')));
  }

  //[#2] Проверка:
  if (viewAllBtn) {
    // тоже самое, что "if (viewAllBtn === true) {...}"
    viewAllBtn.addEventListener('click', (event) => {
      event.preventDefault();

      //[#3] В этой функции не требуется передавать атрибуты ни value, ни category, так как когда мы запустим getData() без переданных аргументов, то запустится функция, где в тернарнике запустится проверка, передали ли мы категорию, и если категории у нас нет, либо он null\undefinded, то запустится просто data и отрисует все карточки товаров.
      getData();
    });
  }
};

getGoods();
