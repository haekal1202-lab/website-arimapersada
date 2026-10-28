// 1. Efek Scroll Reveal
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });
revealElements.forEach(el => revealObserver.observe(el));

// 2. Logika Accordion FAQ
const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question span').textContent = '+';
                }
            });
            item.classList.toggle('active');
            const icon = question.querySelector('span');
            icon.textContent = item.classList.contains('active') ? '-' : '+';
        });
    });
}

// 3. Navbar berubah warna saat di-scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(5, 5, 5, 0.95)';
        nav.style.padding = '10px 5%';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.85)';
        nav.style.padding = '15px 5%';
    }
});
