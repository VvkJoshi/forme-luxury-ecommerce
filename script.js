/* ════════════════════════════════════════
   FORME — script.js
   Cart, Particles, Scroll Reveal, Parallax
════════════════════════════════════════ */

// ── CART STATE ──────────────────────────────────────────────
const cart = {};

const cartDrawer  = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartBtn     = document.getElementById('cartBtn');
const cartClose   = document.getElementById('cartClose');
const cartItems   = document.getElementById('cartItems');
const cartEmpty   = document.getElementById('cartEmpty');
const cartFooter  = document.getElementById('cartFooter');
const cartCount   = document.getElementById('cartCount');
const cartTotal   = document.getElementById('cartTotal');
const toast       = document.getElementById('toast');

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function addToCart(id, name, price) {
  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { id, name, price: parseInt(price), qty: 1 };
  }
  renderCart();
  showToast(`✦ ${name} added`);
  // Wiggle cart icon
  cartBtn.style.transform = 'scale(1.35)';
  setTimeout(() => { cartBtn.style.transform = ''; }, 200);
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  renderCart();
}

function renderCart() {
  const items = Object.values(cart);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  // Count badge
  cartCount.textContent = count;
  cartCount.classList.toggle('show', count > 0);

  // Footer
  cartFooter.style.display = items.length ? 'block' : 'none';
  cartEmpty.style.display  = items.length ? 'none' : 'flex';
  cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;

  // Items
  const existing = cartItems.querySelectorAll('.cart-item');
  existing.forEach(el => el.remove());

  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
      </div>
      <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
    `;
    cartItems.appendChild(el);
  });

  cartItems.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      changeQty(btn.dataset.id, parseInt(btn.dataset.delta));
    });
  });
}

// Delegate Add to Cart clicks
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-id][data-name][data-price]');
  if (btn && (btn.classList.contains('add-btn') || btn.classList.contains('quick-add'))) {
    addToCart(btn.dataset.id, btn.dataset.name, btn.dataset.price);
  }
});

// ── TOAST ────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── NEWSLETTER ───────────────────────────────────────────────
function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  showToast(`🌿 Welcome to the ritual, ${input.value}`);
  input.value = '';
}

// ── NAVBAR SCROLL ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── PARALLAX HERO ─────────────────────────────────────────────
const heroParallax = document.getElementById('heroParallax');
window.addEventListener('scroll', () => {
  if (!heroParallax) return;
  const y = window.scrollY;
  heroParallax.style.transform = `translateY(${y * 0.28}px)`;
}, { passive: true });

// ── SCROLL REVEAL ─────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── FLOATING PARTICLES ────────────────────────────────────────
const particleContainer = document.getElementById('particles');
const PARTICLE_COUNT = 18;

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 180 + 60;
  const x = Math.random() * 100;
  const duration = Math.random() * 25 + 20;
  const delay = Math.random() * 15;
  p.style.cssText = `
    width:${size}px;
    height:${size}px;
    left:${x}%;
    bottom:-${size}px;
    animation-duration:${duration}s;
    animation-delay:${delay}s;
  `;
  particleContainer.appendChild(p);
}
for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

// ── PRODUCT CARD MAGNETIC TILT ─────────────────────────────────
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-10px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});
