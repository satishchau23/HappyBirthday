(() => {
  const starfield = document.getElementById('starfield');
  for (let i = 0; i < 75; i++) {
    const star = document.createElement('i');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.animationDuration = `${2.5 + Math.random() * 4}s`;
    if (i % 7 === 0) { star.style.width = '3px'; star.style.height = '3px'; }
    starfield.appendChild(star);
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // Photo placeholders become real photos when matching files are added to /photos.
  document.querySelectorAll('.placeholder-photo').forEach((frame) => {
    const filename = frame.dataset.photo;
    const img = new Image();
    img.onload = () => {
      const backdrop = document.createElement('div');
      backdrop.className = 'photo-backdrop';
      backdrop.style.backgroundImage = `url("photos/${filename}")`;
      frame.innerHTML = '';
      frame.appendChild(backdrop);
      frame.appendChild(img);
      img.alt = filename.replace('.jpg', '').replace('photo', 'Memory photo ');
    };
    img.onerror = () => {};
    img.src = `photos/${filename}`;
  });

  const modal = document.getElementById('letterModal');
  const openBtn = document.getElementById('openLetter');
  const closeBtn = document.getElementById('closeLetter');
  const backdrop = document.getElementById('modalBackdrop');
  function openLetter() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    closeBtn.focus();
    burstHearts();
  }
  function closeLetter() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    openBtn.focus();
  }
  openBtn.addEventListener('click', openLetter);
  closeBtn.addEventListener('click', closeLetter);
  backdrop.addEventListener('click', closeLetter);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeLetter();
  });

  function burstHearts() {
    const symbols = ['♡', '✧', '♥', '✦'];
    for (let i = 0; i < 22; i++) {
      const heart = document.createElement('span');
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.position = 'fixed';
      heart.style.zIndex = '70';
      heart.style.left = `${40 + Math.random() * 20}%`;
      heart.style.top = `${45 + Math.random() * 10}%`;
      heart.style.color = Math.random() > .5 ? '#e8a9bb' : '#d9bd8b';
      heart.style.fontSize = `${12 + Math.random() * 20}px`;
      heart.style.pointerEvents = 'none';
      heart.style.transition = 'transform 1.3s ease-out, opacity 1.3s ease-out';
      document.body.appendChild(heart);
      requestAnimationFrame(() => {
        heart.style.transform = `translate(${(Math.random() - .5) * 280}px, ${-80 - Math.random() * 230}px) rotate(${(Math.random() - .5) * 90}deg)`;
        heart.style.opacity = '0';
      });
      setTimeout(() => heart.remove(), 1400);
    }
  }

  // Optional, soft synthesized chime. Nothing plays until the user explicitly turns it on.
  let audioContext = null;
  let soundOn = false;
  const soundToggle = document.getElementById('soundToggle');
  const soundLabel = document.getElementById('soundLabel');
  function chime() {
    if (!soundOn) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const now = audioContext.currentTime;
      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, now + index * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.055, now + index * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 0.55);
        oscillator.connect(gain); gain.connect(audioContext.destination);
        oscillator.start(now + index * 0.09); oscillator.stop(now + index * 0.09 + 0.6);
      });
    } catch (_) {}
  }
  soundToggle.addEventListener('click', async () => {
    soundOn = !soundOn;
    soundLabel.textContent = soundOn ? 'Sound on' : 'Sound off';
    soundToggle.querySelector('.sound-dot').style.background = soundOn ? '#d9bd8b' : '#d99aab';
    if (soundOn) {
      try { audioContext ||= new (window.AudioContext || window.webkitAudioContext)(); await audioContext.resume(); } catch (_) {}
      chime();
    }
  });
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    });
  });
})();
