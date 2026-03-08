/* ============================================
   JEENIE - Main JavaScript
   ============================================ */
// === Navbar scroll effect ===
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
    scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
});
// === Mobile menu ===
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
hamburger?.addEventListener('click', () => mobileMenu?.classList.add('open'));
mobileClose?.addEventListener('click', () => mobileMenu?.classList.remove('open'));
document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => mobileMenu?.classList.remove('open'));
});
// === Scroll to top ===
const scrollTopBtn = document.getElementById('scrollTop');
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
// === Scroll animations ===
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
        }
    });
}, { threshold: 0.08 });
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
// === FAQ accordion ===
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});
// === WhatsApp Chat Simulation ===
const chatMessages = [
    { type: 'out', text: 'test me on Thermodynamics 🔥', delay: 0 },
    { type: 'typing', delay: 1200 },
    { type: 'in', text: '🧪 <strong>Mini Test – Thermodynamics</strong>\nEasy → Medium → Hard\n\n<strong>Q1 (Easy)</strong> In a reversible isothermal expansion, what happens to the internal energy of an ideal gas?\n\nA) Increases\nB) Decreases\nC) Remains same\nD) Becomes zero', delay: 2800 },
    { type: 'out', text: 'C', delay: 4500 },
    { type: 'typing', delay: 5200 },
    { type: 'in', text: '✅ <strong>Correct!</strong>\n\nFor an ideal gas, ΔU = nCvΔT\nIn isothermal process → ΔT = 0 → ΔU = 0\n\n<em>Concept: 1st Law + Ideal Gas</em>\n\n🔥 <strong>Streak: 14 days!</strong>', delay: 6400 },
];
function animateChat() {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;
    chatBody.innerHTML = '';
    let msgElements = [];
    chatMessages.forEach((msg, idx) => {
        setTimeout(() => {
            if (msg.type === 'typing') {
                const typing = document.createElement('div');
                typing.className = 'typing-dots';
                typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
                chatBody.appendChild(typing);
                chatBody.scrollTop = chatBody.scrollHeight;
                msgElements.push({ el: typing, isTyping: true });
            } else {
                // Remove typing indicators
                msgElements.filter(m => m.isTyping).forEach(m => m.el.remove());
                msgElements = msgElements.filter(m => !m.isTyping);
                const el = document.createElement('div');
                el.className = `wa-msg wa-msg-${msg.type === 'in' ? 'in' : 'out'}`;
                el.innerHTML = msg.text.replace(/\n/g, '<br>');
                const time = document.createElement('div');
                time.className = 'wa-msg-time';
                time.innerHTML = `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} ${msg.type === 'out' ? '<span class="wa-tick">✓✓</span>' : ''}`;
                el.appendChild(time);
                chatBody.appendChild(el);
                chatBody.scrollTop = chatBody.scrollHeight;
                el.style.opacity = '0';
                el.style.transform = 'translateY(10px)';
                requestAnimationFrame(() => {
                    el.style.transition = 'opacity 0.3s, transform 0.3s';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                });
                msgElements.push({ el, isTyping: false });
            }
        }, msg.delay);
    });
    // Restart loop
    const maxDelay = Math.max(...chatMessages.map(m => m.delay)) + 4000;
    setTimeout(animateChat, maxDelay);
}
// Start chat animation when visible
const phoneSection = document.getElementById('phoneSection');
if (phoneSection) {
    const phoneObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { animateChat(); phoneObs.disconnect(); }
    }, { threshold: 0.3 });
    phoneObs.observe(phoneSection);
} else {
    // Start immediately on hero
    setTimeout(animateChat, 1500);
}
// === Animated counter ===
function animateCounter(el, target, duration = 1500) {
    const start = performance.now();
    const startVal = 0;
    const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}
const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            animateCounter(entry.target, target);
            counterObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));
// === Streak counter animation ===
const streakEl = document.getElementById('streakCount');
if (streakEl) {
    const sObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { animateCounter(streakEl, 14); sObs.disconnect(); }
    }, { threshold: 0.5 });
    sObs.observe(streakEl);
}
// === Smooth scroll for nav links ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
// === Razorpay Payment Integration ===
// All values come from js/config.js (JEENIE_CONFIG)
function openRazorpay(planId) {
    const cfg = typeof JEENIE_CONFIG !== 'undefined' ? JEENIE_CONFIG : null;
    const planData = cfg ? cfg.plans.find(p => p.id === planId) : null;
    if (!planData) return;

    const options = {
        key: cfg.razorpayKey,
        amount: planData.price * 100,   // paise
        currency: 'INR',
        name: 'Jeenie',
        description: `${planData.name} Pack – ${planData.credits} Credits`,
        image: 'https://jeenie.koax.in/assets/logo.png',
        handler: function (response) {
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}\nYour ${planData.credits} credits will be added via WhatsApp in a few seconds.`);
        },
        prefill: { name: '', email: '', contact: '' },
        notes: { plan: planId, credits: planData.credits },
        theme: { color: '#6C3DE8' },
        modal: { ondismiss: function () { console.log('Payment dismissed'); } }
    };

    if (typeof Razorpay !== 'undefined') {
        const rzp = new Razorpay(options);
        rzp.open();
    } else {
        const waNum = cfg ? cfg.whatsappNumber : '91XXXXXXXXXX';
        window.open(`https://wa.me/${waNum}?text=I+want+to+buy+the+${planId}+plan+(₹${planData.price})`, '_blank');
    }
}
// Attach to pricing buttons
document.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', () => openRazorpay(btn.dataset.plan));
});
// === WhatsApp start button ===
document.querySelectorAll('.wa-start').forEach(btn => {
    btn.addEventListener('click', () => {
        const msg = encodeURIComponent("Hi Jeenie! I want to start my JEE prep 🚀");
        window.open(`https://wa.me/91XXXXXXXXXX?text=${msg}`, '_blank');
    });
});
// === Page load animation ===
document.documentElement.style.setProperty('--page-loaded', '1');