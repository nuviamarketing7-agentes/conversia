'use strict';

// ── Top bar countdown & close ─────────────────
const topBar = document.getElementById('top-bar');
const topBarClose = document.getElementById('top-bar-close');
const spotsEl = document.getElementById('spots-count');

if (topBarClose) {
    topBarClose.addEventListener('click', () => {
        topBar.style.transition = 'height 0.3s, opacity 0.3s, padding 0.3s';
        topBar.style.opacity = '0';
        topBar.style.height = '0';
        topBar.style.padding = '0';
        topBar.style.overflow = 'hidden';
    });
}

// Simulate decrementing spots (for urgency)
if (spotsEl) {
    let spots = 7;
    setTimeout(() => {
        spots = 6;
        spotsEl.textContent = spots;
    }, 30000);
}

// ── Sticky nav active state ───────────────────
const lpNav = document.getElementById('lp-nav');
window.addEventListener('scroll', () => {
    lpNav && lpNav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Fade-in on scroll (lp-fade elements) ──────
const lpFadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const siblings = [...entry.target.parentNode.querySelectorAll('.lp-fade')];
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.min(idx * 100, 400)}ms`;
            entry.target.classList.add('visible');
            lpFadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.lp-fade').forEach(el => lpFadeObserver.observe(el));

// ── Hero Canvas (particles) ───────────────────
(function initLpCanvas() {
    const canvas = document.getElementById('lp-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
        buildParticles();
    }

    function buildParticles() {
        particles = [];
        const count = Math.floor(W / 18);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.4 + 0.3,
                vx: (Math.random() - 0.5) * 0.22,
                vy: (Math.random() - 0.5) * 0.22,
                alpha: Math.random() * 0.45 + 0.05,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Background gradient glow
        const grd = ctx.createRadialGradient(W * 0.7, H * 0.4, 0, W * 0.7, H * 0.4, W * 0.5);
        grd.addColorStop(0, 'rgba(37,211,102,0.06)');
        grd.addColorStop(0.4, 'rgba(0,209,255,0.04)');
        grd.addColorStop(1, 'rgba(10,10,11,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // Grid
        ctx.strokeStyle = 'rgba(255,255,255,0.02)';
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 70) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = 0; y < H; y += 70) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

        // Particles
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(37,211,102,${p.alpha})`;
            ctx.fill();

            particles.forEach(p2 => {
                const dx = p.x - p2.x, dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 90) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(37,211,102,${0.05 * (1 - dist / 90)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
})();

// ── CTA Section mini canvas ───────────────────
(function initCtaCanvas() {
    const canvas = document.getElementById('cta-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        const grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6);
        grd.addColorStop(0, `rgba(112,0,255,${0.12 + Math.sin(t * 0.02) * 0.04})`);
        grd.addColorStop(0.5, `rgba(0,209,255,${0.05 + Math.sin(t * 0.015) * 0.02})`);
        grd.addColorStop(1, 'rgba(10,10,11,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
        t++;
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
})();

// ── FAQ Accordion ─────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const isOpen = btn.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-q').forEach(b => {
            b.classList.remove('open');
            const a = b.nextElementSibling;
            if (a) a.classList.remove('open');
        });
        // Open clicked if it wasn't open
        if (!isOpen) {
            btn.classList.add('open');
            const ans = btn.nextElementSibling;
            if (ans) ans.classList.add('open');
        }
    });
});

// Open first FAQ by default
const firstFaq = document.querySelector('.faq-q');
if (firstFaq) {
    firstFaq.classList.add('open');
    const firstAns = firstFaq.nextElementSibling;
    if (firstAns) firstAns.classList.add('open');
}

// ── Form Submit ───────────────────────────────
const lpForm = document.getElementById('lp-form');
const lpToast = document.getElementById('lp-toast');

function showToast(msg, duration = 3500) {
    if (!lpToast) return;
    lpToast.textContent = msg;
    lpToast.classList.add('show');
    setTimeout(() => lpToast.classList.remove('show'), duration);
}

if (lpForm) {
    lpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('lp-nombre').value.trim();
        const whatsapp = document.getElementById('lp-whatsapp').value.trim();

        if (!nombre || !whatsapp) {
            showToast('⚠️ Por favor ingresa tu nombre y WhatsApp.');
            return;
        }

        const submitBtn = document.getElementById('lp-submit-btn');
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Enviando...';

        // Generate WhatsApp pre-filled message and redirect
        setTimeout(() => {
            const rubro = document.getElementById('lp-rubro').value || 'mi negocio';
            const msg = encodeURIComponent(
                `Hola! Soy ${nombre} y tengo un negocio de tipo "${rubro}". Quiero información sobre cómo escalar mis ventas con Conversia.`
            );
            showToast('✅ ¡Listo! Te redirigimos a WhatsApp...');
            setTimeout(() => {
                window.open(`https://wa.me/5491100000000?text=${msg}`, '_blank');
            }, 800);
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Quiero ser contactado por WhatsApp';
            lpForm.reset();
        }, 1000);
    });
}

// ── WhatsApp float btn: show after 3s ────────
const waFloat = document.getElementById('wa-float-btn');
if (waFloat) {
    waFloat.style.opacity = '0';
    waFloat.style.transform = 'scale(0.7)';
    waFloat.style.transition = 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    setTimeout(() => {
        waFloat.style.opacity = '1';
        waFloat.style.transform = 'scale(1)';
    }, 3000);
}

// ── Track WA button clicks (console log placeholder) ─
document.querySelectorAll('.btn-whatsapp, .wa-float').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('[Conversia] WA click →', btn.id || 'float');
        // Replace with: gtag('event', 'whatsapp_click', { button_id: btn.id });
    });
});

// ── Prevent Orphan Words ──────────────────────────
function preventOrphans() {
    const selectors = 'p, h1, h2, h3, h4, h5, h6, .lp-title, .lp-section-title, .lp-sub';
    document.querySelectorAll(selectors).forEach(el => {
        if (el.children.length > 0) return;
        let text = el.innerText.trim();
        if (text.includes(' ')) {
            const words = text.split(' ');
            if (words.length > 3) {
                const lastWord = words.pop();
                const secondLastWord = words.pop();
                el.innerHTML = words.join(' ') + ' ' + secondLastWord + '&nbsp;' + lastWord;
            }
        }
    });
}
window.addEventListener('DOMContentLoaded', preventOrphans);
