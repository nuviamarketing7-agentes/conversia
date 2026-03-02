'use strict';

// ── Top bar close ─────────────────────────────
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

// ── Sticky nav scroll effect ─────────────────
const navEl = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Burger menu logic ─────────────────────────
const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });
}

// ── Reveal on scroll (.reveal elements) ──────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const siblings = [...entry.target.parentNode.querySelectorAll('.reveal')];
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Counter animation ─────────────────────────────
function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    };
    requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(el => {
                const targetVal = el.getAttribute('data-target');
                if (targetVal) {
                    animateCounter(el, parseInt(targetVal));
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

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

        // Particles + connections
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

// ── Nicho Tabs ───────────────────────────────
const nichoTabs = document.querySelectorAll('.nicho-tab');
const nichoPanels = document.querySelectorAll('.nicho-panel');

nichoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        nichoTabs.forEach(t => t.classList.remove('active'));
        nichoPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(`panel-${target}`);
        if (panel) {
            panel.classList.add('active');
            panel.querySelectorAll('.reveal').forEach((el, i) => {
                el.classList.remove('visible');
                el.style.transitionDelay = `${i * 60}ms`;
                setTimeout(() => el.classList.add('visible'), 50);
            });
        }
    });
});

// Initial state: trigger visible for active panel cards
document.querySelectorAll('#panel-locales .reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
    setTimeout(() => el.classList.add('visible'), 300);
});

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

// ── Filtro / Quiz logic ──────────────────────
let answers = {};
document.querySelectorAll('.q-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const q = btn.dataset.q;
        const val = btn.dataset.val;
        answers[q] = val;

        document.querySelectorAll(`[data-q="${q}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        if (q === '1') {
            const q2 = document.getElementById('q2-block');
            if (val === 'si') {
                setTimeout(() => { q2.style.display = 'block'; }, 200);
            } else {
                const result = document.getElementById('filtro-result');
                q2.style.display = 'none';
                result.style.display = 'block';
                result.className = 'filtro-result negative';
                result.innerHTML = '🤔 No hay problema. Cuando estés listo para crecer, Conversia va a estar acá. <br/><a href="#lead-form" style="color:inherit;text-decoration:underline;margin-top:8px;display:inline-block;">Igual puedes dejarnos tus datos →</a>';
            }
        }

        if (q === '2') {
            const result = document.getElementById('filtro-result');
            result.style.display = 'block';
            if (val === 'si') {
                result.className = 'filtro-result positive';
                result.innerHTML = '🚀 ¡Eres el candidato ideal para Conversia! <br/><a href="#lead-form" class="btn-primary" style="margin-top:16px;display:inline-flex;">Quiero acceso al sistema →</a>';
            } else {
                result.className = 'filtro-result negative';
                result.innerHTML = '💡 Podemos ayudarte también con la parte operativa. <br/><a href="#lead-form" style="color:inherit;text-decoration:underline;margin-top:8px;display:inline-block;">Hablemos igual →</a>';
            }
        }
    });
});

// ── Hero form (lp-form) submit → email + WhatsApp redirect ──
const lpForm = document.getElementById('lp-form');
const toast = document.getElementById('toast');

function showToast(msg, duration = 3500) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
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

        const rubro = document.getElementById('lp-rubro').value || 'mi negocio';

        // Send lead silently by email
        fetch("https://formsubmit.co/ajax/contacto@agenciaconversia.com", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: "Nuevo Lead - Landing Conversia",
                Origen: "Landing Page - Hero Form",
                Nombre: nombre,
                WhatsApp: whatsapp,
                Rubro: rubro
            })
        })
            .finally(() => {
                // Redirect to WhatsApp with pre-filled message
                const msg = encodeURIComponent(
                    `Hola! Soy ${nombre} y tengo un negocio de tipo "${rubro}". Quiero información sobre cómo escalar mis ventas con Conversia.`
                );
                showToast('✅ ¡Listo! Te redirigimos a WhatsApp...');
                setTimeout(() => {
                    window.open(`https://wa.me/59893731212?text=${msg}`, '_blank');
                }, 800);

                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Quiero ser contactado por WhatsApp';
                lpForm.reset();
            });
    });
}

// ── Track WA button clicks ───────────────────
document.querySelectorAll('.btn-whatsapp, .wa-float').forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('[Conversia] WA click →', btn.id || 'float');
    });
});

// ── Prevent Orphan Words ──────────────────────
function preventOrphans() {
    const selectors = 'p, h1, h2, h3, h4, h5, h6, .section-sub, .lp-sub, .lp-title, .bento-card p, .nicho-card p';
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
nichoTabs.forEach(tab => tab.addEventListener('click', () => setTimeout(preventOrphans, 100)));
