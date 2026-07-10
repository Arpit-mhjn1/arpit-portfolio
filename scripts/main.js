// Initialize Lucide Icons
lucide.createIcons();

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .icon-btn, .iso-key');

let lastX = 0;
let lastY = 0;
let wobbleTimer;

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Calculate velocity for wobble effect
    const velX = posX - lastX;
    const velY = posY - lastY;
    lastX = posX;
    lastY = posY;
    
    // Calculate speed and angle
    const speed = Math.sqrt(velX * velX + velY * velY);
    const angle = Math.atan2(velY, velX) * 180 / Math.PI;
    
    // Squash and stretch like a propelling jellyfish bell
    const scaleX = 1 + Math.min(speed * 0.008, 0.65);
    const scaleY = Math.max(0.35, 1 - Math.min(speed * 0.008, 0.5));

    // Dot follows exactly
    if (cursorDot) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
    }

    // Outline follows with floaty water resistance
    if (cursorOutline) {
        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            rotation: angle,
            scaleX: scaleX,
            scaleY: scaleY,
            duration: 0.95,
            ease: 'power3.out',
            transformOrigin: 'center center'
        });
        
        // Rebound and pulse like a jellyfish settling in water
        clearTimeout(wobbleTimer);
        wobbleTimer = setTimeout(() => {
            const isHovered = cursorOutline.classList.contains('cursor-hover');
            gsap.to(cursorOutline, {
                scaleX: isHovered ? 1.4 : 1,
                scaleY: isHovered ? 1.4 : 1,
                duration: 1.5,
                ease: 'elastic.out(1, 0.18)'
            });
        }, 90);
    }
});

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if(cursorOutline) {
            cursorOutline.classList.add('cursor-hover');
            // Simply scale up the capsule and intensify glow without destroying its iconic shape
            gsap.to(cursorOutline, { 
                scaleX: 1.4, 
                scaleY: 1.4, 
                boxShadow: '0 0 25px rgba(255, 255, 255, 0.9)',
                duration: 0.4, 
                ease: 'elastic.out(1, 0.5)' 
            });
        }
    });
    el.addEventListener('mouseleave', () => {
        if(cursorOutline) {
            cursorOutline.classList.remove('cursor-hover');
            // Revert scale and glow
            gsap.to(cursorOutline, { 
                scaleX: 1, 
                scaleY: 1, 
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.6)',
                duration: 0.3, 
                ease: 'power3.out' 
            });
        }
    });
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// Check local storage for theme
if (localStorage.getItem('theme') === 'light') {
    htmlEl.classList.remove('dark');
    if (sunIcon) sunIcon.classList.add('hidden');
    if (moonIcon) moonIcon.classList.remove('hidden');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        htmlEl.classList.toggle('dark');
        
        if (htmlEl.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            localStorage.setItem('theme', 'light');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    });
}

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Initial Load Animations
const tl = gsap.timeline();

tl.from('.navbar', {
    y: -80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
})
.fromTo('.reveal-text', 
    { y: 50, opacity: 0, autoAlpha: 0 },
    { y: 0, opacity: 1, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
    '-=0.5'
);

// Scroll Animations for Projects
gsap.utils.toArray('.reveal-card').forEach((card, i) => {
    gsap.fromTo(card, 
        { y: 100, opacity: 0, autoAlpha: 0 },
        {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 0,
            opacity: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: (i % 3) * 0.1 // Stagger effect based on index
        }
    );
});

// Section Title Reveals
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.fromTo(title,
        { y: 50, opacity: 0, autoAlpha: 0 },
        {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
            },
            y: 0,
            opacity: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out'
        }
    );
});

// Realistic Cosmic Canvas Background with Sun, Moon, Planets & Stars
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    window.addEventListener('resize', resizeCanvas);

    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.2;
            this.speedX = Math.random() * 0.08 - 0.04;
            this.speedY = Math.random() * 0.08 - 0.04;
            this.alpha = Math.random();
            this.alphaChange = (Math.random() * 0.02) - 0.01;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            this.alpha += this.alphaChange;
            if (this.alpha <= 0.1 || this.alpha >= 1) {
                this.alphaChange = -this.alphaChange;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.shadowBlur = this.size * 5;
            ctx.shadowColor = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function initParticles() {
        particles = [];
        const numParticles = Math.floor((canvas.width * canvas.height) / 2800);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Star());
        }
    }

    // Realistic Sun
    function drawSun(x, y, r, time) {
        ctx.save();
        const pulse = Math.sin(time * 0.0015) * 0.08 + 1;
        
        // Outer Corona Aura
        const outerGrad = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 4 * pulse);
        outerGrad.addColorStop(0, 'rgba(251, 191, 36, 0.38)');
        outerGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.12)');
        outerGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.arc(x, y, r * 4 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Sun Body 3D Gradient
        const sunGrad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r);
        sunGrad.addColorStop(0, '#ffffff');
        sunGrad.addColorStop(0.3, '#fef08a');
        sunGrad.addColorStop(0.7, '#f59e0b');
        sunGrad.addColorStop(1, '#c2410c');
        ctx.fillStyle = sunGrad;
        ctx.shadowBlur = 45;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.85)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Generic 3D Sphere Shading for Planets
    function drawPlanetSphere(x, y, r, colors) {
        ctx.save();
        const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(0.5, colors[1]);
        grad.addColorStop(1, colors[2]);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Saturn with Rings
    function drawSaturnSystem(x, y, r) {
        ctx.save();
        const angle = -0.35;
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Back rings
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 2.3, r * 0.6, 0, Math.PI, Math.PI * 2);
        ctx.lineWidth = r * 0.3;
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.stroke();

        // Planet Body
        const satGrad = ctx.createLinearGradient(0, -r, 0, r);
        satGrad.addColorStop(0, '#d97706');
        satGrad.addColorStop(0.4, '#fde047');
        satGrad.addColorStop(0.7, '#b45309');
        satGrad.addColorStop(1, '#78350f');
        ctx.fillStyle = satGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        // Front rings
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 2.3, r * 0.6, 0, 0, Math.PI);
        ctx.lineWidth = r * 0.3;
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)';
        ctx.stroke();
        ctx.restore();
    }

    resizeCanvas();

    function animateCosmos() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const time = Date.now();

        // 1. Draw Twinkling Starfield
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // 2. Solar System Orrery Configuration
        const sunX = canvas.width * 0.82;
        const sunY = canvas.height * 0.22;
        const baseR = Math.min(canvas.width, canvas.height);
        const sunRadius = baseR * 0.055;

        // Solar System Planet Definitions (Radius from Sun, Orbital Speed, Size, Colors)
        const planets = [
            { name: 'Mercury', orbitR: baseR * 0.12, speed: 0.0006, size: baseR * 0.007, colors: ['#e2e8f0', '#94a3b8', '#475569'] },
            { name: 'Venus',   orbitR: baseR * 0.19, speed: 0.00045, size: baseR * 0.012, colors: ['#fef08a', '#facc15', '#a16207'] },
            { name: 'Earth',   orbitR: baseR * 0.28, speed: 0.00035, size: baseR * 0.015, colors: ['#7dd3fc', '#0284c7', '#1e3a8a'], hasMoon: true },
            { name: 'Mars',    orbitR: baseR * 0.37, speed: 0.00028, size: baseR * 0.010, colors: ['#fca5a5', '#ef4444', '#7f1d1d'] },
            { name: 'Jupiter', orbitR: baseR * 0.49, speed: 0.0002,  size: baseR * 0.028, colors: ['#fed7aa', '#f97316', '#9a3412'] },
            { name: 'Saturn',  orbitR: baseR * 0.64, speed: 0.00015, size: baseR * 0.023, isSaturn: true },
            { name: 'Uranus',  orbitR: baseR * 0.78, speed: 0.00011, size: baseR * 0.017, colors: ['#a5f3fc', '#06b6d4', '#155e75'] },
            { name: 'Neptune', orbitR: baseR * 0.92, speed: 0.00008, size: baseR * 0.016, colors: ['#93c5fd', '#3b82f6', '#1e3a8a'] }
        ];

        // Draw Orbital Ellipse Rings
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;
        planets.forEach(p => {
            ctx.beginPath();
            ctx.arc(sunX, sunY, p.orbitR, 0, Math.PI * 2);
            ctx.stroke();
        });
        ctx.restore();

        // Draw Sun at the Center of Orbits
        drawSun(sunX, sunY, sunRadius, time);

        // Draw Orbiting Planets
        planets.forEach((p, idx) => {
            const angle = time * p.speed + idx * 1.1; // Stagger initial angles
            const px = sunX + Math.cos(angle) * p.orbitR;
            const py = sunY + Math.sin(angle) * p.orbitR;

            if (p.isSaturn) {
                drawSaturnSystem(px, py, p.size);
            } else {
                drawPlanetSphere(px, py, p.size, p.colors);
            }

            // Draw Earth's Moon
            if (p.hasMoon) {
                const moonAngle = time * 0.0025;
                const moonDist = p.size * 2.2;
                const mx = px + Math.cos(moonAngle) * moonDist;
                const my = py + Math.sin(moonAngle) * moonDist;
                drawPlanetSphere(mx, my, p.size * 0.3, ['#ffffff', '#cbd5e1', '#475569']);
            }
        });

        requestAnimationFrame(animateCosmos);
    }

    animateCosmos();

// Keyboard Skills Mapping
const skillMap = {
    '1': 'Docker', '2': 'Postman', '3': 'React.js', '4': 'MongoDB', '5': 'Linux', '6': 'Apache Pig',
    'q': 'C/C++', 'w': 'Python', 'e': 'Java', 'r': 'PHP', 't': 'JavaScript', 'y': 'HTML',
    'a': 'CSS', 's': 'Spring Boot', 'd': 'PostgreSQL', 'f': 'Pandas', 'g': 'NumPy', 'h': 'Power BI',
    'z': 'Scikit-learn', 'x': 'GitHub', 'c': 'OOPs', 'v': 'Software Development', 'b': 'AI & Machine Learning', 'n': 'Amazon Web Security'
};

// Musical Notes Mapping (Frequencies in Hz)
let audioCtx;
const noteFrequencies = {
    '1': 261.63, '2': 293.66, '3': 329.63, '4': 349.23, '5': 392.00, '6': 440.00, // C4 to A4 (Warm middle piano notes)
    'q': 493.88, 'w': 523.25, 'e': 587.33, 'r': 659.25, 't': 698.46, 'y': 783.99, // B4 to G5 (Bright singing melody)
    'a': 880.00, 's': 987.77, 'd': 1046.50, 'f': 1174.66, 'g': 1318.51, 'h': 1396.91, // A5 to F6 (Sweet high melody)
    'z': 1567.98, 'x': 1760.00, 'c': 1975.53, 'v': 2093.00, 'b': 2349.32, 'n': 2637.02 // G6 to E7 (Sparkling crystal chimes)
};

function playNote(key) {
    const frequency = noteFrequencies[key];
    if (!frequency) return;
    
    // Initialize AudioContext if it doesn't exist
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Attempt to resume, but browsers require click/touch first
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine'; // Soft tone
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    // Envelope: louder initial attack, slower decay to be clearly audible
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); // Louder
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
}

// Global unlock for AudioContext so hover works
window.addEventListener('click', () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}, { once: true });

const activeSkillDisplay = document.getElementById('active-skill-display');
const isoKeys = document.querySelectorAll('.iso-key');
const keyboardWrapper = document.querySelector('.keyboard-wrapper');
const isoKeyboard = document.querySelector('.isometric-keyboard');

// 360 Degree Drag-to-Rotate Logic
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let currentRotX = 60;
let currentRotZ = -45;

if (keyboardWrapper && isoKeyboard) {
    // Desktop Mouse Events
    keyboardWrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        keyboardWrapper.style.cursor = 'grabbing';
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            currentRotZ += deltaMove.x * 0.5;
            currentRotX -= deltaMove.y * 0.5;
            isoKeyboard.style.transform = `rotateX(${currentRotX}deg) rotateZ(${currentRotZ}deg)`;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        if (keyboardWrapper) keyboardWrapper.style.cursor = 'grab';
    });

    // Mobile Touch Events
    keyboardWrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.touches[0].clientX - previousMousePosition.x,
                y: e.touches[0].clientY - previousMousePosition.y
            };
            // Slightly faster rotation for mobile screens
            currentRotZ += deltaMove.x * 0.8;
            currentRotX -= deltaMove.y * 0.8;
            isoKeyboard.style.transform = `rotateX(${currentRotX}deg) rotateZ(${currentRotZ}deg)`;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

function handleKeyPress(keyStr) {
    const keyEl = document.querySelector(`.iso-key[data-key="${keyStr}"]`);
    if (keyEl && !keyEl.classList.contains('active')) { // Prevent repeating if already held
        keyEl.classList.add('active');
        playNote(keyStr); // Play the musical note
        const skill = skillMap[keyStr];
        if (skill && activeSkillDisplay) {
            activeSkillDisplay.innerText = skill;
            gsap.fromTo(activeSkillDisplay, 
                { scale: 0.8, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        }
    }
}

function handleKeyRelease(keyStr) {
    const keyEl = document.querySelector(`.iso-key[data-key="${keyStr}"]`);
    if (keyEl) {
        keyEl.classList.remove('active');
    }
}

window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    if (skillMap[key]) {
        handleKeyPress(key);
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (skillMap[key]) {
        handleKeyRelease(key);
    }
});

isoKeys.forEach(key => {
    // Touch/Mouse interaction
    key.addEventListener('mouseenter', () => handleKeyPress(key.dataset.key));
    key.addEventListener('mousedown', () => handleKeyPress(key.dataset.key));
    key.addEventListener('mouseup', () => handleKeyRelease(key.dataset.key));
    key.addEventListener('mouseleave', () => handleKeyRelease(key.dataset.key));
});

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            initParticles();
        });
    }
}
