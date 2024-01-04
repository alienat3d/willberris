'use strict';

const cart = function () {
  // 2.2 Также необходимо получить форму из корзины в переменную modalForm.  [см. ниже...]
  const cartBtn = document.querySelector('.button-cart'),
    cart = document.getElementById('modal-cart'),
    closeBtn = cart.querySelector('.modal-close'),
    goodsContainer = document.querySelector('.long-goods-list'),
    cartTable = cart.querySelector('.cart-table__goods'),
    modalForm = cart.querySelector('.modal-form');

  const addToCart = (id) => {
    const goods = JSON.parse(localStorage.getItem('goods')),
      clickedGood = goods.find((good) => good.id === id),
      cart = localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart'))
        : [];

    if (cart.some((good) => good.id === clickedGood.id)) {
      cart.map((good) => {
        if (good.id === clickedGood.id) {
          good.count++;
        }

        return good;
      });
    } else {
      clickedGood.count = 1;
      cart.push(clickedGood);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const decreaseItemCount = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.map((good) => {
      if (good.id === id && good.count > 1) {
        good.count--;
      }

      return good;
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart')));
  };

  const increaseItemCount = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.map((good) => {
      if (good.id === id) {
        good.count++;
      }

      return good;
    });

    localStorage.setItem('cart', JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart')));
  };

  const deleteItem = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.filter((good) => {
      return good.id !== id;
    });

    localStorage.setItem('cart', JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart')));
  };

  if (goodsContainer) {
    goodsContainer.addEventListener('click', (evt) => {
      if (evt.target.closest('.add-to-cart')) {
        const buttonToCart = evt.target.closest('.add-to-cart'),
          goodID = buttonToCart.dataset.id;

        addToCart(goodID);
      }
    });
  }

  const renderCartGoods = (goods) => {
    cartTable.innerHTML = '';

    goods.forEach((good) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <tr>
          <td>${good.name}</td>
          <td>$ ${+good.price}</td>
          <td>
            <button class="cart-btn-minus">-</button>
          </td>
          <td>${+good.count}</td>
          <td>
            <button class="cart-btn-plus">+</button>
          </td>
          <td>$ ${+good.price * +good.count}</td>
          <td>
            <button class="cart-btn-delete">x</button>
          </td>
        </tr>
      `;
      cartTable.append(tr);

      tr.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('cart-btn-minus')) {
          decreaseItemCount(good.id);
        } else if (evt.target.classList.contains('cart-btn-plus')) {
          increaseItemCount(good.id);
        } else if (evt.target.classList.contains('cart-btn-delete')) {
          deleteItem(good.id);
        }
      });
    });
  };
  // * [2] == Функционал отправки данных из формы модального окна корзины ==
  // 2.1 Напишем новую функцию sendForm(), которая будет отправлять на тестовое API объект с товарами в корзине 'cart'. [см. выше...]
  // 2.4 С помощью метода fetch мы отправим на тестовое API JSONplaceholder нашу корзину (этот сервис специально сделан для тестирования фронтэнда без готового бэкэнда). Первым аргументом он принимает URL куда будем отсылать данные, а вторым объект с настройками. Там у нас будет метод отправки "POST" и само "тело формы" body. И его нам нужно завернуть в формат JSON наши данные при помощи метода JSON.stringify()
  // 2.5 Также нам нужен весь объект корзины cart.
  // 2.6 Однако настройки body лучше чуть модифицировать и поместить туда объект, а свойствами добавить туда cart, а также name & phone.
  // ? 2.7 В Dev Tools -> Network мы можем проверить и подробнее увидеть отправление наших данных.
  // 2.8 После успешной отправки мы закрываем модальное окно корзины, для этого пишем метод then()
  const sendForm = () => {
    const cartArray = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        cart: cart,
        name: '',
        phone: '',
      }),
    }).then(() => {
      cart.style.display = '';
    });
  };

  // 2.3.1 Повесим на форму обработку события. Также заблокируем при отсылке стандартное поведение при помощи evt.preventDefault();
  // 2.3.2 Также по клику на кнопке "Checkout" у нас будет выполняться функция sendForm().
  modalForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendForm();
  });

  cartBtn.addEventListener('click', () => {
    const cartArray = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];

    renderCartGoods(cartArray);

    cart.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    cart.style.display = '';
  });

  cart.addEventListener('click', (evt) => {
    if (
      !evt.target.closest('.modal') &&
      evt.target.classList.contains('overlay')
    ) {
      cart.style.display = '';
    }
  });

  window.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      cart.style.display = '';
    }
  });
};

cart();
