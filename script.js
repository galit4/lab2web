// ============================================================
// Лабораторна робота №4 — JavaScript
// ============================================================

// ============================================================
// 1. Інформація про систему у localStorage та футер
// ============================================================
function saveSystemInfo() {
    const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled ? 'Так' : 'Ні',
        screen: `${screen.width}×${screen.height}`,
        online: navigator.onLine ? 'Online' : 'Offline'
    };

    Object.entries(info).forEach(([key, value]) => {
        localStorage.setItem(`sys_${key}`, String(value));
    });

    return info;
}

function renderSystemInfoInFooter() {
    const container = document.getElementById('system-info');
    if (!container) return;

    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key.startsWith('sys_')) continue;
        const label = key.slice(4);
        const value = localStorage.getItem(key);
        items.push(`<li><strong>${label}:</strong> <span>${value}</span></li>`);
    }

    container.innerHTML = `
        <h3>Інформація про систему</h3>
        <ul class="system-info-list">${items.join('')}</ul>
    `;
}

// ============================================================
// 2. Відгуки роботодавців з JSONPlaceholder (варіант 27)
// ============================================================
async function loadReviews() {
    const container = document.getElementById('reviews-list');
    if (!container) return;

    container.innerHTML = '<p class="reviews-status">Завантаження відгуків…</p>';

    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts/27/comments');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const comments = await res.json();

        container.innerHTML = comments.map(c => `
            <article class="review-card">
                <h3 class="review-name">${c.name}</h3>
                <a href="mailto:${c.email}" class="review-email">${c.email}</a>
                <p class="review-body">${c.body}</p>
            </article>
        `).join('');
    } catch (err) {
        container.innerHTML = `<p class="reviews-status error">Не вдалося завантажити відгуки: ${err.message}</p>`;
    }
}

// ============================================================
// 3. Модальне вікно з формою через 60 секунд
// ============================================================
function setupContactModal() {
    const modal = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('modal-close');
    if (!modal || !closeBtn) return;

    // Показати модалку через 60 секунд (як у методичці)
    setTimeout(() => {
        modal.classList.add('open');
    }, 60000);

    // Закрити по кнопці
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    // Закрити по кліку на затемнений фон
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    // Закрити по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
        }
    });
}

// ============================================================
// 4. Перемикач теми день/ніч
// ============================================================
function getAutoTheme() {
    const hour = new Date().getHours();
    // Денна тема: 07:00–20:59, нічна: 21:00–06:59
    return (hour >= 7 && hour < 21) ? 'light' : 'dark';
}

function applyTheme(theme) {
    document.body.classList.toggle('light', theme === 'light');
    document.body.classList.toggle('dark', theme === 'dark');

    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.textContent = theme === 'light' ? '🌙 Ніч' : '☀️ День';
        btn.setAttribute('aria-label', theme === 'light' ? 'Увімкнути нічну тему' : 'Увімкнути денну тему');
    }
}

function setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    // Початкова тема — автоматично за часом доби
    let theme = getAutoTheme();
    applyTheme(theme);

    // Ручне перемикання по кнопці
    btn.addEventListener('click', () => {
        theme = (theme === 'light') ? 'dark' : 'light';
        applyTheme(theme);
    });
}

// ============================================================
// Запуск після завантаження DOM
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    saveSystemInfo();
    renderSystemInfoInFooter();
    loadReviews();
    setupContactModal();
    setupThemeToggle();
});
