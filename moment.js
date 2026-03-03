(function () {
  const params = new URLSearchParams(window.location.search);
  const mood = params.get("mood") || "neutral";
document.body.classList.add(`theme-${mood}`);
  const orb = document.getElementById('orb');
  const ringProgress = document.getElementById('ringProgress');
  const cueEl = document.getElementById('cue');
  const subcueEl = document.getElementById('subcue');

  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const patternSel = document.getElementById('patternSel');
  const quoteEl = document.getElementById('quote');

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const QUOTES = [
    '“A short pause can soften a long day.”',
    '“Breathe in calm, breathe out tension.”',
    '“It’s okay to take things slowly.”',
    '“You are here, let that be enough for now.”',
    '“Small moments count, too.”',
  ];

  function randomQuote() {
    quoteEl.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }

  function getPattern() {
    const [inh, hold, exh] = patternSel.value.split('-').map(n => parseInt(n, 10));
    return [
      { name: 'Inhale', seconds: inh, verb: 'Inhale' },
      { name: 'Hold',   seconds: hold, verb: 'Hold'   },
      { name: 'Exhale', seconds: exh,  verb: 'Exhale' },
    ];
  }

  // Read orb scale bounds from CSS variables
  function getOrbBounds() {
    const styles = getComputedStyle(document.documentElement);
    const min = parseFloat(styles.getPropertyValue('--orb-min')) || 0.88;
    const max = parseFloat(styles.getPropertyValue('--orb-max')) || 1.16;
    return { min, max };
  }

  // Set the orb transform & transition for the phase in one go
  function applyPhaseMotion(phaseName, durationSec) {
    if (REDUCED) return; // respect reduced motion
    const { min, max } = getOrbBounds();

    // Choose target scale and easing per phase
    let targetScale = min;
    let easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)'; // default ease

    if (phaseName === 'Inhale') {
      targetScale = max;
      // gentle ease-in-out for inhale
      easing = 'cubic-bezier(0.42, 0.0, 0.58, 1.0)';
    } else if (phaseName === 'Hold') {
      // stay at max: zero-duration transition to "stick" there
      targetScale = max;
      durationSec = 0;
      easing = 'linear';
    } else if (phaseName === 'Exhale') {
      targetScale = min;
      // slightly different curve for exhale to feel natural
      easing = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
    }

    // Apply transition matching the phase duration
    orb.style.transition = `transform ${Math.max(0, durationSec)}s ${easing}`;
    // Trigger the movement
    orb.style.transform = `scale(${targetScale})`;
  }

  // State
  let raf = null;
  let running = false;
  let phaseIndex = 0;
  let phaseElapsed = 0; // seconds in current phase
  let cycleElapsed = 0; // seconds in entire cycle
  let lastTs = null;
  let phaseJustStarted = true;

  function setCue(text, sub) {
    cueEl.textContent = text;
    subcueEl.textContent = sub || '';
  }

  function setRing(totalProgress) {
    const angle = Math.max(0, Math.min(360, totalProgress * 360));
    ringProgress.style.setProperty('--angle', `${angle}deg`);
  }

  function tick(ts) {
    if (!running) return;
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    const pattern = getPattern();
    const current = pattern[phaseIndex];

    // If we just entered this phase, configure the orb once
    if (phaseJustStarted) {
      applyPhaseMotion(current.name, current.seconds);
      phaseJustStarted = false;
    }

    phaseElapsed += dt;
    cycleElapsed += dt;

    // UI text countdown + ring progress
    setCue(current.verb, `${Math.ceil(Math.max(0, current.seconds - phaseElapsed))}s`);
    const totalDur = pattern.reduce((s, x) => s + x.seconds, 0);
    setRing((cycleElapsed % totalDur) / totalDur);

    // Advance phase when time is up
    if (phaseElapsed >= current.seconds) {
      phaseIndex = (phaseIndex + 1) % pattern.length;
      phaseElapsed = 0;
      phaseJustStarted = true;

      // New cycle started?
      if (phaseIndex === 0) {
        randomQuote();
      }
    }

    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    startBtn.dataset.state = 'running';
    startBtn.setAttribute('aria-pressed', 'true');
    startBtn.textContent = 'Pause';
    stopBtn.disabled = false;
    lastTs = null;
    // Ensure we start from min scale
    const { min } = getOrbBounds();
    orb.style.transition = 'transform 0s linear';
    orb.style.transform = `scale(${min})`;
    phaseJustStarted = true;
    raf = requestAnimationFrame(tick);
  }

  function pause() {
    running = false;
    startBtn.dataset.state = 'idle';
    startBtn.setAttribute('aria-pressed', 'false');
    startBtn.textContent = 'Start';
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function stop() {
    pause();
    phaseIndex = 0;
    phaseElapsed = 0;
    cycleElapsed = 0;
    phaseJustStarted = true;
    // Reset visuals
    setRing(0);
    setCue('Ready?', '');
    const { min } = getOrbBounds();
    orb.style.transition = 'transform 0.2s ease-out';
    orb.style.transform = `scale(${min})`;
    stopBtn.disabled = true;
  }

  // Events
  startBtn.addEventListener('click', () => {
    if (startBtn.dataset.state === 'running') pause();
    else start();
  });

  stopBtn.addEventListener('click', stop);

  patternSel.addEventListener('change', () => {
    // Smoothly restart the cycle with the new pace (don’t auto-start)
    phaseIndex = 0;
    phaseElapsed = 0;
    cycleElapsed = 0;
    phaseJustStarted = true;
    if (!running) {
      setRing(0);
      setCue('Ready?', '');
      const { min } = getOrbBounds();
      orb.style.transition = 'transform 0.2s ease-out';
      orb.style.transform = `scale(${min})`;
    }
  });

  // Keyboard: Space = Start/Pause, Esc = Stop
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (startBtn.dataset.state === 'running') pause();
      else start();
    }
    if (e.code === 'Escape') {
      stop();
    }
  });

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running) pause();
  });

  // Init
  randomQuote();
  setCue('Ready?', '');
  setRing(0);
})();


