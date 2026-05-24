// FORME Luxury Ecommerce - JavaScript Interactions

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Cart functionality
const cartIcon = document.querySelector('.cart-icon');
let cartCount = 0;

cartIcon.addEventListener('click', () => {
    console.log('Cart opened. Items:', cartCount);
});

// Product button interactions
document.querySelectorAll('.product-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const productName = this.closest('.product-card').querySelector('h3').textContent;
        
        // Visual feedback
        const originalText = this.textContent;
        this.textContent = 'Added to Ritual ✓';
        this.style.backgroundColor = 'var(--color-sage)';
        
        cartCount++;
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = '';
        }, 2000);
        
        console.log(`${productName} added to cart`);
    });
});

// CTA Button
document.querySelector('.cta-button').addEventListener('click', () => {
    document.getElementById('rituals').scrollIntoView({ behavior: 'smooth' });
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (email) {
            const button = this.querySelector('button');
            const originalText = button.textContent;
            button.textContent = 'Welcome to FORME ✓';
            button.style.backgroundColor = 'var(--color-sage)';
            
            this.querySelector('input[type="email"]').value = '';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 3000);
            
            console.log('Newsletter signup:', email);
        }
    });
}

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe product cards and ritual cards
document.querySelectorAll('.product-card, .ritual-card, .ingredient-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (lastScrollY > 100) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Add hover effects to cards
const addCardHoverEffects = () => {
    document.querySelectorAll('.intro-card, .ritual-card, .ingredient-card, .testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'var(--transition-smooth)';
        });
    });
};

addCardHoverEffects();

// Log page load
console.log('%cFORME', 'font-family: serif; font-size: 24px; color: #1a1a1a; font-weight: 400; letter-spacing: 2px;');
console.log('%cNot a routine. A ritual.', 'font-style: italic; color: #666666; margin-top: 10px;');