// Sample Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        price: 79.99,
        description: "High-quality wireless headphones with noise cancellation",
        icon: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "electronics",
        price: 199.99,
        description: "Feature-rich smartwatch with fitness tracking",
        icon: "⌚"
    },
    {
        id: 3,
        name: "Classic T-Shirt",
        category: "clothing",
        price: 24.99,
        description: "Comfortable cotton t-shirt in various colors",
        icon: "👕"
    },
    {
        id: 4,
        name: "Denim Jeans",
        category: "clothing",
        price: 59.99,
        description: "Premium quality denim jeans",
        icon: "👖"
    },
    {
        id: 5,
        name: "Leather Wallet",
        category: "accessories",
        price: 39.99,
        description: "Genuine leather wallet with multiple card slots",
        icon: "👛"
    },
    {
        id: 6,
        name: "Sunglasses",
        category: "accessories",
        price: 89.99,
        description: "Stylish UV protection sunglasses",
        icon: "🕶️"
    },
    {
        id: 7,
        name: "Laptop Backpack",
        category: "accessories",
        price: 49.99,
        description: "Durable backpack with laptop compartment",
        icon: "🎒"
    },
    {
        id: 8,
        name: "Bluetooth Speaker",
        category: "electronics",
        price: 69.99,
        description: "Portable speaker with amazing sound quality",
        icon: "🔊"
    },
    {
        id: 9,
        name: "Running Shoes",
        category: "clothing",
        price: 89.99,
        description: "Comfortable running shoes for all terrains",
        icon: "👟"
    },
    {
        id: 10,
        name: "Fitness Tracker",
        category: "electronics",
        price: 129.99,
        description: "Track your fitness goals with precision",
        icon: "📱"
    },
    {
        id: 11,
        name: "Winter Jacket",
        category: "clothing",
        price: 149.99,
        description: "Warm and stylish winter jacket",
        icon: "🧥"
    },
    {
        id: 12,
        name: "Baseball Cap",
        category: "accessories",
        price: 19.99,
        description: "Classic baseball cap in multiple colors",
        icon: "🧢"
    }
];

// Cart Management
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart(cart);
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    displayCart();
}

function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
            displayCart();
        }
    }
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        updateCartCount();
        displayCart();
    }
}

// Display Functions
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    // Show first 6 products as featured
    const featuredProducts = products.slice(0, 6);
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

function loadAllProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;

    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const container = document.getElementById('products-grid');
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function displayCart() {
    const cart = getCart();
    const contentDiv = document.getElementById('cart-content');
    const emptyCartDiv = document.getElementById('empty-cart');

    if (cart.length === 0) {
        if (contentDiv) contentDiv.style.display = 'none';
        if (emptyCartDiv) emptyCartDiv.style.display = 'block';
        return;
    }

    if (emptyCartDiv) emptyCartDiv.style.display = 'none';
    if (contentDiv) contentDiv.style.display = 'block';

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    contentDiv.innerHTML = `
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">${item.icon}</div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="btn btn-danger btn-small" onclick="removeFromCart(${item.id})">
                            Remove
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-total">Total:</span>
                <span class="summary-total">$${total.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="checkout()">
                Proceed to Checkout
            </button>
            <button class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;" onclick="clearCart()">
                Clear Cart
            </button>
        </div>
    `;
}

function checkout() {
    alert('Checkout functionality would be implemented here. Thank you for shopping with ShopHub!');
}

// Notification System
function showNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
