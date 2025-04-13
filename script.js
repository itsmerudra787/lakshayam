let cart = [];

// Initialize elements
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// Show items with fade-in effect as user scrolls
document.addEventListener('DOMContentLoaded', function() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
      }
    });
  }, { threshold: 0.1 });
  
  fadeElements.forEach(element => {
    element.style.opacity = 0;
    observer.observe(element);
  });
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartDisplay();
  
  // Show notification
  notificationMessage.textContent = `${name} added to cart!`;
  notification.classList.add('show');
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function updateCartDisplay() {
  let cartCount = cart.reduce((total, item) => total + item.qty, 0);
  let cartTotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  document.getElementById("cart-count").textContent = cartCount;
  document.getElementById("cart-total").textContent = cartTotal;

  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Your cart is empty";
    li.style.textAlign = "center";
    li.style.padding = "1rem";
    li.style.color = "#757575";
    cartItemsContainer.appendChild(li);
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      
      const itemInfo = document.createElement("div");
      itemInfo.textContent = `${item.name} (${item.qty} kg)`;
      
      const itemPrice = document.createElement("div");
      itemPrice.textContent = `₹${item.price * item.qty}`;
      itemPrice.style.fontWeight = "bold";
      
      li.appendChild(itemInfo);
      li.appendChild(itemPrice);
      cartItemsContainer.appendChild(li);
    });
  }
}

function toggleCartPopup() {
  const popup = document.getElementById("cart-popup");
  popup.style.display =
    popup.style.display === "block" ? "none" : "block";
}

function clearCart() {
  cart = [];
  updateCartDisplay();
  notificationMessage.textContent = "Cart cleared!";
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function proceedToPayment() {
  if (cart.length === 0) {
    notificationMessage.textContent = "Your cart is empty! Please add some scrap to buy.";
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
    return;
  }

  // Create order summary modal
  const orderSummary = document.createElement('div');
  orderSummary.style.position = 'fixed';
  orderSummary.style.top = '50%';
  orderSummary.style.left = '50%';
  orderSummary.style.transform = 'translate(-50%, -50%)';
  orderSummary.style.backgroundColor = 'white';
  orderSummary.style.padding = '2rem';
  orderSummary.style.borderRadius = '8px';
  orderSummary.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
  orderSummary.style.zIndex = '1000';
  orderSummary.style.maxWidth = '500px';
  orderSummary.style.width = '90%';
  
  orderSummary.innerHTML = `
    <h3 style="color: var(--primary-color); margin-bottom: 1rem; text-align: center;">
      <i class="fas fa-receipt"></i> Order Summary
    </h3>
    <ul style="margin-bottom: 1.5rem; list-style: none;">
      ${cart.map(item => `
        <li style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
          <span>${item.qty} kg ${item.name}</span>
          <span style="font-weight: bold;">₹${item.price * item.qty}</span>
        </li>
      `).join('')}
    </ul>
    <div style="text-align: right; font-weight: bold; font-size: 1.2rem; margin-bottom: 1.5rem;">
      Total: ₹${cart.reduce((total, item) => total + item.price * item.qty, 0)}
    </div>
    <div style="display: flex; justify-content: space-between; gap: 1rem;">
      <button onclick="this.parentElement.parentElement.remove()" style="padding: 0.75rem; background: #757575; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1;">
        Cancel
      </button>
      <button onclick="completePayment()" style="padding: 0.75rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1; font-weight: bold;">
        Confirm Payment
      </button>
    </div>
  `;
  
  document.body.appendChild(orderSummary);
}

function completePayment() {
  // This would process payment in a real app
  // For demo, we'll show a success message
  const orderSummary = document.querySelector('div[style*="position: fixed;"]');
  orderSummary.innerHTML = `
    <div style="text-align: center; padding: 1rem;">
      <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
      <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Payment Successful!</h3>
      <p style="margin-bottom: 1.5rem;">Thank you for your purchase. Your order has been placed successfully.</p>
      <button onclick="this.parentElement.parentElement.remove(); clearCart(); toggleCartPopup()" style="padding: 0.75rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%;">
        Continue Shopping
      </button>
    </div>
  `;
}

document
  .getElementById("sell-scrap-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const type = document.getElementById("scrap-type").value;
    const qty = document.getElementById("quantity").value;
    const quality = document.getElementById("quality").value;
    const contact = document.getElementById("contact").value;
    
    // In a real app, this would send data to server
    notificationMessage.textContent = `Thank you for your offer to sell ${qty} kg of ${type} (${quality} quality)! We will contact you at ${contact} soon.`;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 5000);
    
    this.reset();
  });

  function login() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
  
    // Simple authentication check
    if(user === 'admin' && pass === '1234') {
      // Redirect to dashboard page
      window.location.href = '/dashboard';
    } else {
      alert('Invalid credentials! Try admin / 1234');
    }
  }

