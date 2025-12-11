// Attende che il DOM sia pronto
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER & INTRO ---
    setTimeout(() => {
        document.body.classList.add('loaded');
        document.querySelector('.loader-progress').style.width = '100%';
    }, 1500);

    // --- 2. CUSTOM CURSOR & MAGNETIC EFFECT ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const magneticElements = document.querySelectorAll('.magnetic');
    
    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Cursore base (immediato)
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Loop animazione per il follower (effetto ritardo/inerzia)
    function animateCursor() {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;
        follower.style.transform = `translate3d(${posX - 20}px, ${posY - 20}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Effetto Magnetico sui bottoni
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const strength = el.getAttribute('data-strength') || 50;
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - (rect.left + rect.width / 2)) / strength;
            const y = (e.clientY - (rect.top + rect.height / 2)) / strength;
            
            el.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
            follower.classList.add('active');
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
            follower.classList.remove('active');
        });
    });

    // --- 3. EMBER PARTICLE SYSTEM (CANVAS) ---
    // Genera scintille fluttuanti come se ci fosse una brace sotto lo schermo
    const canvas = document.getElementById('ember-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100; // Nasce sotto lo schermo
            this.speed = Math.random() * 1 + 0.5;
            this.size = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fade = Math.random() * 0.003 + 0.001;
            this.wobble = Math.random() * Math.PI * 2;
        }
        update() {
            this.y -= this.speed;
            this.wobble += 0.05;
            this.x += Math.sin(this.wobble) * 0.5; // Movimento ondulatorio
            this.opacity -= this.fade;

            if (this.y < 0 || this.opacity <= 0) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(255, 69, 0, ${this.opacity})`; // Arancione fuoco
            ctx.shadowBlur = 10;
            ctx.shadowColor = "orangered";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Crea 60 particelle
    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // --- 4. SMOOTH SCROLL SIMULATO (LERP) ---
    // Simula l'effetto "Lenis" o "Locomotive Scroll"
    const scrollContainer = document.getElementById('scroll-container');
    const body = document.body;
    
    // Altezza reale del container
    let containerHeight = scrollContainer.getBoundingClientRect().height;
    body.style.height = `${containerHeight}px`; // Assegna altezza al body per permettere scroll

    let currentScroll = 0;
    let targetScroll = 0;

    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
    });

    // Resize observer per aggiornare altezza se la pagina cambia
    new ResizeObserver(() => {
        containerHeight = scrollContainer.getBoundingClientRect().height;
        body.style.height = `${containerHeight}px`;
    }).observe(scrollContainer);

    function smoothScroll() {
        // Interpolazione Lineare (LERP): sposta current verso target del 7.5% ogni frame
        currentScroll += (targetScroll - currentScroll) * 0.075; 
        
        // Applica trasformazione
        scrollContainer.style.transform = `translateY(-${currentScroll}px)`;
        
        // Parallax Effect sulle immagini (sposta l'immagine più lentamente del container)
        const parallaxImgs = document.querySelectorAll('.parallax-img');
        parallaxImgs.forEach(img => {
            // Calcola se l'immagine è in viewport
            const rect = img.parentElement.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.15;
                img.style.transform = `translateY(${(currentScroll - img.parentElement.offsetTop) * speed}px)`;
            }
        });

        requestAnimationFrame(smoothScroll);
    }
    smoothScroll();
});