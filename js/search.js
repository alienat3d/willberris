'use strict';

const search = function () {
  const input = document.querySelector('.search-block > input'),
    searchButton = document.querySelector('.search-block > button');

  const renderGoods = goods => {
    const goodsContainer = document.querySelector('.long-goods-list');

    goodsContainer.innerHTML = '';

    goods.forEach(good => {
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

  const getData = value => {
    fetch(
      'https://wildberries-02-22-default-rtdb.europe-west1.firebasedatabase.app/db.json'
    )
      .then(res => res.json())
      .then(data => {
        const array = data.filter(good =>
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

  searchButton.addEventListener('click', () => getData(input.value));
};

search();
