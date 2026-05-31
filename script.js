/* =====================================================
   SERVISUS Runda — Main JavaScript
   Navigation, Animations, Forms, localStorage DB
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHamburger();
    initScrollAnimations();
    initStatCounters();
    initGalleryFilter();
    initBookingForm();
    initQuoteForm();
});

// ─── NAVBAR SCROLL ───
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
    // Active link tracking
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            const top = s.offsetTop - 120;
            if (window.scrollY >= top) current = s.getAttribute('id');
        });
        navLinks.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('data-nav') === current) l.classList.add('active');
        });
    });
}

// ─── HAMBURGER ───
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ─── SCROLL ANIMATIONS ───
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .testimonial-card, .contact-card, .about-feature, .gallery-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ─── STAT COUNTERS ───
function initStatCounters() {
    const stats = document.querySelectorAll('.stat');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const isDecimal = el.dataset.decimal === 'true';
                const numEl = el.querySelector('.stat-number');
                animateCount(numEl, target, isDecimal);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCount(el, target, isDecimal) {
    const duration = 2000;
    const start = performance.now();
    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        if (isDecimal) {
            el.textContent = current.toFixed(1);
        } else if (target >= 1000) {
            el.textContent = Math.floor(current).toLocaleString() + '+';
        } else {
            el.textContent = Math.floor(current) + '+';
        }
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ─── GALLERY FILTER ───
function initGalleryFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            items.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.4s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ─── BOOKING FORM ───
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        data.id = Date.now();
        data.date = new Date().toISOString();
        data.status = 'New';
        data.type = 'booking';

        const bookings = JSON.parse(localStorage.getItem('servisus_bookings') || '[]');
        bookings.push(data);
        localStorage.setItem('servisus_bookings', JSON.stringify(bookings));

        form.reset();
        showToast('✅ Booking submitted! We\'ll contact you within 2 hours.');
    });
}

// ─── QUOTE MODAL ───
function openQuoteModal(serviceName) {
    document.getElementById('modalServiceName').textContent = serviceName;
    document.getElementById('modalServiceInput').value = serviceName;
    document.getElementById('quoteModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeQuoteModal() {
    document.getElementById('quoteModal').classList.remove('active');
    document.body.style.overflow = '';
}
// Close on overlay click
document.getElementById('quoteModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeQuoteModal();
});

function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        data.id = Date.now();
        data.date = new Date().toISOString();
        data.status = 'New';
        data.type = 'enquiry';

        const enquiries = JSON.parse(localStorage.getItem('servisus_bookings') || '[]');
        enquiries.push(data);
        localStorage.setItem('servisus_bookings', JSON.stringify(enquiries));

        form.reset();
        closeQuoteModal();
        showToast('✅ Enquiry sent! We\'ll get back to you shortly.');
    });
}

// ─── TOAST ───
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// Make functions global
window.openQuoteModal = openQuoteModal;
window.closeQuoteModal = closeQuoteModal;
