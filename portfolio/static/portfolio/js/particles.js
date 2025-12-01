(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'background-stars';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1'; // behind everything
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const DPR = window.devicePixelRatio || 1;
  canvas.width = w * DPR;
  canvas.height = h * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  // Make sure body and images are above canvas
  document.body.style.position = document.body.style.position || 'relative';
  document.body.style.zIndex = '0';
  const images = document.querySelectorAll('img, picture, video, .content, .section');
  images.forEach(el => {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.zIndex = '1';
  });

  // Particle settings
  const STAR_COUNT = Math.max(60, Math.round((w*h)/80000));
  const stars = [];

  function randomStar() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 5 + Math.random() * 2,
      speed: 0.8 + Math.random() * 0.3,
      alpha: 0.1 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.1,
      twinkle: Math.random()
    };
  }

  for (let i=0; i<STAR_COUNT; i++) stars.push(randomStar());

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);

  function drawStar(x, y, r, alpha) {
    const spikes = 4;
    const outerRadius = r;
    const innerRadius = r/2;
    let rot = Math.PI/2 * 3;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);
    for (let i=0; i<spikes; i++){
      ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
      rot += step;
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.shadowColor = `rgba(255,255,255,${alpha})`;
    ctx.shadowBlur = 3;
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0,0,w,h);
    for (let s of stars) {
      s.y += s.speed;
      s.x += s.drift;
      s.alpha = 0.2 + 0.1 * Math.sin(performance.now()/1000 + s.twinkle);

      drawStar(s.x, s.y, s.radius, s.alpha);

      if (s.y > h + 5) {
        Object.assign(s, randomStar());
        s.y = -5;
      }
    }
    requestAnimationFrame(animate);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate();
  } else {
    canvas.style.display = 'none';
  }

})();
