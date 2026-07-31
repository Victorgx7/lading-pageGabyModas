/* ============================================
   Gaby Modas & Acessórios - script.js
   (com suporte a resize / orientação)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. CONFIGURAÇÕES GERAIS
       (troque pelos dados reais da loja)
    ========================================== */
    const CONFIG = {
        whatsappNumero: '5519993519300', // DDI + DDD + número, sem espaços ou símbolos
        whatsappMensagemPadrao: 'Olá! Vim pelo site e gostaria de fazer um pedido ou tirar uma dúvida.', // mensagem padrão
        instagramLink: 'https://www.instagram.com/gabymodaseacessorios2025?utm_source=qr'
    };

    /* ==========================================
       2. MONTAR LINKS DO WHATSAPP E INSTAGRAM
    ========================================== */
    function montarLinkWhatsapp(mensagem) {
        const texto = encodeURIComponent(mensagem || CONFIG.whatsappMensagemPadrao);
        return `https://wa.me/${CONFIG.whatsappNumero}?text=${texto}`;
    }

    function montarLinkInstagram() {
        return CONFIG.instagramLink;
    }

    document.querySelectorAll('.btn-primary, .floating-whatsapp').forEach(link => {
        link.setAttribute('href', montarLinkWhatsapp());
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    document.querySelectorAll('.btn-secondary, a[href="#"] i.fa-instagram').forEach(el => {
        const link = el.tagName === 'A' ? el : el.closest('a');
        if (link) {
            link.setAttribute('href', montarLinkInstagram());
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    /* ==========================================
       3. UTIL: DEBOUNCE
       (evita rodar funções pesadas a cada pixel de resize)
    ========================================== */
    function debounce(fn, delay = 150) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }

    /* ==========================================
       4. DETECÇÃO DINÂMICA DE TOQUE
       (reavalia sempre que o layout muda — cobre notebooks
       com tela touch, tablets que ganham mouse via dock, etc.)
    ========================================== */
    const mqTouch = window.matchMedia('(hover: none) and (pointer: coarse)');
    let ehTouch = mqTouch.matches;

    function atualizarModoToque() {
        ehTouch = mqTouch.matches;
        cursorGlowAtivo = !ehTouch;

        if (cursorGlow) {
            cursorGlow.style.display = ehTouch ? 'none' : 'block';
        }
    }

    if (mqTouch.addEventListener) {
        mqTouch.addEventListener('change', atualizarModoToque);
    } else if (mqTouch.addListener) {
        // fallback para navegadores mais antigos
        mqTouch.addListener(atualizarModoToque);
    }

    /* ==========================================
       5. CURSOR GLOW (segue o mouse)
    ========================================== */
    const cursorGlow = document.querySelector('.cursor-glow');
    let cursorGlowAtivo = !ehTouch;

    if (cursorGlow) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateGlow() {
            if (cursorGlowAtivo) {
                glowX += (mouseX - glowX) * 0.15;
                glowY += (mouseY - glowY) * 0.15;

                cursorGlow.style.left = `${glowX}px`;
                cursorGlow.style.top = `${glowY}px`;
            }
            requestAnimationFrame(animateGlow);
        }

        animateGlow();
        atualizarModoToque(); // aplica o estado inicial corretamente
    }

    /* ==========================================
       6. SCROLL REVEAL (hidden -> show)
    ========================================== */
    const elementosParaRevelar = document.querySelectorAll(
        '.card, .step, .product-card, .section-title, .cta h2, .cta p, .cta .btn, .hero .logo, .hero .badge, .hero h1, .hero p, .hero-buttons'
    );

    elementosParaRevelar.forEach(el => el.classList.add('hidden'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    elementosParaRevelar.forEach(el => observer.observe(el));

    /* ==========================================
       7. SETA "SCROLL DOWN" NO HERO
    ========================================== */
    const scrollDown = document.querySelector('.scroll-down');

    if (scrollDown) {
        scrollDown.style.cursor = 'pointer';
        scrollDown.addEventListener('click', () => {
            const proximaSecao = document.querySelector('.benefits');
            if (proximaSecao) {
                proximaSecao.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* ==========================================
       8. TILT 3D NOS CARDS (somente com mouse, nunca no touch)
    ========================================== */
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (ehTouch) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ==========================================
       9. BOTÃO FLUTUANTE DO WHATSAPP (aparece ao rolar)
    ========================================== */
    const floatingWhats = document.querySelector('.floating-whatsapp');

    if (floatingWhats) {
        floatingWhats.style.opacity = '0';
        floatingWhats.style.transform = 'scale(0.7)';
        floatingWhats.style.transition = 'opacity .3s ease, transform .3s ease';
        floatingWhats.style.pointerEvents = 'none';

        function checarScrollWhats() {
            if (window.scrollY > 300) {
                floatingWhats.style.opacity = '1';
                floatingWhats.style.transform = 'scale(1)';
                floatingWhats.style.pointerEvents = 'auto';
            } else {
                floatingWhats.style.opacity = '0';
                floatingWhats.style.transform = 'scale(0.7)';
                floatingWhats.style.pointerEvents = 'none';
            }
        }

        window.addEventListener('scroll', checarScrollWhats);
        checarScrollWhats(); // garante estado correto se a página já carregar rolada
    }

    /* ==========================================
       10. AJUSTE DE ALTURA REAL DA VIEWPORT EM MOBILE
       (corrige o bug clássico da barra do navegador
       mobile mudando de tamanho ao rolar/rotacionar)
    ========================================== */
    function ajustarAlturaViewport() {
        // 1% da altura real da viewport
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    ajustarAlturaViewport();

    /* ==========================================
       11. REAÇÃO A RESIZE E MUDANÇA DE ORIENTAÇÃO
    ========================================== */
    const aoRedimensionar = debounce(() => {
        ajustarAlturaViewport();
        atualizarModoToque();

        // recalcula quais elementos já deveriam estar visíveis
        // (evita cards "sumidos" se o usuário rotacionar o aparelho
        // antes do IntersectionObserver disparar)
        elementosParaRevelar.forEach(el => {
            if (!el.classList.contains('show')) {
                const rect = el.getBoundingClientRect();
                const visivel = rect.top < window.innerHeight && rect.bottom > 0;
                if (visivel) el.classList.add('show');
            }
        });
    }, 200);

    window.addEventListener('resize', aoRedimensionar);
    window.addEventListener('orientationchange', aoRedimensionar);

    /* ==========================================
       12. ANO DINÂMICO NO RODAPÉ
    ========================================== */
    const footerSmall = document.querySelector('footer small');
    if (footerSmall) {
        const anoAtual = new Date().getFullYear();
        footerSmall.innerHTML = footerSmall.innerHTML.replace(/\d{4}/, anoAtual);
    }

});
