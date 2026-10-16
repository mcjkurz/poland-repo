/* Per-slide behaviour. Each HOOKS entry is keyed by the slide's id:
 *   enter(el)          the slide becomes current (start animations here)
 *   leave(el)          the slide stops being current (stop them here)
 *   render(step, el)   called on every step change of the slide
 *   key(e, step, el)   return true to consume a key press (the slide is then re-rendered)
 */
window.HOOKS = {};

/* ─── title: slow drifting lines on a canvas ─── */
(function () {
  const cv = document.getElementById('title-waves');
  const ctx = cv.getContext('2d');
  const W = 1280, H = 720, dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.scale(dpr, dpr);
  let raf = null, t0 = 0;
  const lines = 16;

  function frame(t) {
    const s = (t - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < lines; i++) {
      const y0 = 380 + i * 18;
      const a = 10 + i * 1.6;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 8) {
        const y = y0 + a * Math.sin(x / 190 + s * .35 + i * .32) + a * .5 * Math.sin(x / 73 - s * .5 + i);
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      // fade from left to right, so the lines sit behind the text without competing with it
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, 'rgba(226,71,42,0)');
      g.addColorStop(.55, `rgba(226,71,42,${.08 + i * .012})`);
      g.addColorStop(1, `rgba(47,111,224,${.06 + i * .01})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    raf = requestAnimationFrame(frame);
  }

  HOOKS['s-title'] = {
    enter() { if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); } },
    leave() { cancelAnimationFrame(raf); raf = null; },
  };
})();
