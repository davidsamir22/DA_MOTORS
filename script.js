// --- SLIDESHOW ---
const slides = [
    { title: 'Performance Redefined', subtitle: 'Experience the thrill of pure automotive excellence', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80' },
    { title: 'Luxury & Comfort', subtitle: 'Indulge in the finest automotive craftsmanship', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80' },
    { title: 'Innovation & Speed', subtitle: 'Cutting-edge technology meets timeless elegance', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1600&q=80' },
    { title: 'Dream Car Awaits', subtitle: 'Your next adventure starts here at DA MOTORS', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600&q=80' }
];
let currentSlide = 0;
let slideshowInterval = null;

function initSlideshow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slideshow-dots';
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'slideshow-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    hero.appendChild(dotsContainer);

    const prevBtn = document.createElement('button');
    prevBtn.className = 'slideshow-btn slideshow-btn-prev';
    prevBtn.innerHTML = '❮';
    prevBtn.addEventListener('click', prevSlide);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slideshow-btn slideshow-btn-next';
    nextBtn.innerHTML = '❯';
    nextBtn.addEventListener('click', nextSlide);

    hero.appendChild(prevBtn);
    hero.appendChild(nextBtn);

    updateSlide();
    slideshowInterval = setInterval(nextSlide, 6000);
}

function updateSlide() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const slide = slides[currentSlide];
    hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${slide.image}')`;
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    if (title) title.textContent = slide.title;
    if (subtitle) subtitle.textContent = slide.subtitle;
    document.querySelectorAll('.slideshow-dot').forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function nextSlide() { currentSlide = (currentSlide + 1) % slides.length; updateSlide(); }
function prevSlide() { currentSlide = (currentSlide - 1 + slides.length) % slides.length; updateSlide(); }
function goToSlide(i) { currentSlide = i % slides.length; updateSlide(); }


// --- FORM VALIDATION ---
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('#name, #email, #subject, #message');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => { if (input.classList.contains('error')) validateField(input); });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fields = ['name','email','subject','message'].map(id => form.querySelector('#' + id)).filter(Boolean);
        let allValid = true;
        const data = {};
        fields.forEach(f => { const ok = validateField(f); if (!ok) allValid = false; else data[f.id] = f.value.trim(); });
        if (allValid) {
            showSuccessPopup(data);
            form.reset();
            form.querySelectorAll('[id$="Error"]').forEach(e => { e.textContent = ''; e.classList.remove('show'); });
        }
    });
}

function validateField(field) {
    const id = field.id; const v = field.value.trim(); let ok = true, msg = '';
    if (id === 'name') {
        const r = /^[a-zA-Z\s]{3,50}$/;
        if (!r.test(v)) { ok = false; msg = 'Name must contain only letters and spaces (3-50 characters)'; }
    } else if (id === 'email') {
        const r = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!r.test(v)) { ok = false; msg = 'Please enter a valid email address'; }
    } else if (id === 'subject') {
        const r = /^.{3,100}$/;
        if (v && !r.test(v)) { ok = false; msg = 'Subject must be between 3-100 characters'; }
    } else if (id === 'message') {
        const r = /^.{10,1000}$/;
        if (!r.test(v)) { ok = false; msg = 'Message must be between 10-1000 characters'; }
    }
    displayError(field, ok, msg);
    return ok;
}

function displayError(field, isValid, message) {
    const span = document.getElementById(field.id + 'Error');
    if (!isValid) {
        field.classList.add('error');
        if (span) { span.textContent = message; span.classList.add('show'); }
    } else {
        field.classList.remove('error');
        if (span) { span.textContent = ''; span.classList.remove('show'); }
    }
}

function showSuccessPopup(data) {
    const popup = document.createElement('div'); popup.className = 'popup-overlay';
    const content = document.createElement('div'); content.className = 'popup-content';
    content.innerHTML = `
        <button class="popup-close">&times;</button>
        <div class="popup-icon">✓</div>
        <h2 class="popup-title">Message Sent Successfully!</h2>
        <div class="popup-body">
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            ${data.subject ? `<p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>` : ''}
            <p><strong>Message:</strong> ${escapeHtml(data.message)}</p>
        </div>
        <button class="btn btn-primary popup-btn">Close</button>
    `;
    popup.appendChild(content); document.body.appendChild(popup);
    const remove = () => popup.remove();
    popup.querySelector('.popup-close').addEventListener('click', remove);
    popup.querySelector('.popup-btn').addEventListener('click', remove);
    popup.addEventListener('click', (e) => { if (e.target === popup) remove(); });
}

function escapeHtml(text) { const d = document.createElement('div'); d.textContent = text; return d.innerHTML; }


// --- THEME TOGGLE (dark/light) ---
function createThemeToggle() {
    const btn = document.createElement('button');
    btn.id = 'themeToggle'; btn.className = 'theme-toggle-btn'; btn.innerHTML = '🌙';
    btn.title = 'Toggle Dark/Light Mode'; btn.setAttribute('aria-label','Toggle Dark/Light Mode');
    document.body.appendChild(btn);
    btn.addEventListener('click', () => { toggleTheme(); });
}

function loadSavedTheme() {
    const t = localStorage.getItem('theme') || 'light'; applyTheme(t);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next); localStorage.setItem('theme', next);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle'); if (btn) btn.innerHTML = theme === 'light' ? '🌙' : '☀️';
}


// --- COLOR THEME CHANGER ---
const colorThemes = {
    default: { name: 'Default (Blue)', primary: '#1a1a2e', secondary: '#16213e', accent: '#e94560', accentHover: '#d63651' },
    dark: { name: 'Dark', primary: '#0d0d1a', secondary: '#1a1a2e', accent: '#ff6b9d', accentHover: '#ff4757' },
    green: { name: 'Green', primary: '#1a3a2a', secondary: '#2d5a3d', accent: '#2ecc71', accentHover: '#27ae60' },
    pink: { name: 'Pink', primary: '#3d1e3d', secondary: '#5a2d5a', accent: '#ff1493', accentHover: '#ff69b4' }
};

function createColorThemePanel() {
    const panel = document.createElement('div'); panel.id = 'colorThemePanel'; panel.className = 'color-theme-panel';
    const title = document.createElement('div'); title.className = 'theme-panel-title'; title.textContent = '🎨 Theme'; panel.appendChild(title);
    Object.keys(colorThemes).forEach(key => {
        const t = colorThemes[key];
        const b = document.createElement('button'); b.className = 'color-theme-btn'; b.title = t.name; b.setAttribute('data-theme', key); b.style.backgroundColor = t.accent;
        b.addEventListener('click', () => applyColorTheme(key)); panel.appendChild(b);
    });
    document.body.appendChild(panel);
}

function applyColorTheme(key) {
    const t = colorThemes[key]; if (!t) return;
    document.documentElement.style.setProperty('--primary-color', t.primary);
    document.documentElement.style.setProperty('--secondary-color', t.secondary);
    document.documentElement.style.setProperty('--accent-color', t.accent);
    document.documentElement.style.setProperty('--accent-hover', t.accentHover);
    localStorage.setItem('colorTheme', key);
    document.querySelectorAll('.color-theme-btn').forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-theme') === key));
}

function loadSavedColorTheme() { const k = localStorage.getItem('colorTheme') || 'default'; applyColorTheme(k); }


// --- MOBILE MENU ---
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.querySelector('.nav');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => { nav.classList.toggle('active'); });
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => nav.classList.remove('active')));
}


// --- WISHLIST ---
let wishlist = [];
function loadWishlist() { const s = localStorage.getItem('wishlist'); wishlist = s ? JSON.parse(s) : []; }
function saveWishlist() { localStorage.setItem('wishlist', JSON.stringify(wishlist)); updateWishlistCount(); }
function addToWishlist(item) { if (!wishlist.find(w => w.id === item.id)) { wishlist.push(item); saveWishlist(); showToast('✓ Added to wishlist!'); } }
function removeFromWishlist(id) { wishlist = wishlist.filter(w => w.id !== id); saveWishlist(); showToast('✓ Removed from wishlist'); renderWishlistPage(); }

function initWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (wishlist.some(w => w.id === id)) btn.classList.add('active');
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id'); const name = btn.getAttribute('data-name'); const price = btn.getAttribute('data-price'); const image = btn.getAttribute('data-image');
            if (btn.classList.contains('active')) { removeFromWishlist(id); btn.classList.remove('active'); } else { addToWishlist({id,name,price,image}); btn.classList.add('active'); }
        });
    });
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        if (btn.textContent.includes('Add to Wishlist')) btn.addEventListener('click', (e) => { e.preventDefault(); const card = btn.closest('.product-card'); const wishBtn = card && card.querySelector('.wishlist-btn'); if (wishBtn) wishBtn.click(); });
    });
}

function renderWishlistPage() {
    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyState = document.getElementById('emptyState');
    if (!wishlistGrid) return;
    if (!wishlist.length) { wishlistGrid.classList.remove('active'); if (emptyState) emptyState.classList.remove('hidden'); return; }
    if (emptyState) emptyState.classList.add('hidden'); wishlistGrid.classList.add('active'); wishlistGrid.innerHTML = '';
    wishlist.forEach(item => {
        const card = document.createElement('div'); card.className = 'wishlist-item';
        card.innerHTML = `
            <div class="product-image"><img src="${item.image}" alt="${item.name}"></div>
            <div class="product-info"><h3 class="product-name">${item.name}</h3><p class="product-price">${item.price}</p><button class="remove-btn" data-id="${item.id}">Remove from Wishlist</button></div>`;
        const removeBtn = card.querySelector('.remove-btn'); removeBtn.addEventListener('click', () => removeFromWishlist(item.id)); wishlistGrid.appendChild(card);
    });
}

function updateWishlistCount() { document.querySelectorAll('#nav-wishlist-count').forEach(el => el.textContent = `(${wishlist.length})`); }

function showToast(message) { const toast = document.getElementById('toast'); if (!toast) return; toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2000); }


// --- INIT ALL ---
function initAll() {
    initSlideshow();
    setupFormValidation();
    createThemeToggle(); loadSavedTheme();
    createColorThemePanel(); loadSavedColorTheme();
    loadWishlist(); initWishlistButtons(); updateWishlistCount(); renderWishlistPage();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll); else initAll();
