'use strict';

const cart = function () {
  const cartBtn = document.querySelector('.button-cart'),
    cart = document.getElementById('modal-cart'),
    closeBtn = cart.querySelector('.modal-close'),
    goodsContainer = document.querySelector('.long-goods-list'),
    cartTable = cart.querySelector('.cart-table__goods');

  // * [1] Пишем функционал добавления товаров в корзину по клику на кнопке с ценой.
  // 1.0 Метод closest() будет подниматься вверх по DOM-дереву и искать нужный класс.
  // 1.1 Нам также нужно получить id кнопки в переменную goodID. С помощью dataset.id мы можем это сделать.
  // 1.2 Получим в goods весь массив товаров.
  // 1.3 Среди всех товаров необходимо найти карточку, по которой кликнули, при помощи метода find() и записать её в clickedGood. Метод find() работает похоже на метод map(), filter() и метод forEach(). Также, как и в случае с filter() (ранее в getGoods.js) мы передадим в callback-функцию сравнение id каждого товара с тем id, что мы получим по клику на кнопке.
  // 1.4.1 Теперь необходимо складировать эти объекты в новый массив. Во-первых нужно получить весь объект cart из localStorage, если он есть, ну а если его нет, то назначить ему пустой массив.
  // 1.4.2 Создадим массив cart, где сперва тернарным оператором проверим лежит ли ключ 'cart' в localStorage и если он есть, то мы берём весь массив из localStorage. Иначе значением переменной cart будет пустой массив.
  // 1.6.1 Теперь мы будем либо добавлять в корзину новый товар, либо увеличивать его количество, если такой товар там уже есть.
  // 1.6.2 Переберём корзину товара, если она не пуста и проверим есть ли в ней хоть один товар с id таким же, как и только что кликнутый товар (clickedGood). Здесь мы используем метод перебора some().
  // 1.6.3 Итак, если id товаров совпадает, то мы увеличиваем количество этого товара, а если нет, то добавляем его методом push(), но сперва clickedGood допишем свойство с количеством "1".
  // 1.7 После того, как addToCart() отработает нам нужно сохранить обновлённый массив корзины в localStorage. Сперва запишем ключ "cart", и поместим туда массив cart, но обработаем его методом JSON.stringify().
  // 1.8 Чтобы увеличить количество уже добавленного раньше товара нам нужно увеличивать его свойство "count". Для этого переберём всю корзину методом map(). Этот метод был придуман для того, чтобы перебирая один массив мы могли получить новый изменённый массив. Мы будем обращаться к каждому перебираемому товару "good" и возвращать его. Также напишем условие, что если найдётся товар с id, соответствующим id кликнутого товара (clickedGood), то нужно увеличить его свойство "count" на единицу.
  // 1.9.1 Теперь нужно отобразить в модальном окне строчки добавленного товара. Но сперва получим тот контейнер, куда будем вставлять вёрстку с наименованиями добавленного товара и получим его в переменную cartTable. (далее см. ниже...)
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
  // 1.14.1 Функция уменьшения количества товаров в корзине. Вначале получаем массив из localStorage с ключом "cart", а в конце сохраняем изменённое состояние. Также перерисовываем с помощью renderCartGoods() после каждого изменения. Тоже самое делаем и для следующих двух функций. А между ними будет разная логика.
  // 1.14.2 Здесь нам подойдёт метод map(), который мы уже использовали в функции addToCart(), переберём массив cart, в условии сравнивая id каждого элемента с id кликнутым элементом и при совпадении уменьшим его.
  const decreaseItemCount = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.map((good) => {
      if (good.id === id  && good.count > 1) {
        good.count--;
      }

      return good;
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart')));
  };
  // 1.15 Функция увеличения количества товаров в корзине. По-сути тот же функционал, что и у предыдущей функции, только увеличиваем свойство count.
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
  // 1.16.1 Функция удаления товаров из корзины. Здесь мы переберём все элементы "good" и вернём все, кроме того, на кнопке удаления мы только что кликнули. И запишем в localStorage уже обновлённый массив newCart.
  const deleteItem = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.filter((good) => {
      return good.id !== id;
    });

    localStorage.setItem('cart', JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart')));
  };
  // 1.5 Передаём полученный id из кликнутого товара в нашу функцию добавления в корзину addToCart().
  if (goodsContainer) {
    goodsContainer.addEventListener('click', (evt) => {
      if (evt.target.closest('.add-to-cart')) {
        const buttonToCart = evt.target.closest('.add-to-cart'),
          goodID = buttonToCart.dataset.id;

        addToCart(goodID);
      }
    });
  }
  // 1.9.2 При открытии нашего модального окна корзины необходимо заполнять это окно вёрсткой, на основании массива данных "cart", которое расположено в localStorage. Для этого нужно написать новую функцию, отвечающую за рендер товаров.
  // 1.10 Функция рендера товаров в модалку корзины из массива "cart" в localStorage.
  // 1.12.1 Теперь перебираем весь массив goods и сформируем из него вёрстку. Используем для этого forEach().
  // 1.12.2 Формируем вёрстку. Сперва создадим каркас, т.е. тег <tr> и в его свойство innerHTML помещаем нужную вёрстку.
  const renderCartGoods = (goods) => {
    // 1.12.3 Чтобы вёрстка не множилась нужно сперва обнулять контейнер, прежде чем перерисовывать его заново.
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
      // 1.12.4 При помощи метода append() в родительский контейнер cartTable мы будем помещать каждый из tr.
      cartTable.append(tr);
      // 1.13.1 Также нам нужно сделать функционал увеличения, уменьшения количества товара, а также его удаление. Для этого повесим обработчик события на tr.
      // 1.13.2 В данном обработчике событий реализуем проверку класса кликнутого элемента.
      // 1.13.3 Теперь нам нужно описать функции для каждого функционала. Создадим их вверху (см. выше...)
      tr.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('cart-btn-minus')) {
          decreaseItemCount(good.id);
        } else if (evt.target.classList.contains('cart-btn-plus')) {
          increaseItemCount(good.id);
        } else if (evt.target.classList.contains('cart-btn-delete')) {
          // 1.16.2 Также в функцию удаления мы будем передавать id товара, кнопку "удалить" которого мы кликнули.
          deleteItem(good.id);
        }
      });
    });
  };
  // 1.11 При открытии модалки мы будем вызывать функцию renderCartGoods и передавать в эту функцию некий массив cartArray. Также нужно достать из localStorage массив с товарами корзины, если он есть, а если его нет, то передадим пустой массив.
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
