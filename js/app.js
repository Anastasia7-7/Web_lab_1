(function () {
    'use strict';

    var cart = [];
    var cartItemsEl = document.querySelector('.cart__items');
    var cartTotalSumEl = document.querySelector('.cart__total-sum');

    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
    }

    function getTotal() {
        return cart.reduce(function (sum, item) {
            return sum + item.price * item.quantity;
        }, 0);
    }

    function removeFromCart(id) {
        cart = cart.filter(function (item) { return item.id !== id; });
        renderCart();
    }

    function changeQuantity(id, delta) {
        var item = cart.filter(function (i) { return i.id === id; })[0];
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
        renderCart();
    }

    function renderCart() {
        cartItemsEl.innerHTML = '';
        cart.forEach(function (item) {
            var line = document.createElement('div');
            line.className = 'cart-item';
            line.dataset.id = item.id;
            line.innerHTML =
                '<span class="cart-item__name">' + escapeHtml(item.name) + '</span>' +
                '<div class="cart-item__quantity">' +
                '<button type="button" class="cart-item__qty-minus" data-id="' + escapeHtml(item.id) + '" aria-label="Уменьшить">−</button>' +
                '<span class="cart-item__qty-value">' + item.quantity + '</span>' +
                '<button type="button" class="cart-item__qty-plus" data-id="' + escapeHtml(item.id) + '" aria-label="Увеличить">+</button>' +
                '</div>' +
                '<span class="cart-item__info">' + formatPrice(item.price * item.quantity) + '</span>' +
                '<button type="button" class="cart-item__remove" data-id="' + escapeHtml(item.id) + '" aria-label="Удалить из корзины">×</button>';
            cartItemsEl.appendChild(line);
        });
        cartTotalSumEl.textContent = formatPrice(getTotal());
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function addToCart(id, name, price) {
        var existing = cart.filter(function (item) { return item.id === id; })[0];
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id: id, name: name, price: price, quantity: 1 });
        }
        renderCart();
    }

    function initAddToCart() {
        document.querySelectorAll('.product-card__add-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var card = btn.closest('.product-card');
                if (!card) return;
                var id = card.dataset.id;
                var price = parseInt(card.dataset.price, 10);
                var name = card.querySelector('.product-card__title');
                name = name ? name.textContent.trim() : 'Товар';
                addToCart(id, name, price);
            });
        });
    }

    function initCartItemActions() {
        cartItemsEl.addEventListener('click', function (e) {
            var removeBtn = e.target.closest('.cart-item__remove');
            if (removeBtn) {
                removeFromCart(removeBtn.dataset.id);
                return;
            }
            var minusBtn = e.target.closest('.cart-item__qty-minus');
            if (minusBtn) {
                changeQuantity(minusBtn.dataset.id, -1);
                return;
            }
            var plusBtn = e.target.closest('.cart-item__qty-plus');
            if (plusBtn) {
                changeQuantity(plusBtn.dataset.id, 1);
            }
        });
    }

    initAddToCart();
    initCartItemActions();
    renderCart();
})();
