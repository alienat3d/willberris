'use strict';

const cart = function () {
  const cartBtn = document.querySelector('.button-cart'),
    cart = document.getElementById('modal-cart'),
    closeBtn = cart.querySelector('.modal-close'),
    goodsContainer = document.querySelector('.long-goods-list');

  cartBtn.addEventListener('click', () => {
    cart.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    cart.style.display = '';
  });

  if (goodsContainer) {
    goodsContainer.addEventListener('click', (evt) => {
      console.log(evt.target);
    })
  }
};

cart();
