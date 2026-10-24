// Main Portfolio JavaScript

// Typing Animation
const typingText = document.querySelector('.typing-text');
const phrases = [
    'COMPUTER SCIENCE STUDENT',
    'FRONTEND DEVELOPER',
    'PROBLEM SOLVER',
    'ALGORITHM ENTHUSIAST',
    'CYBERSECURITY ENTHUSIAST',
    'UI/UX & GRAPHIC DESIGNER'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        // pause on the finished phrase, then start deleting
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
    }

    setTimeout(typeText, typingSpeed);
}

setTimeout(typeText, 1000);

// Theme Toggle (remembers your choice)
const themeToggle = document.getElementById('themeToggle');
let isDarkTheme = true;

try {
    if (localStorage.getItem('portfolioTheme') === 'light') {
        isDarkTheme = false;
        document.body.classList.add('light-theme');
    }
} catch (e) { /* storage unavailable, ignore */ }

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme');

    try { localStorage.setItem('portfolioTheme', isDarkTheme ? 'dark' : 'light'); } catch (e) {}

    // Play sound effect
    playSound('click');
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            closeMobileMenu();
        }
    });
});

// Game Modal Functions
function openGame(gameType) {
    const modal = document.getElementById(`${gameType}Modal`);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    playSound('open');
    
    if (gameType === 'snake') {
        initSnake();
    } else if (gameType === 'memory') {
        initMemory();
    }
}

function closeGame(gameType) {
    const modal = document.getElementById(`${gameType}Modal`);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    playSound('close');
    
    if (gameType === 'snake') {
        stopSnake();
    } else if (gameType === 'memory') {
        stopMemory();
    }
}

// Close modal on outside click
document.querySelectorAll('.game-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            const gameType = modal.id.replace('Modal', '');
            closeGame(gameType);
        }
    });
});

// Sound Effects System
const sounds = {
    click: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyFzu/afjUIHG7A7+OZSA0PV6vo7aZPFApCm9/zvWoeBCx+zO/bjjcIDlqz5+6kUhELRp7f8rdjIAQpfMvv34w2CAhYruTto1ITC0SS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEw=='),
    open: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyFzu/afjUIHG7A7+OZSA0PV6vo7aZPFApCm9/zvWoeBCx+zO/bjjcIDlqz5+6kUhELRp7f8rdjIAQpfMvv34w2CAhYruTto1ITC0SS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEw=='),
    close: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyFzu/afjUIHG7A7+OZSA0PV6vo7aZPFApCm9/zvWoeBCx+zO/bjjcIDlqz5+6kUhELRp7f8rdjIAQpfMvv34w2CAhYruTto1ITC0SS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEwtDktvxvWQfBCh6ye/fjDoICFeu5O6iUhMLQ5Lb8b1kHwQoesnv34w6CAhXruTuolITC0OS2/G9ZB8EKHrJ79+MOggIV67k7qJSEw==')
};

function playSound(type) {
    if (sounds[type]) {
        sounds[type].currentTime = 0;
        sounds[type].volume = 0.3;
        sounds[type].play().catch(() => {
            // Ignore if autoplay is blocked
        });
    }
}

// Snake Game Preview Animation
const snakePreview = document.getElementById('snakePreview');
if (snakePreview) {
    const previewCtx = snakePreview.getContext('2d');
    let previewSnake = [{ x: 5, y: 5 }];
    let previewDirection = { x: 1, y: 0 };
    const gridSize = 15;
    const cellSize = snakePreview.width / gridSize;

    function drawPreviewSnake() {
        previewCtx.fillStyle = '#0a0a0f';
        previewCtx.fillRect(0, 0, snakePreview.width, snakePreview.height);

        // Draw grid
        previewCtx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
        previewCtx.lineWidth = 1;
        for (let i = 0; i <= gridSize; i++) {
            previewCtx.beginPath();
            previewCtx.moveTo(i * cellSize, 0);
            previewCtx.lineTo(i * cellSize, snakePreview.height);
            previewCtx.stroke();
            previewCtx.beginPath();
            previewCtx.moveTo(0, i * cellSize);
            previewCtx.lineTo(snakePreview.width, i * cellSize);
            previewCtx.stroke();
        }

        // Draw snake
        previewSnake.forEach((segment, index) => {
            const gradient = previewCtx.createRadialGradient(
                segment.x * cellSize + cellSize / 2,
                segment.y * cellSize + cellSize / 2,
                0,
                segment.x * cellSize + cellSize / 2,
                segment.y * cellSize + cellSize / 2,
                cellSize / 2
            );
            gradient.addColorStop(0, '#00f0ff');
            gradient.addColorStop(1, '#b000ff');
            previewCtx.fillStyle = gradient;
            previewCtx.fillRect(
                segment.x * cellSize + 1,
                segment.y * cellSize + 1,
                cellSize - 2,
                cellSize - 2
            );
            
            // Glow effect
            previewCtx.shadowBlur = 15;
            previewCtx.shadowColor = index === 0 ? '#00f0ff' : '#b000ff';
        });
        previewCtx.shadowBlur = 0;

        // Update snake position
        const head = { ...previewSnake[0] };
        head.x += previewDirection.x;
        head.y += previewDirection.y;

        // Wrap around
        if (head.x >= gridSize) head.x = 0;
        if (head.x < 0) head.x = gridSize - 1;
        if (head.y >= gridSize) head.y = 0;
        if (head.y < 0) head.y = gridSize - 1;

        previewSnake.unshift(head);
        if (previewSnake.length > 5) {
            previewSnake.pop();
        }

        // Random direction changes
        if (Math.random() < 0.05) {
            const directions = [
                { x: 1, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: -1 }
            ];
            previewDirection = directions[Math.floor(Math.random() * directions.length)];
        }
    }

    setInterval(drawPreviewSnake, 200);
}

// Memory Card Preview Animation
const memoryCards = document.querySelectorAll('.preview-card');
memoryCards.forEach((card, index) => {
    setInterval(() => {
        card.style.background = Math.random() > 0.5
            ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(176, 0, 255, 0.2))'
            : 'linear-gradient(135deg, rgba(176, 0, 255, 0.2), rgba(0, 240, 255, 0.2))';
    }, 2000 + index * 500);
});

// Add enter key support for games
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('snakeModal').classList.contains('active')) {
            closeGame('snake');
        }
        if (document.getElementById('memoryModal').classList.contains('active')) {
            closeGame('memory');
        }
    }
});

// =====================================================================
// PORTFOLIO UPGRADE ADDITIONS
// =====================================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Toast helper ----------
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

// ---------- Mobile menu ----------
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

function closeMobileMenu() {
    if (!navToggle) return;
    navToggle.classList.remove('open');
    navLinksEl.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const open = navToggle.classList.toggle('open');
        navLinksEl.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });
}

// ---------- Scroll: progress bar, nav state, back-to-top, active link ----------
const navEl = document.getElementById('nav');
const progressEl = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const navAnchors = Array.from(document.querySelectorAll('.nav-link'));
const sectionEls = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

let scrollTicking = false;

function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    progressEl.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    navEl.classList.toggle('scrolled', y > 40);
    backToTop.classList.toggle('visible', y > 600);

    // highlight the link for the section currently in view
    let current = sectionEls[0];
    sectionEls.forEach(sec => {
        if (sec.getBoundingClientRect().top <= window.innerHeight * 0.35) current = sec;
    });
    navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
    });

    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(onScroll);
        scrollTicking = true;
    }
}, { passive: true });
onScroll();

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- Scroll reveal (with a small stagger between siblings) ----------
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('in-view');
        revealObserver.unobserve(el);

        // after the entrance finishes, restore normal hover transitions
        setTimeout(() => {
            el.classList.add('revealed');
            el.style.transitionDelay = '';
        }, 1100 + (parseInt(el.dataset.delay, 10) || 0));
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

// existing cards keep their animation, now class-based so hover effects still work
document.querySelectorAll('.game-card, .contact-box').forEach(el => el.classList.add('reveal'));

document.querySelectorAll('.reveal').forEach(el => {
    const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
    const delay = Math.min(siblings.indexOf(el), 5) * 90;
    if (delay) {
        el.style.transitionDelay = delay + 'ms';
        el.dataset.delay = delay;
    }
    revealObserver.observe(el);
});

// ---------- Animated counters ----------
function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    if (prefersReducedMotion) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });

document.querySelectorAll('.count').forEach(el => countObserver.observe(el));

// ---------- Mouse spotlight on cards ----------
document.querySelectorAll('.spot').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
});

// ---------- Project filters ----------
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.games-grid .game-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterButtons.forEach(b => b.classList.toggle('active', b === btn));

        projectCards.forEach(card => {
            const cats = (card.dataset.category || '').split(' ');
            const show = filter === 'all' || cats.includes(filter);
            card.classList.remove('filter-in');
            card.classList.toggle('is-hidden', !show);
            if (show) {
                // make sure the card is visible even if it hasn't scrolled into view yet
                card.classList.add('in-view', 'revealed');
                void card.offsetWidth; // restart the animation
                card.classList.add('filter-in');
            }
        });
        playSound('click');
    });
});

// ---------- Copy email ----------
const copyBtn = document.getElementById('copyEmail');
if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
        const email = '250200360@aston.ac.uk';
        try {
            await navigator.clipboard.writeText(email);
            showToast('EMAIL COPIED');
        } catch (e) {
            showToast(email);
        }
    });
}

// ---------- Contact form (opens the visitor's email app) ----------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();

        let valid = true;
        [['name', name], ['email', email], ['message', message]].forEach(([field, value]) => {
            const wrap = contactForm[field].closest('.form-field');
            const ok = field === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : value.length > 0;
            wrap.classList.toggle('error', !ok);
            if (!ok) valid = false;
        });

        if (!valid) {
            showToast('PLEASE FILL IN ALL FIELDS');
            return;
        }

        const subject = encodeURIComponent('Portfolio enquiry from ' + name);
        const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
        window.location.href = 'mailto:250200360@aston.ac.uk?subject=' + subject + '&body=' + body;
        showToast('OPENING YOUR EMAIL APP...');
        contactForm.reset();
    });

    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => field.closest('.form-field').classList.remove('error'));
    });
}

// ---------- Hide links that haven't been filled in yet ----------
// Remove the data-placeholder attribute in index.html once a link has a real URL.
document.querySelectorAll('a[data-placeholder]').forEach(link => link.style.display = 'none');

// Initialize
console.log('%c🚀 CYBERPUNK PORTFOLIO LOADED 🚀', 'color: #00f0ff; font-size: 20px; font-weight: bold;');
console.log('%cCreated by Ibrahim Ahmed', 'color: #b000ff; font-size: 14px;');