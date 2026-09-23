/* =========================================================
   Tawananyasha Chinembiri — Portfolio interactions
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year in footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const iconDark = document.getElementById('themeIconDark');
  const iconLight = document.getElementById('themeIconLight');

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      iconDark.style.display = 'none';
      iconLight.style.display = 'block';
    } else {
      root.removeAttribute('data-theme');
      iconDark.style.display = 'block';
      iconLight.style.display = 'none';
    }
  }

  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('tc-theme') || 'dark'; } catch (e) { /* storage unavailable */ }
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem('tc-theme', next); } catch (e) { /* ignore */ }
  });

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll progress bar + scrollspy ---------- */
  const navProgress = document.getElementById('navProgress');
  const sections = document.querySelectorAll('main .section, .hero');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    navProgress.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%';

    let currentId = null;
    document.querySelectorAll('section[id]').forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) currentId = sec.id;
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-grid, .skills-grid > *, .project-card, .timeline-item, .dev-card, .cert-card, .contact-grid'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Hero role-rotator typewriter ---------- */
  const roles = ['Data Scientist', 'Data Engineer', 'Data Analyst', 'AI Engineer', 'Database Administrator'];
  const rotatorEl = document.getElementById('roleRotator');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      rotatorEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      rotatorEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 75);
  }
  typeLoop();

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll('.stat');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const numEl = el.querySelector('.stat-num');
      let current = 0;
      const duration = 1100;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);
        numEl.textContent = `${current}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObserver.observe(el));

  /* ---------- Pipeline step animation (About section) ---------- */
  const pipelineEl = document.getElementById('pipeline');
  const pipelineSteps = document.querySelectorAll('.pipeline-step');
  const pipelineProgress = document.getElementById('pipelineProgress');
  let pipelineStarted = false;

  const pipelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !pipelineStarted) {
        pipelineStarted = true;
        let step = 0;
        const total = pipelineSteps.length;
        const interval = setInterval(() => {
          if (step < total) {
            pipelineSteps[step].classList.add('active');
            pipelineProgress.style.width = `${((step + 1) / total) * 100}%`;
            step++;
          } else {
            clearInterval(interval);
          }
        }, 450);
        pipelineObserver.unobserve(pipelineEl);
      }
    });
  }, { threshold: 0.4 });
  if (pipelineEl) pipelineObserver.observe(pipelineEl);

  /* ---------- Skill bar fill on scroll ---------- */
  const barFills = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('filled');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  barFills.forEach(el => barObserver.observe(el));

  /* ---------- SQL "run query" simulation ---------- */
  const runQueryBtn = document.getElementById('runQueryBtn');
  const queryStatus = document.getElementById('queryStatus');
  const queryResult = document.getElementById('queryResult');
  let queryRunning = false;

  if (runQueryBtn) {
    runQueryBtn.addEventListener('click', () => {
      if (queryRunning) return;
      queryRunning = true;
      queryStatus.textContent = 'Running…';
      queryStatus.className = 'console-status running';
      queryResult.hidden = true;
      runQueryBtn.disabled = true;

      setTimeout(() => {
        queryStatus.textContent = '✓ 4 rows in 0.31s';
        queryStatus.className = 'console-status done';
        queryResult.hidden = false;
        queryResult.innerHTML = [
          'patient_id | age | avg_risk',
          '-----------+-----+---------',
          '   00214   |  61 |   0.91',
          '   00187   |  58 |   0.85',
          '   00302   |  67 |   0.79',
          '   00095   |  54 |   0.73'
        ].join('<br>');
        runQueryBtn.disabled = false;
        queryRunning = false;
      }, 900);
    });
  }

  /* ---------- Role filter (skills / projects / experience / certs) ---------- */
  const rolePills = document.querySelectorAll('.role-pill');
  const filterableEls = document.querySelectorAll('[data-roles]');

  rolePills.forEach(pill => {
    pill.addEventListener('click', () => {
      rolePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const role = pill.dataset.role;

      filterableEls.forEach(el => {
        if (role === 'all') {
          el.classList.remove('filtered-out');
          return;
        }
        const roleList = el.dataset.roles.split(',').map(r => r.trim());
        el.classList.toggle('filtered-out', !roleList.includes(role));
      });
    });
  });

  /* ---------- Project modal ---------- */
  const projectData = {
    heart: {
      title: 'Heart Disease Risk Prediction',
      sub: 'Stacking Ensemble & Explainable AI',
      desc: 'A multi-modal pipeline built to classify high-risk cardiac patients from clinical data, paired with explainability tooling so a clinician can see the reasoning behind every flagged case rather than a bare probability.',
      points: [
        'Built a multi-modal data pipeline that cut data-preparation time by 85%',
        'Designed a stacking ensemble combining Logistic Regression, Random Forest, XGBoost and SVM',
        'Reached up to 95% accuracy on high-risk patient classification',
        'Applied SHAP and LIME explainability to translate model output into clinically actionable insight'
      ]
    },
    sentiment: {
      title: 'Predicting Financial Markets using Sentiment Analysis',
      sub: 'NLP · Sentiment-to-Price Modeling',
      desc: 'An NLP pipeline that scrapes and processes financial news and social-media data for major equities, then links sentiment shifts to next-day price movement.',
      points: [
        'Built a scraping pipeline with Python and BeautifulSoup for news and social-media data',
        'Engineered sentiment scores from 1,000+ posts and merged them with historical price data via yfinance',
        'Trained a classifier linking sentiment shifts to next-day price direction',
        'Reached ~75% directional accuracy on held-out data'
      ]
    }
  };

  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  function openModal(key) {
    const data = projectData[key];
    if (!data) return;
    modalContent.innerHTML = `
      <h3 id="modalTitle">${data.title}</h3>
      <span class="modal-sub">${data.sub}</span>
      <p>${data.desc}</p>
      <ul>${data.points.map(p => `<li>${p}</li>`).join('')}</ul>
    `;
    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-more').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.open));
  });
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modalOverlay.hidden) closeModal(); });

  /* ---------- Certification accordion ---------- */
  document.querySelectorAll('.cert-header').forEach(header => {
    header.addEventListener('click', () => {
      const targetId = 'cert-' + header.dataset.cert;
      const body = document.getElementById(targetId);
      const isOpen = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', String(!isOpen));
      body.hidden = isOpen;
    });
  });

  /* ---------- Copy email to clipboard ---------- */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'tawananyashachinembiri03@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      copyEmailBtn.textContent = 'Copied!';
      copyEmailBtn.classList.add('copied');
      setTimeout(() => {
        copyEmailBtn.textContent = 'Copy';
        copyEmailBtn.classList.remove('copied');
      }, 1800);
    });
  }

  /* ---------- Contact form validation ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  function setFieldError(id, message) {
    const row = document.getElementById(id).closest('.form-row');
    const errorEl = document.getElementById('err-' + id);
    if (message) {
      row.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      row.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  function validateForm() {
    let valid = true;
    const name = document.getElementById('fName').value.trim();
    const email = document.getElementById('fEmail').value.trim();
    const message = document.getElementById('fMessage').value.trim();

    if (name.length < 2) { setFieldError('fName', 'Please enter your name.'); valid = false; }
    else setFieldError('fName', '');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) { setFieldError('fEmail', 'Enter a valid email address.'); valid = false; }
    else setFieldError('fEmail', '');

    if (message.length < 10) { setFieldError('fMessage', 'Message should be at least 10 characters.'); valid = false; }
    else setFieldError('fMessage', '');

    return valid;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formStatus.textContent = '';
      formStatus.style.color = '';

      if (!validateForm()) {
        formStatus.textContent = 'Please fix the errors above.';
        formStatus.style.color = 'var(--danger)';
        return;
      }

      const name = document.getElementById('fName').value.trim();
      const email = document.getElementById('fEmail').value.trim();
      const message = document.getElementById('fMessage').value.trim();
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

      window.location.href = `mailto:tawananyashachinembiri03@gmail.com?subject=${subject}&body=${body}`;

      formStatus.textContent = 'Opening your email client…';
      formStatus.style.color = 'var(--success)';
      contactForm.reset();
    });

    ['fName', 'fEmail', 'fMessage'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => {
        document.getElementById(id).closest('.form-row').classList.remove('invalid');
        document.getElementById('err-' + id).textContent = '';
      });
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Hero canvas: animated data network ---------- */
  const canvas = document.getElementById('network');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, nodes;
    const NODE_COUNT = 46;

    function resize() {
      width = canvas.width = canvas.offsetWidth * devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }

    function initNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        r: (Math.random() * 1.6 + 1) * devicePixelRatio
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const maxDist = 150 * devicePixelRatio;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(94, 154, 255, ${0.16 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(110, 160, 255, 0.85)';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    initNodes();
    draw();
    window.addEventListener('resize', () => { resize(); initNodes(); });
  }

});
