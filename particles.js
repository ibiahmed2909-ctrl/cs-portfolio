// Particle Background System
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 60; // Reduced for better performance

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.speed = Math.random() * 0.5 + 0.1;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00f0ff' : '#b000ff';
    }

    update() {
        this.y += this.speed;
        
        if (this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Draw connections between nearby particles (optimized)
function drawConnections() {
    const maxDistance = 120;
    
    for (let i = 0; i < particles.length; i++) {
        let connectionsDrawn = 0;
        for (let j = i + 1; j < particles.length && connectionsDrawn < 3; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                ctx.strokeStyle = particles[i].color;
                ctx.globalAlpha = (1 - distance / maxDistance) * 0.15;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                connectionsDrawn++;
            }
        }
    }
    ctx.globalAlpha = 1;
}

// Animation loop with mouse effect
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply mouse interaction effect
    applyMouseEffect();
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    drawConnections();
    
    requestAnimationFrame(animate);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Add mouse interaction (throttled for performance)
let mouse = {
    x: null,
    y: null,
    radius: 150
};

let lastMouseUpdate = 0;
const mouseThrottle = 16; // ~60fps

window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMouseUpdate < mouseThrottle) return;
    lastMouseUpdate = now;
    
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Apply mouse effect in animation loop
function applyMouseEffect() {
    if (mouse.x === null || mouse.y === null) return;
    
    particles.forEach(particle => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = dx / distance;
            const directionY = dy / distance;
            
            particle.x -= directionX * force * 2;
            particle.y -= directionY * force * 2;
        }
    });
}