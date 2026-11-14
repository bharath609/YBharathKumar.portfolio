/* ==========================================================================
   Y BHARATH KUMAR — NOIR & CRIMSON
   Prototype interactions: ambient canvas, pipeline explorer, filters, copy.
   ========================================================================== */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Ambient crimson canvas
  ------------------------------------------------------------------ */
  function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId = null;
    let lastTime = 0;
    let running = true;

    const cursor = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

    const orbs = [
      { x: 0.32, y: 0.36, r: 0.56, vx: 0.00022, vy: 0.00015, rgb: '239, 68, 68', a: 0.16 },
      { x: 0.74, y: 0.50, r: 0.46, vx: -0.00018, vy: 0.00020, rgb: '185, 28, 28', a: 0.13 },
      { x: 0.52, y: 0.84, r: 0.52, vx: 0.00015, vy: -0.00017, rgb: '255, 255, 255', a: 0.035 },
      { x: 0.88, y: 0.16, r: 0.30, vx: -0.00024, vy: -0.00011, rgb: '239, 68, 68', a: 0.075 }
    ];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function paint() {
      ctx.clearRect(0, 0, width, height);
      const reach = Math.max(width, height);

      orbs.forEach((orb) => {
        const px = (orb.x + (cursor.x - 0.5) * 0.055) * width;
        const py = (orb.y + (cursor.y - 0.5) * 0.055) * height;
        const radius = orb.r * reach;

        const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius);
        gradient.addColorStop(0, 'rgba(' + orb.rgb + ', ' + orb.a + ')');
        gradient.addColorStop(0.55, 'rgba(' + orb.rgb + ', ' + orb.a * 0.55 + ')');
        gradient.addColorStop(1, 'rgba(' + orb.rgb + ', 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function tick(time) {
      rafId = requestAnimationFrame(tick);
      if (!running) return;
      if (time - lastTime < 33) return;
      lastTime = time;

      cursor.x += (cursor.targetX - cursor.x) * 0.04;
      cursor.y += (cursor.targetY - cursor.y) * 0.04;

      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < 0.08 || orb.x > 0.92) orb.vx *= -1;
        if (orb.y < 0.08 || orb.y > 0.92) orb.vy *= -1;
      });

      paint();
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', (event) => {
      cursor.targetX = event.clientX / Math.max(width, 1);
      cursor.targetY = event.clientY / Math.max(height, 1);
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running && !reduceMotion && !rafId) {
        rafId = requestAnimationFrame(tick);
      }
    });

    resize();

    if (reduceMotion) {
      paint();
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------
     Scroll progress
  ------------------------------------------------------------------ */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress i');
    if (!bar) return;

    let ticking = false;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = 'scaleX(' + progress + ')';
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    update();
  }

  /* ------------------------------------------------------------------
     Dock navigation + active section
  ------------------------------------------------------------------ */
  function initNavigation() {
    const dock = document.getElementById('nav-dock');
    const toggle = document.getElementById('nav-toggle');
    const links = Array.from(document.querySelectorAll('.nav-item'));

    if (dock && toggle) {
      toggle.addEventListener('click', () => {
        const open = dock.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });

      links.forEach((link) => {
        link.addEventListener('click', () => {
          dock.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open menu');
        });
      });

      document.addEventListener('click', (event) => {
        if (!dock.contains(event.target)) {
          dock.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const sections = links
      .map((link) => ({ link, element: document.querySelector(link.getAttribute('href')) }))
      .filter((item) => item.element);

    if (!sections.length) return;

    let ticking = false;
    function updateActive() {
      const anchor = window.innerHeight * 0.34;
      let activeId = null;

      sections.forEach(({ element }) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= anchor && rect.bottom > anchor) activeId = '#' + element.id;
      });

      links.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === activeId);
      });

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActive);
      }
    }, { passive: true });

    window.addEventListener('resize', updateActive, { passive: true });
    updateActive();
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
  ------------------------------------------------------------------ */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    items.forEach((item) => observer.observe(item));
  }

  /* ------------------------------------------------------------------
     Retrieval pipeline explorer
  ------------------------------------------------------------------ */
  const STAGES = {
    1: {
      badge: 'STAGE 01 // INTAKE',
      title: 'Structure-aware ingestion',
      desc: 'Multi-format documents are parsed with their headings, tables and context intact. Chunks are shaped around meaning instead of arbitrary character counts, so the retriever never sees a fragment without its neighbourhood.',
      tags: ['PDF', 'DOCX', 'Markdown', 'Structure-aware chunks']
    },
    2: {
      badge: 'STAGE 02 // RETRIEVAL',
      title: 'Hybrid, local-first retrieval',
      desc: 'Local embeddings are stored in a persistent ChromaDB index. A relevance gate decides when the evidence is strong enough to answer — weak matches are refused instead of being stitched into a confident-sounding guess.',
      tags: ['ChromaDB', 'Local embeddings', 'Relevance gate', 'Persistent index']
    },
    3: {
      badge: 'STAGE 03 // VERIFICATION',
      title: 'Claim-level self-check',
      desc: 'Each generated claim is checked against the retrieved passages, and the response carries citations and retrieval receipts. The interface exposes the evidence, so a reader can audit the answer instead of trusting it.',
      tags: ['Citation grounding', 'Claim verification', 'Retrieval receipts', 'Self-check']
    },
    4: {
      badge: 'STAGE 04 // INTERFACE',
      title: 'An evidence workspace',
      desc: 'A React and FastAPI workspace with per-document source controls, suggested follow-ups and provider switching between Ollama and Anthropic. Grounding stays visible while the conversation moves.',
      tags: ['React', 'FastAPI', 'Ollama', 'Anthropic API']
    }
  };

  function initPipelineExplorer() {
    const tabs = Array.from(document.querySelectorAll('.stage-tab'));
    const pane = document.getElementById('stage-pane');
    if (!tabs.length || !pane) return;

    const badge = document.getElementById('stage-badge');
    const title = document.getElementById('stage-title');
    const desc = document.getElementById('stage-desc');
    const tags = document.getElementById('stage-tags');

    function selectTab(tab) {
      const stage = STAGES[tab.dataset.stage];
      if (!stage) return;

      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });

      badge.textContent = stage.badge;
      title.textContent = stage.title;
      desc.textContent = stage.desc;
      tags.replaceChildren(
        ...stage.tags.map((tag) => {
          const span = document.createElement('span');
          span.className = 'tech-tag';
          span.textContent = tag;
          return span;
        })
      );

      pane.style.animation = 'none';
      void pane.offsetWidth;
      pane.style.animation = '';
    }

    tabs.forEach((tab, index) => {
      tab.tabIndex = tab.classList.contains('active') ? 0 : -1;

      tab.addEventListener('click', () => selectTab(tab));

      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const next = event.key === 'ArrowRight'
          ? (index + 1) % tabs.length
          : (index - 1 + tabs.length) % tabs.length;
        tabs[next].focus();
        selectTab(tabs[next]);
      });
    });
  }

  /* ------------------------------------------------------------------
     Systems matrix filter
  ------------------------------------------------------------------ */
  function initFilters() {
    const buttons = Array.from(document.querySelectorAll('.filter-btn'));
    const grid = document.getElementById('bento-grid');
    if (!buttons.length || !grid) return;

    const cards = Array.from(grid.querySelectorAll('.bento-card'));

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter || 'all';

        buttons.forEach((item) => {
          item.classList.toggle('active', item === button);
          item.setAttribute('aria-pressed', String(item === button));
        });

        grid.classList.toggle('filtering', filter !== 'all');

        cards.forEach((card) => {
          const show = filter === 'all' || card.dataset.cat === filter;
          card.classList.toggle('hidden', !show);
          if (show) card.classList.add('in');
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     Copy email
  ------------------------------------------------------------------ */
  function initCopyEmail() {
    const button = document.getElementById('copy-email');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (!button || !toast || !toastText) return;

    let timer = null;

    function showToast(message) {
      toastText.textContent = message;
      toast.classList.add('show');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
    }

    function fallbackCopy(value) {
      const field = document.createElement('textarea');
      field.value = value;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      try { document.execCommand('copy'); } catch (error) { /* ignore */ }
      document.body.removeChild(field);
    }

    button.addEventListener('click', async () => {
      const email = button.dataset.email || '';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          fallbackCopy(email);
        }
        showToast('Email copied: ' + email);
      } catch (error) {
        fallbackCopy(email);
        showToast('Email copied: ' + email);
      }
    });
  }

  /* ------------------------------------------------------------------
     Arrow-agent swarm intro
  ------------------------------------------------------------------ */
  function initSwarmIntro() {
    const overlay = document.getElementById('swarm-intro');
    if (!overlay) return;

    const curtain = overlay.querySelector('.swarm-curtain');
    const scanline = overlay.querySelector('.swarm-scanline');
    const canvas = document.getElementById('swarm-trails');
    const cursorLayer = document.getElementById('swarm-cursors');
    const progressBar = document.getElementById('swarm-bar');
    const progressLabel = document.getElementById('swarm-progress-label');
    const agentCountLabel = document.getElementById('swarm-agent-count');
    const skipButton = document.getElementById('swarm-skip');
    const replayButton = document.getElementById('swarm-replay');

    if (!curtain || !canvas || !cursorLayer || !progressBar) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ARROW_PATH = 'M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z';
    const COLORS = ['#ef4444', '#ff8a5b', '#ffd166', '#8ac926', '#2ec4b6', '#4cc9f0', '#a78bfa', '#f72585', '#ffffff', '#ff5a5f'];
    const STORE_KEY = 'bh-swarm-seen';
    const SCAN_MS = 2400;
    const REVEAL_MS = 1050;
    const FAST_REVEAL_MS = 520;

    const inertTargets = Array.from(document.querySelectorAll('header, main, .site-footer'));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cursors = [];
    let running = false;
    let revealing = false;
    let finished = false;
    let rafId = 0;
    let revealTimer = 0;
    let safetyTimer = 0;
    let startTime = 0;
    let lastFrame = 0;
    let crossAt = 0;

    function hexToRgba(hex, alpha) {
      const value = parseInt(hex.slice(1), 16);
      const r = (value >> 16) & 255;
      const g = (value >> 8) & 255;
      const b = value & 255;
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }

    function setInert(value) {
      inertTargets.forEach((element) => {
        try { element.inert = value; } catch (error) { /* ignore */ }
      });
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cursors.forEach((cursor) => {
        cursor.x = Math.min(Math.max(cursor.x, 12), width - 12);
        cursor.y = Math.min(Math.max(cursor.y, 12), height - 12);
        cursor.tx = Math.min(Math.max(cursor.tx, 12), width - 12);
        cursor.ty = Math.min(Math.max(cursor.ty, 12), height - 12);
      });
    }

    function newTarget(cursor, now) {
      const margin = 0.06;
      cursor.tx = width * (margin + Math.random() * (1 - margin * 2));
      cursor.ty = height * (margin + Math.random() * (1 - margin * 2));
      cursor.retarget = now + 520 + Math.random() * 900;
    }

    function buildCursors() {
      const count = width < 640 ? 12 : 18;

      if (agentCountLabel) agentCountLabel.textContent = String(count);
      cursorLayer.replaceChildren();
      cursors = [];

      for (let index = 0; index < count; index++) {
        const color = COLORS[index % COLORS.length];
        const element = document.createElement('div');
        element.className = 'swarm-cursor';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '28');
        svg.setAttribute('height', '28');
        svg.setAttribute('viewBox', '0 0 28 28');
        svg.setAttribute('aria-hidden', 'true');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', ARROW_PATH);
        path.setAttribute('fill', color);
        path.setAttribute('stroke', '#fff');
        path.setAttribute('stroke-width', '1.4');
        path.setAttribute('stroke-linejoin', 'round');

        svg.appendChild(path);
        element.appendChild(svg);
        cursorLayer.appendChild(element);

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.min(width, height) * (0.04 + Math.random() * 0.2);
        const cursor = {
          element,
          svg,
          color,
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          vx: Math.cos(angle) * (160 + Math.random() * 180),
          vy: Math.sin(angle) * (160 + Math.random() * 180),
          tx: 0,
          ty: 0,
          retarget: 0,
          phase: Math.random() * Math.PI * 2,
          wobble: 0.6 + Math.random() * 1.2,
          prevX: null,
          prevY: null
        };

        newTarget(cursor, performance.now());
        cursors.push(cursor);
      }
    }

    function drawCrosshair(x, y, color) {
      const arm = 4.5;
      ctx.strokeStyle = hexToRgba(color, 0.55);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - arm, y); ctx.lineTo(x - 1.4, y);
      ctx.moveTo(x + 1.4, y); ctx.lineTo(x + arm, y);
      ctx.moveTo(x, y - arm); ctx.lineTo(x, y - 1.4);
      ctx.moveTo(x, y + 1.4); ctx.lineTo(x, y + arm);
      ctx.stroke();

      if (Math.random() < 0.35) {
        ctx.fillStyle = hexToRgba(color, 0.55);
        ctx.font = '7px "JetBrains Mono", monospace';
        ctx.fillText(Math.round(x) + '×' + Math.round(y), x + 8, y - 8);
      }
    }

    function beginReveal(fast) {
      if (revealing) return;
      revealing = true;
      overlay.classList.add('revealing');
      if (fast) overlay.classList.add('fast');
      document.documentElement.classList.remove('swarm-pause');
      revealTimer = window.setTimeout(finish, fast ? FAST_REVEAL_MS : REVEAL_MS);
    }

    function finish() {
      if (finished) return;
      finished = true;
      running = false;
      window.clearTimeout(revealTimer);
      window.clearTimeout(safetyTimer);
      cancelAnimationFrame(rafId);
      overlay.classList.add('done');
      overlay.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('swarm-pause');
      document.body.style.overflow = '';
      setInert(false);
      try { sessionStorage.setItem(STORE_KEY, '1'); } catch (error) { /* ignore */ }
    }

    function frame(now) {
      if (!running) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SCAN_MS, 1);
      progressBar.style.transform = 'scaleX(' + progress + ')';
      if (progressLabel) progressLabel.textContent = String(Math.round(progress * 100)).padStart(3, '0');

      if (progress >= 1 && !revealing) beginReveal(false);

      const dt = Math.min((now - (lastFrame || now)) / 1000, 0.05);
      lastFrame = now;

      // Fade old trails without painting over the page being revealed.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      for (const cursor of cursors) {
        if (now > cursor.retarget || Math.hypot(cursor.tx - cursor.x, cursor.ty - cursor.y) < 34) {
          newTarget(cursor, now);
        }

        const dx = cursor.tx - cursor.x;
        const dy = cursor.ty - cursor.y;
        const distance = Math.hypot(dx, dy) || 1;
        const nx = dx / distance;
        const ny = dy / distance;
        const wobble = Math.sin(now * 0.001 * cursor.wobble + cursor.phase) * 115;

        cursor.vx += ((nx * 480 - cursor.vx) * 2.2 - ny * wobble) * dt;
        cursor.vy += ((ny * 480 - cursor.vy) * 2.2 + nx * wobble) * dt;

        const speed = Math.hypot(cursor.vx, cursor.vy) || 1;
        const maxSpeed = 470;
        const minSpeed = 150;
        if (speed > maxSpeed) {
          cursor.vx *= maxSpeed / speed;
          cursor.vy *= maxSpeed / speed;
        } else if (speed < minSpeed) {
          cursor.vx *= minSpeed / speed;
          cursor.vy *= minSpeed / speed;
        }

        cursor.x += cursor.vx * dt;
        cursor.y += cursor.vy * dt;

        if (cursor.x < 10) { cursor.x = 10; cursor.vx = Math.abs(cursor.vx); }
        if (cursor.x > width - 10) { cursor.x = width - 10; cursor.vx = -Math.abs(cursor.vx); }
        if (cursor.y < 10) { cursor.y = 10; cursor.vy = Math.abs(cursor.vy); }
        if (cursor.y > height - 10) { cursor.y = height - 10; cursor.vy = -Math.abs(cursor.vy); }

        const angle = Math.atan2(cursor.vy, cursor.vx) * (180 / Math.PI) + 135;
        cursor.element.style.transform = 'translate(' + cursor.x.toFixed(1) + 'px, ' + cursor.y.toFixed(1) + 'px)';
        cursor.svg.style.transform = 'translate(-5px, -3.5px) rotate(' + angle.toFixed(1) + 'deg)';

        if (cursor.prevX !== null) {
          ctx.strokeStyle = hexToRgba(cursor.color, 0.3);
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(cursor.prevX, cursor.prevY);
          ctx.lineTo(cursor.x, cursor.y);
          ctx.stroke();
        }
        cursor.prevX = cursor.x;
        cursor.prevY = cursor.y;
      }

      if (now > crossAt) {
        crossAt = now + 140;
        const mark = cursors[Math.floor(Math.random() * cursors.length)];
        if (mark) drawCrosshair(mark.x, mark.y, mark.color);
      }

      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (reduceMotion || running) return;

      finished = false;
      revealing = false;
      window.__bhSwarmStarted = true;
      window.clearTimeout(revealTimer);
      window.clearTimeout(safetyTimer);

      document.documentElement.classList.add('swarm-boot', 'swarm-pause');
      overlay.classList.remove('done', 'revealing', 'fast');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setInert(true);

      // Reset the curtain without replaying its reverse transition.
      curtain.style.transition = 'none';
      curtain.style.transform = 'scaleY(1)';
      if (scanline) {
        scanline.style.transition = 'none';
        scanline.style.opacity = '0';
        scanline.style.transform = 'translateY(0)';
      }
      void overlay.offsetWidth;
      curtain.style.transition = '';
      if (scanline) scanline.style.transition = '';

      resize();
      buildCursors();
      ctx.clearRect(0, 0, width, height);

      progressBar.style.transform = 'scaleX(0)';
      if (progressLabel) progressLabel.textContent = '000';

      startTime = performance.now();
      lastFrame = startTime;
      crossAt = startTime + 120;
      running = true;
      rafId = requestAnimationFrame(frame);

      safetyTimer = window.setTimeout(() => {
        if (running) beginReveal(true);
      }, 9000);
    }

    function skip() {
      if (!running) return;
      progressBar.style.transform = 'scaleX(1)';
      if (progressLabel) progressLabel.textContent = '100';
      beginReveal(true);
    }

    if (skipButton) skipButton.addEventListener('click', skip);
    if (replayButton) replayButton.addEventListener('click', () => start());
    window.addEventListener('resize', () => {
      if (!running) return;
      resize();
    }, { passive: true });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && running) skip();
    });

    if (document.documentElement.classList.contains('swarm-boot')) start();
  }

  /* ------------------------------------------------------------------
     Boot
  ------------------------------------------------------------------ */
  function boot() {
    initAmbientCanvas();
    initScrollProgress();
    initNavigation();
    initReveal();
    initPipelineExplorer();
    initFilters();
    initCopyEmail();
    initSwarmIntro();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
