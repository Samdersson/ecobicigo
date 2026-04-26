document.addEventListener('DOMContentLoaded', () => {
    // Get all "Ordenar" buttons
    const orderButtons = document.querySelectorAll('.productos > button:nth-of-type(1)');

    let currentOrderType = '';
    let singleProduct = null;

    orderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productDiv = button.closest('.productos');
            if (!productDiv) return;

            const productName = productDiv.querySelector('h1')?.innerText || 'Producto';

            let price = '';
            const priceParagraphs = productDiv.querySelectorAll('p');
            priceParagraphs.forEach(p => {
                if (p.innerText.trim().match(/^\$\d/)) {
                    price = p.innerText.trim();
                }
            });

            const form = productDiv.querySelector('form');
            let optionText = '';
            if (form) {
                const selectedRadio = form.querySelector('input[type="radio"]:checked');
                if (!selectedRadio) {
                    alert('Por favor, seleccione una opción antes de ordenar.');
                    return;
                }
                const label = form.querySelector(`label > input[value="${selectedRadio.value}"]`)?.parentElement;
                optionText = label ? label.innerText.trim() : selectedRadio.value;
            }

            currentOrderType = 'single';
            singleProduct = { name: productName, option: optionText, price: price };

            // Show order details modal for single product order
            orderDetailsModal.style.display = 'block';
        });
    });

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.productos > button:nth-of-type(3)');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productDiv = button.closest('.productos');
            if (!productDiv) return;

            const productName = productDiv.querySelector('h1')?.innerText || 'Producto';
            let price = '';
            const priceParagraphs = productDiv.querySelectorAll('p');
            priceParagraphs.forEach(p => {
                if (p.innerText.trim().match(/^\$\d/)) {
                    price = p.innerText.trim();
                }
            });

            const form = productDiv.querySelector('form');
            let optionText = '';
            if (form) {
                const selectedRadio = form.querySelector('input[type="radio"]:checked');
                if (!selectedRadio) {
                    alert('Por favor, seleccione una opción antes de agregar al carrito.');
                    return;
                }
                const label = form.querySelector(`label > input[value="${selectedRadio.value}"]`)?.parentElement;
                optionText = label ? label.innerText.trim() : selectedRadio.value;
            }

            const existingIndex = cart.findIndex(item => item.name === productName && item.option === optionText);
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({ name: productName, price: price, option: optionText, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`Producto agregado al carrito:\n${productName}${optionText ? '\n' + optionText : ''}\n${price}`);
        });
    });

    // Cart modal 
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.createElement('div');
    cartModal.id = 'cartModal';
    cartModal.style.position = 'fixed';
    cartModal.style.top = '50%';
    cartModal.style.left = '50%';
    cartModal.style.transform = 'translate(-50%, -50%)';
    cartModal.style.backgroundColor = 'white';
    cartModal.style.padding = '20px';
    cartModal.style.borderRadius = '10px';
    cartModal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    cartModal.style.zIndex = '10000';
    cartModal.style.display = 'none';
    cartModal.style.maxHeight = '80vh';
    cartModal.style.overflowY = 'auto';
    cartModal.style.width = '90vw';
    cartModal.style.maxWidth = '500px';

    const closeModalBtn = document.createElement('button');
    closeModalBtn.innerText = 'Cerrar';
    closeModalBtn.style.marginBottom = '10px';
    closeModalBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    const cartItemsList = document.createElement('div');
    cartModal.appendChild(closeModalBtn);
    cartModal.appendChild(cartItemsList);

    // Continue comprando button
    const continueBtn = document.createElement('button');
    continueBtn.innerText = 'Continuar compra';
    continueBtn.style.marginTop = '10px';
    continueBtn.style.padding = '10px 20px';
    continueBtn.style.backgroundColor = '#25D366';
    continueBtn.style.color = 'white';
    continueBtn.style.border = 'none';
    continueBtn.style.borderRadius = '5px';
    continueBtn.style.cursor = 'pointer';

    cartModal.appendChild(continueBtn);

    document.body.appendChild(cartModal);

    // Render cart items in modal
    function renderCart() {
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.innerText = 'El carrito está vacío.';
            cartItemsList.appendChild(emptyMsg);
            continueBtn.style.display = 'none';
            return;
        }
        continueBtn.style.display = 'inline-block';

        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.style.display = 'flex';
            itemDiv.style.justifyContent = 'space-between';
            itemDiv.style.alignItems = 'center';
            itemDiv.style.marginBottom = '10px';

            const itemInfo = document.createElement('div');
            itemInfo.style.flex = '1';
            itemInfo.innerText = `${item.name}${item.option ? ' - ' + item.option : ''} - ${item.price}`;

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = '1';
            quantityInput.value = item.quantity;
            quantityInput.style.width = '50px';
            quantityInput.style.margin = '0 10px';

            quantityInput.addEventListener('change', (e) => {
                const newQty = parseInt(e.target.value);
                if (isNaN(newQty) || newQty < 1) {
                    e.target.value = item.quantity;
                    return;
                }
                cart[index].quantity = newQty;
                localStorage.setItem('cart', JSON.stringify(cart));
            });

            const removeBtn = document.createElement('button');
            removeBtn.innerText = 'Eliminar';
            removeBtn.style.backgroundColor = '#ff4d4d';
            removeBtn.style.color = 'white';
            removeBtn.style.border = 'none';
            removeBtn.style.borderRadius = '5px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.padding = '5px 10px';

            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });

            itemDiv.appendChild(itemInfo);
            itemDiv.appendChild(quantityInput);
            itemDiv.appendChild(removeBtn);

            cartItemsList.appendChild(itemDiv);
        });
    }

    // Show cart modal on cartBtn click
    cartBtn.addEventListener('click', () => {
        renderCart();
        cartModal.style.display = 'block';
    });

    // Order details modal creation
    const orderDetailsModal = document.createElement('div');
    orderDetailsModal.id = 'orderDetailsModal';
    orderDetailsModal.style.position = 'fixed';
    orderDetailsModal.style.top = '50%';
    orderDetailsModal.style.left = '50%';
    orderDetailsModal.style.transform = 'translate(-50%, -50%)';
    orderDetailsModal.style.backgroundColor = 'white';
    orderDetailsModal.style.padding = '20px';
    orderDetailsModal.style.borderRadius = '10px';
    orderDetailsModal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    orderDetailsModal.style.zIndex = '11000';
    orderDetailsModal.style.display = 'none';
    orderDetailsModal.style.maxHeight = '80vh';
    orderDetailsModal.style.overflowY = 'auto';
    orderDetailsModal.style.width = '90vw';
    orderDetailsModal.style.maxWidth = '500px';

    const closeOrderModalBtn = document.createElement('button');
    closeOrderModalBtn.innerText = 'Cerrar';
    closeOrderModalBtn.style.marginBottom = '10px';
    closeOrderModalBtn.addEventListener('click', () => {
        orderDetailsModal.style.display = 'none';
    });

    const orderForm = document.createElement('form');
    orderForm.id = 'orderForm';

    // Recipient name input
    const nameLabel = document.createElement('label');
    nameLabel.innerText = 'Nombre y Telefono de quien recibe:';
    nameLabel.htmlFor = 'recipientName';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'recipientName';
    nameInput.name = 'recipientName';
    nameInput.required = true;
    nameInput.style.width = '100%';
    nameInput.style.marginBottom = '10px';

    // Address input
    const addressLabel = document.createElement('label');
    addressLabel.innerText = 'Dirección:';
    addressLabel.htmlFor = 'address';
    const addressInput = document.createElement('textarea');
    addressInput.id = 'address';
    addressInput.name = 'address';
    addressInput.required = true;
    addressInput.style.width = '100%';
    addressInput.style.marginBottom = '10px';
    addressInput.rows = 3;

    // Payment method input
    const paymentLabel = document.createElement('label');
    paymentLabel.innerText = 'Método de pago:';
    paymentLabel.htmlFor = 'paymentMethod';

    const paymentCashLabel = document.createElement('label');
    paymentCashLabel.innerText = 'Efectivo';
    paymentCashLabel.style.marginRight = '10px';
    const paymentCashInput = document.createElement('input');
    paymentCashInput.type = 'radio';
    paymentCashInput.id = 'paymentCash';
    paymentCashInput.name = 'paymentMethod';
    paymentCashInput.value = 'Efectivo';
    paymentCashInput.required = true;

    const paymentTransferLabel = document.createElement('label');
    paymentTransferLabel.innerText = 'Transferencia';
    const paymentTransferInput = document.createElement('input');
    paymentTransferInput.type = 'radio';
    paymentTransferInput.id = 'paymentTransfer';
    paymentTransferInput.name = 'paymentMethod';
    paymentTransferInput.value = 'Transferencia';

    // Append payment inputs
    const paymentDiv = document.createElement('div');
    paymentDiv.style.marginBottom = '10px';
    paymentDiv.appendChild(paymentCashInput);
    paymentDiv.appendChild(paymentCashLabel);
    paymentDiv.appendChild(paymentTransferInput);
    paymentDiv.appendChild(paymentTransferLabel);

    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.innerText = 'Confirmar pedido';
    submitBtn.style.backgroundColor = '#25D366';
    submitBtn.style.color = 'white';
    submitBtn.style.border = 'none';
    submitBtn.style.borderRadius = '5px';
    submitBtn.style.padding = '10px 20px';
    submitBtn.style.cursor = 'pointer';

    // Append all to form
    orderForm.appendChild(nameLabel);
    orderForm.appendChild(nameInput);
    orderForm.appendChild(addressLabel);
    orderForm.appendChild(addressInput);
    orderForm.appendChild(paymentLabel);
    orderForm.appendChild(paymentDiv);
    orderForm.appendChild(submitBtn);

    orderDetailsModal.appendChild(closeOrderModalBtn);
    orderDetailsModal.appendChild(orderForm);
    document.body.appendChild(orderDetailsModal);

    // Handle form submission for both single product and cart
    orderForm.addEventListener('submit', function handleFormSubmit(e) {
        e.preventDefault();

        const recipientName = nameInput.value.trim();
        const address = addressInput.value.trim();
        const paymentMethod = orderForm.paymentMethod.value;

        if (!recipientName || !address || !paymentMethod) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const businessName = document.title || 'Nuestro menú';
        let message = '';

        if (currentOrderType === 'cart') {
            message = `Hola, deseo ordenar de *${businessName}*\n\n`;
            cart.forEach(item => {
                message += `• ${item.quantity}x ${item.name}`;
                if (item.option) {
                    message += ` (${item.option})`;
                }
                message += ` - ${item.price}\n`;
            });
        } else if (currentOrderType === 'single' && singleProduct) {
            message = `Hola, deseo ordenar de *${businessName}*\n\n• 1x ${singleProduct.name}`;
            if (singleProduct.option) {
                message += ` (${singleProduct.option})`;
            }
            if (singleProduct.price) {
                message += ` - ${singleProduct.price}`;
            }
            message += '\n';
        }

        message += `\n📦 INFORMACIÓN DEL DOMICILIO \n`;
        message += `👤 Nombre y teléfono: ${recipientName}\n`;
        message += `📍 Dirección: ${address}\n`;
        message += `💳 Método de pago: ${paymentMethod}`;

        const whatsappNumber = '+573181295561';
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Close modals
        orderDetailsModal.style.display = 'none';
        if (currentOrderType === 'cart') {
            cartModal.style.display = 'none';
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        window.open(whatsappUrl, '_blank');
    });

    continueBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('El carrito está vacío.');
            return;
        }
        
        currentOrderType = 'cart';
        orderDetailsModal.style.display = 'block';
    });

    // Close modal when clicking outside modal content
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (event.target === orderDetailsModal) {
            orderDetailsModal.style.display = 'none';
        }
    });

    // Product image modal elements
    const productImageModal = document.createElement('div');
    productImageModal.id = 'productImageModal';
    productImageModal.style.position = 'fixed';
    productImageModal.style.top = '50%';
    productImageModal.style.left = '50%';
    productImageModal.style.transform = 'translate(-50%, -50%)';
    productImageModal.style.backgroundColor = 'white';
    productImageModal.style.padding = '20px';
    productImageModal.style.borderRadius = '10px';
    productImageModal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    productImageModal.style.zIndex = '10000';
    productImageModal.style.display = 'none';
    productImageModal.style.maxHeight = '80vh';
    productImageModal.style.overflowY = 'auto';
    productImageModal.style.width = '90vw';
    productImageModal.style.maxWidth = '500px';

    const closeImageModalBtn = document.createElement('button');
    closeImageModalBtn.innerText = 'Cerrar';
    closeImageModalBtn.style.marginBottom = '10px';
    closeImageModalBtn.addEventListener('click', () => {
        productImageModal.style.display = 'none';
    });

    const productImage = document.createElement('img');
    productImage.style.maxWidth = '100%';
    productImage.style.maxHeight = '80vh';
    productImage.style.display = 'block';
    productImage.style.margin = '0 auto';

    productImageModal.appendChild(closeImageModalBtn);
    productImageModal.appendChild(productImage);
    document.body.appendChild(productImageModal);

    // Add event listeners to "Ver producto" buttons
    const viewProductButtons = document.querySelectorAll('.productos > button:nth-of-type(2)');
    viewProductButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productDiv = button.closest('.productos');
            if (!productDiv) return;

            const img = productDiv.querySelector('img');
            if (!img) return;

            productImage.src = img.src;
            productImage.alt = img.alt || 'Imagen del producto';
            productImageModal.style.display = 'block';
        });
    });

    // Close modal when clicking outside modal content
    window.addEventListener('click', (event) => {
        if (event.target === productImageModal) {
            productImageModal.style.display = 'none';
        }
    });
});
