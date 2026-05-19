const canvas = document.querySelector("#particle-canvas");
const ctx = canvas.getContext("2d");

const pointer = {
  x: 0,
  y: 0,
  active: false,
};

const config = {
  density: 13000,
  minParticles: 54,
  maxParticles: 138,
  particleSpeed: 0.26,
  linkDistance: 165,
  pointerDistance: 235,
  colors: [
    { dot: "178, 112, 255", line: "157, 94, 255" },
    { dot: "255, 98, 92", line: "255, 82, 76" },
  ],
};

let particles = [];
let width = 0;
let height = 0;
let pixelRatio = 1;
let animationFrame = 0;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function particleCount() {
  const area = width * height;
  return Math.max(config.minParticles, Math.min(config.maxParticles, Math.round(area / config.density)));
}

function createParticle(x = randomBetween(0, width), y = randomBetween(0, height)) {
  const palette = config.colors[Math.floor(Math.random() * config.colors.length)];
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(config.particleSpeed * 0.35, config.particleSpeed);

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: randomBetween(1.25, 2.35),
    pulse: randomBetween(0, Math.PI * 2),
    palette,
  };
}

function resizeCanvas() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const target = particleCount();
  if (particles.length < target) {
    while (particles.length < target) particles.push(createParticle());
  } else {
    particles = particles.slice(0, target);
  }
}

function drawLine(a, b, distance, maxDistance, pointerLine = false) {
  const closeness = 1 - distance / maxDistance;
  const alpha = pointerLine ? 0.08 + closeness * 0.72 : 0.035 + closeness * 0.26;
  const widthBoost = pointerLine ? 2.4 : 1.15;
  const lineWidth = 0.35 + closeness * widthBoost;
  const color = pointerLine ? a.palette.line : mixLineColor(a, b);

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = `rgba(${color}, ${alpha})`;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function mixLineColor(a, b) {
  return a.palette.line === b.palette.line ? a.palette.line : "136, 93, 145";
}

function updateParticle(particle) {
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.pulse += 0.018;

  if (particle.x < -20) particle.x = width + 20;
  if (particle.x > width + 20) particle.x = -20;
  if (particle.y < -20) particle.y = height + 20;
  if (particle.y > height + 20) particle.y = -20;
}

function drawParticle(particle) {
  const pulse = (Math.sin(particle.pulse) + 1) * 0.28;
  const radius = particle.radius + pulse;

  ctx.beginPath();
  ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${particle.palette.dot}, 0.9)`;
  ctx.shadowBlur = 14;
  ctx.shadowColor = `rgba(${particle.palette.dot}, 0.82)`;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#020305";
  ctx.fillRect(0, 0, width, height);

  for (const particle of particles) updateParticle(particle);

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < config.linkDistance) {
        drawLine(a, b, distance, config.linkDistance);
      }
    }
  }

  if (pointer.active) {
    const pointerPoint = { x: pointer.x, y: pointer.y };

    for (const particle of particles) {
      const distance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);

      if (distance < config.pointerDistance) {
        drawLine(particle, pointerPoint, distance, config.pointerDistance, true);
      }
    }
  }

  for (const particle of particles) drawParticle(particle);

  animationFrame = requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});

window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resizeCanvas();
draw();

window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));
