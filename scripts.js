// ============================================================================
// 2025 SOOP VTuber Fan Trend Analysis - Interactive Scripts
// ============================================================================

// Particles Animation
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;
const mouse = { x: undefined, y: undefined, radius: 200 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
    init();
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseSize = 0.8;
        this.size = this.baseSize;
        this.baseAlpha = 0.08;
        this.alpha = this.baseAlpha;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            let proximity = 1 - (distance / mouse.radius);
            this.size = this.baseSize + (1.5 * proximity);
            this.alpha = this.baseAlpha + (0.6 * proximity);
        } else {
            this.size = this.baseSize;
            this.alpha = this.baseAlpha;
        }
    }
}

function init() {
    particlesArray = [];
    const gap = 45;
    let startX = (canvas.width % gap) / 2;
    let startY = (canvas.height % gap) / 2;
    for (let y = startY; y < canvas.height; y += gap) {
        for (let x = startX; x < canvas.width; x += gap) {
            particlesArray.push(new Particle(x, y));
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let particle of particlesArray) {
        particle.update();
        particle.draw();
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', setCanvasSize);
setCanvasSize();
animate();

// Counter Animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const isFloat = end % 1 !== 0;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        element.textContent = isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString();
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.comparison-card, .chart-card, .streamer-card, .oshi-bar, .solution-card, .insight-card').forEach(el => {
    observer.observe(el);
});

// Hero KPI Counter
const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.kpi-value').forEach(kpi => {
                const target = parseFloat(kpi.getAttribute('data-target'));
                animateValue(kpi, 0, target, 2000);
            });
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    kpiObserver.observe(heroSection);
}

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
});

// Chart Drawing Functions
function drawDonut(canvasId, data, colors) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;

    let currentAngle = -Math.PI / 2;
    const centerX = 100;
    const centerY = 100;
    const radius = 70;
    const innerRadius = 45;

    data.forEach((value, index) => {
        const sliceAngle = (value / 100) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();

        currentAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data[0].toFixed(1) + '%', centerX, centerY);
}

// Initialize charts when visible
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Spending Segment
            drawDonut('spendingSegment', [8.1, 25.1, 66.7], ['#00d4ff', '#0080ff', '#666']);
            
            // Loyalty Segment
            drawDonut('loyaltySegment', [0.2, 7.2, 92.6], ['#4ade80', '#00d4ff', '#666']);
            
            // Multi-Oshi Ratio
            drawDonut('multiOshiRatio', [19.9, 80.1], ['#00d4ff', '#666']);
            
            // One-Time Spending
            drawDonut('oneTimeSpending', [7.8, 21.2, 71.1], ['#00d4ff', '#0080ff', '#666']);
        }
    });
}, { threshold: 0.3 });

// Observe all chart sections
const sections = document.querySelectorAll('#persona-overview, #one-time');
sections.forEach(section => {
    if (section) chartObserver.observe(section);
});

console.log('2025 SOOP VTuber Fan Trend Analysis - Interactive features loaded');
