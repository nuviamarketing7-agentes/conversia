<<<<<<< HEAD
/* ═══════════════════════════════════════════════
   CONVERSIA — JavaScript: Animations & Logic
   ═══════════════════════════════════════════════ */

'use strict';

// ── Navbar scroll effect ─────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Burger menu ──────────────────────────────────
const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

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

// ── Reveal on scroll ─────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Staggered delay based on position among siblings
            const siblings = [...entry.target.parentNode.querySelectorAll('.reveal')];
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Hero animated canvas (particle pulse) ────────
(function initHeroCanvas() {
    const canvas = document.getElementById('pulse-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animFrame;

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
        buildParticles();
    }

    function buildParticles() {
        particles = [];
        const count = Math.floor(W / 20);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.5 + 0.4,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                alpha: Math.random() * 0.5 + 0.1,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Radial gradient glow center
        const cx = W * 0.55, cy = H * 0.45;
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.45);
        grd.addColorStop(0, 'rgba(112,0,255,0.10)');
        grd.addColorStop(0.5, 'rgba(0,209,255,0.05)');
        grd.addColorStop(1, 'rgba(10,10,11,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.025)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < W; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Particles + connections
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,209,255,${p.alpha})`;
            ctx.fill();

            particles.forEach(p2 => {
                const dx = p.x - p2.x, dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0,209,255,${0.06 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        animFrame = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
})();

// ── Pulse line canvas (Section El Pulso) ─────────
(function initPulseLine() {
    const canvas = document.getElementById('pulse-line-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let offset = 0;

    function drawPulse() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // Background glow
        const grd = ctx.createLinearGradient(0, 0, W, 0);
        grd.addColorStop(0, 'rgba(112,0,255,0)');
        grd.addColorStop(0.5, 'rgba(0,209,255,0.08)');
        grd.addColorStop(1, 'rgba(112,0,255,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // Pulse path
        ctx.beginPath();
        ctx.moveTo(0, H / 2);

        for (let x = 0; x < W; x++) {
            const normalX = (x + offset) / W;
            // Heartbeat-style: flat with spikes
            let y = H / 2;
            const period = 0.15;
            const phase = normalX % period;
            if (phase < 0.02) { y = H / 2 - (H * 0.35) * Math.sin(phase / 0.02 * Math.PI); }
            else if (phase < 0.04) { y = H / 2 + (H * 0.15) * Math.sin((phase - 0.02) / 0.02 * Math.PI); }
            y += Math.sin(normalX * Math.PI * 6 + offset * 0.05) * 6;
            ctx.lineTo(x, y);
        }

        // Gradient stroke
        const lineGrd = ctx.createLinearGradient(0, 0, W, 0);
        lineGrd.addColorStop(0, 'rgba(112,0,255,0.8)');
        lineGrd.addColorStop(0.5, 'rgba(0,209,255,1)');
        lineGrd.addColorStop(1, 'rgba(112,0,255,0.8)');
        ctx.strokeStyle = lineGrd;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00D1FF';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        offset += 1.5;
        requestAnimationFrame(drawPulse);
    }

    // Resize canvas to container
    function resizePulse() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = Math.min(900, rect.width);
        canvas.height = 160;
    }
    window.addEventListener('resize', resizePulse);
    resizePulse();
    drawPulse();
})();

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
            entry.target.querySelectorAll('[data-target]').forEach(el => {
                animateCounter(el, parseInt(el.dataset.target));
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ── Nicho Tabs ──────────────────────────────────
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
            // Re-trigger reveal animations for newly revealed cards
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

// ── Filtro / Quiz logic ──────────────────────────
let answers = {};

document.querySelectorAll('.q-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const q = btn.dataset.q;
        const val = btn.dataset.val;
        answers[q] = val;

        // Mark selection
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
                result.innerHTML = '🤔 No hay problema. Cuando estés listo para crecer, Conversia va a estar acá. <br/><a href="#contacto" style="color:inherit;text-decoration:underline;margin-top:8px;display:inline-block;">Igual puedes escribirnos →</a>';
            }
        }

        if (q === '2') {
            const result = document.getElementById('filtro-result');
            result.style.display = 'block';
            if (val === 'si') {
                result.className = 'filtro-result positive';
                result.innerHTML = '🚀 ¡Eres el candidato ideal para Conversia! <br/><a href="#contacto" class="btn-primary" style="margin-top:16px;display:inline-flex;">Quiero acceso al sistema →</a>';
            } else {
                result.className = 'filtro-result negative';
                result.innerHTML = '💡 Podemos ayudarte también con la parte operativa. <br/><a href="#contacto" style="color:inherit;text-decoration:underline;margin-top:8px;display:inline-block;">Hablemos igual →</a>';
            }
        }
    });
});

// ── Contact Form submission ───────────────────────
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const negocio = document.getElementById('negocio').value.trim();
    const email = document.getElementById('email').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();

    if (!nombre || !negocio || !email || !whatsapp) {
        showToast('⚠️ Por favor, completa los campos obligatorios.');
        return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
        showToast('⚠️ Ingresa un email válido.');
        return;
    }

    const submitBtn = document.getElementById('form-submit-btn');
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Enviando...';

    // Send email using Formsubmit API
    fetch("https://formsubmit.co/ajax/contacto@agenciaconversia.com", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: "Nuevo Contacto - Sitio Web Conversia",
            Nombre: nombre,
            Negocio: negocio,
            Email: email,
            WhatsApp: whatsapp,
            Rubro: document.getElementById('rubro').value || 'No especificado',
            Mensaje: document.getElementById('mensaje').value || 'Sin mensaje'
        })
    })
        .then(response => response.json())
        .then(data => {
            showToast('✅ ¡Gracias! Te contactamos en las próximas 24hs.');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Quiero acceso al sistema';
        })
        .catch(error => {
            showToast('❌ Hubo un error al enviar. Por favor intenta de nuevo.');
            console.error(error);
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Quiero acceso al sistema';
        });
});

// ── Smooth active nav link highlight ─────────────
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinksAll.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// ── Prevent Orphan Words ──────────────────────────
function preventOrphans() {
    const selectors = 'p, h1, h2, h3, h4, h5, h6, .section-sub, .hero-sub, .bento-card p, .nicho-card p';
    document.querySelectorAll(selectors).forEach(el => {
        if (el.children.length > 0) return; // Skip if has complex children to avoid breaking tags
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
// Run once on load
window.addEventListener('DOMContentLoaded', preventOrphans);
// Run again if tabs change content
nichoTabs.forEach(tab => tab.addEventListener('click', () => setTimeout(preventOrphans, 100)));
=======
/* ═══════════════════════════════════════════════
   CONVERSIA — JavaScript: Animations & Logic
   ═══════════════════════════════════════════════ */

'use strict';

// ── Navbar scroll effect ─────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Burger menu ──────────────────────────────────
const burgerBtn = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

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

// ── Reveal on scroll ─────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Staggered delay based on position among siblings
            const siblings = [...entry.target.parentNode.querySelectorAll('.reveal')];
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Hero animated canvas (particle pulse) ────────
(function initHeroCanvas() {
    const canvas = document.getElementById('pulse-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animFrame;

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
        buildParticles();
    }

    function buildParticles() {
        particles = [];
        const count = Math.floor(W / 20);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.5 + 0.4,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                alpha: Math.random() * 0.5 + 0.1,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Radial gradient glow center
        const cx = W * 0.55, cy = H * 0.45;
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.45);
        grd.addColorStop(0, 'rgba(112,0,255,0.10)');
        grd.addColorStop(0.5, 'rgba(0,209,255,0.05)');
        grd.addColorStop(1, 'rgba(10,10,11,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.025)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < W; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Particles + connections
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,209,255,${p.alpha})`;
            ctx.fill();

            particles.forEach(p2 => {
                const dx = p.x - p2.x, dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0,209,255,${0.06 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        animFrame = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
})();

// ── Pulse line canvas (Section El Pulso) ─────────
(function initPulseLine() {
    const canvas = document.getElementById('pulse-line-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let offset = 0;

    function drawPulse() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // Background glow
        const grd = ctx.createLinearGradient(0, 0, W, 0);
        grd.addColorStop(0, 'rgba(112,0,255,0)');
        grd.addColorStop(0.5, 'rgba(0,209,255,0.08)');
        grd.addColorStop(1, 'rgba(112,0,255,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // Pulse path
        ctx.beginPath();
        ctx.moveTo(0, H / 2);

        for (let x = 0; x < W; x++) {
            const normalX = (x + offset) / W;
            // Heartbeat-style: flat with spikes
            let y = H / 2;
            const period = 0.15;
            const phase = normalX % period;
            if (phase < 0.02) { y = H / 2 - (H * 0.35) * Math.sin(phase / 0.02 * Math.PI); }
            else if (phase < 0.04) { y = H / 2 + (H * 0.15) * Math.sin((phase - 0.02) / 0.02 * Math.PI); }
            y += Math.sin(normalX * Math.PI * 6 + offset * 0.05) * 6;
            ctx.lineTo(x, y);
        }

        // Gradient stroke
        const lineGrd = ctx.createLinearGradient(0, 0, W, 0);
        lineGrd.addColorStop(0, 'rgba(112,0,255,0.8)');
        lineGrd.addColorStop(0.5, 'rgba(0,209,255,1)');
        lineGrd.addColorStop(1, 'rgba(112,0,255,0.8)');
        ctx.strokeStyle = lineGrd;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00D1FF';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        offset += 1.5;
        requestAnimationFrame(drawPulse);
    }

    // Resize canvas to container
    function resizePulse() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = Math.min(900, rect.width);
        canvas.height = 160;
    }
    window.addEventListener('resize', resizePulse);
    resizePulse();
    drawPulse();
})();

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
            entry.target.querySelectorAll('[data-target]').forEach(el => {
                animateCounter(el, parseInt(el.dataset.target));
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ── Nicho Tabs ──────────────────────────────────
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
            // Re-trigger reveal animations for newly revealed cards
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

// ── Filtro / Quiz logic ──────────────────────────
let answers = {};

document.querySelectorAll('.q-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const q = btn.dataset.q;
        const val = btn.dataset.val;
        answers[q] = val;

        // Mark selection
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
                result.innerHTML = '🤔 No hay problema. Cuando estés listo para crecer, Conversia va a estar acá. <br/><a href="#contacto" style="color:inherit;text-decoration:underline;margin-top:8px;display:inline-block;">Igual puedes escribirnos →</a>';
            }
        }

        if (q === '2') {
            const result = document.getElementById('filtro-result');
            result.style.display = 'block';
            if (val === 'si') {
                result.className = 'filtro-result positive';
                result.innerHTML = '🚀 ¡Eres el candidato ideal para Conversia! <br/><a href="#contacto" class="btn-primary" style="margin-top:16px;display:inline-flex;">Quiero acceso al sistema →</a>';
            } else {
                result.className = 'filtro-result negative';
                result.innerHTML = '💡 Podemos ayudarte también con la parte operativa. <br/><a href="#contacto" style="color:inherit;text-decoration:underline;margin-top:8px;display:inline-block;">Hablemos igual →</a>';
            }
        }
    });
});

// ── Contact Form submission ───────────────────────
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const negocio = document.getElementById('negocio').value.trim();
    const email = document.getElementById('email').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();

    if (!nombre || !negocio || !email || !whatsapp) {
        showToast('⚠️ Por favor, completa los campos obligatorios.');
        return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
        showToast('⚠️ Ingresa un email válido.');
        return;
    }

    const submitBtn = document.getElementById('form-submit-btn');
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Enviando...';

    // Send email using Formsubmit API
    fetch("https://formsubmit.co/ajax/contacto@agenciaconversia.com", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: "Nuevo Contacto - Sitio Web Conversia",
            Nombre: nombre,
            Negocio: negocio,
            Email: email,
            WhatsApp: whatsapp,
            Rubro: document.getElementById('rubro').value || 'No especificado',
            Mensaje: document.getElementById('mensaje').value || 'Sin mensaje'
        })
    })
        .then(response => response.json())
        .then(data => {
            showToast('✅ ¡Gracias! Te contactamos en las próximas 24hs.');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Quiero acceso al sistema';
        })
        .catch(error => {
            showToast('❌ Hubo un error al enviar. Por favor intenta de nuevo.');
            console.error(error);
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Quiero acceso al sistema';
        });
});

// ── Smooth active nav link highlight ─────────────
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinksAll.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// ── Prevent Orphan Words ──────────────────────────
function preventOrphans() {
    const selectors = 'p, h1, h2, h3, h4, h5, h6, .section-sub, .hero-sub, .bento-card p, .nicho-card p';
    document.querySelectorAll(selectors).forEach(el => {
        if (el.children.length > 0) return; // Skip if has complex children to avoid breaking tags
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
// Run once on load
window.addEventListener('DOMContentLoaded', preventOrphans);
// Run again if tabs change content
nichoTabs.forEach(tab => tab.addEventListener('click', () => setTimeout(preventOrphans, 100)));
>>>>>>> 8a61e027b1e2b4c1ecfec7e07abd2b457f4e3edb
