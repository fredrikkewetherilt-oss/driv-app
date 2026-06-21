import { useState, useEffect, useLayoutEffect } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const strengthItems = [
  { label: '10 knebøy',                          img: '/assets/ovelser/kneboy.jpg' },
  { label: '8 utfall per bein',                   img: '/assets/ovelser/utfall.jpg' },
  { label: '10 push-ups (på knær ved behov)',     img: '/assets/ovelser/pushups.jpg' },
  { label: '10 sit-ups',                          img: '/assets/ovelser/situps.jpg' },
  { label: '15 rygghev',                          img: '/assets/ovelser/rygghev.jpg' },
];

const SESSIONS = {
  jogg: {
    kind: 'Kondisjon', title: 'Rolig langtur', dur: '20–30 min', icon: '🏃‍♀️', tint: '#e3f4ea',
    steps: [
      { type: 'timer',     name: 'Oppvarming',     detail: 'Rolig gå og jogg',                  seconds: 300,  bullets: ['Start helt rolig', 'Få opp pulsen gradvis'] },
      { type: 'timer',     name: 'Rolig jogging',  detail: 'Et tempo du klarer å prate i',       seconds: 1080, bullets: ['Jevnt og rolig', 'Pust med magen'] },
      { type: 'do',        name: 'Raske løp',      detail: '4 × 20 sekunder',                    bullets: ['20 sek rask fart', 'Gå rolig tilbake', 'Gjenta 4 ganger'] },
      { type: 'timer',     name: 'Nedjogg',         detail: 'Rolig jogg eller gange',             seconds: 300,  bullets: ['Senk tempoet', 'Pust deg ned'] },
    ],
  },
  styrke: {
    kind: 'Styrke', title: 'Styrkesirkel', dur: '20–25 min', icon: '💪', tint: '#fbe3e8',
    steps: [
      { type: 'timer',     name: 'Lett oppvarming', detail: 'Gjør deg klar',                     seconds: 120, bullets: ['Litt bevegelighet', 'Noen lette spensthopp'] },
      { type: 'checklist', name: 'Runde 1 av 3',   items: strengthItems },
      { type: 'timer',     name: 'Pause',           detail: 'Hvil før neste runde',               seconds: 60,  bullets: ['Rist løs', 'Drikk litt vann'] },
      { type: 'checklist', name: 'Runde 2 av 3',   items: strengthItems },
      { type: 'timer',     name: 'Pause',           detail: 'Hvil før siste runde',               seconds: 60,  bullets: ['Pust rolig'] },
      { type: 'checklist', name: 'Runde 3 av 3',   items: strengthItems },
      { type: 'do',        name: 'Uttøying',        detail: 'Rolig tøy ut til slutt',             bullets: ['Lår og legger', 'Rygg og hofter', 'Hold hver tøy 15–20 sek'] },
    ],
  },
  A: {
    kind: 'Ballkontroll', title: 'Ballkontroll og føring', dur: '25–30 min', icon: '⚽', tint: 'var(--driv-blue-tint)',
    steps: [
      { type: 'timer',     name: 'Triksing og fri lek',      detail: 'Bli venn med ballen',       seconds: 300, bullets: ['Hold ballen i lufta', 'Prøv begge føtter'] },
      { type: 'timer',     name: 'Føring med begge bein',    detail: 'Rolig og kontrollert',       seconds: 600, bullets: ['Innside', 'Utside', 'Såle'], videos: [{ label: 'Føring: innside, utside, såle', embed: 'J6U-YClb6AM' }] },
      { type: 'timer',     name: 'Finter',                   detail: 'Øv på tre faste finter',     seconds: 600, bullets: ['Stepover', 'Cruyff-vending', 'Vending med innsiden'], videos: [{ label: 'Stepover', embed: 'dQfDy9Mqmhc' }, { label: 'Cruyff-vending', embed: 'EEwIxwUZjdo' }, { label: 'Vending med innsiden', embed: 'vX84ATVR0F8' }] },
      { type: 'challenge', name: 'Berøringer på 1 minutt',  detail: 'Start timeren og ta korte touch på ballen med innsiden av foten — vekselvis høyre og venstre. Tell hver berøring i ett minutt.', seconds: 60, pbKey: 'touches', unit: 'berøringer', prompt: 'Hvor mange klarte du?', bullets: ['Korte touch innside-innside', 'Veksle høyre og venstre fot', 'Tell hver gang du rører ballen'] },
    ],
  },
  B: {
    kind: 'Pasning', title: 'Pasning og mottak', dur: '25–30 min', icon: '⚽', tint: 'var(--driv-blue-tint)',
    steps: [
      { type: 'timer', name: 'Oppvarming med ball',              detail: 'Korte, lette pasninger', seconds: 180, bullets: ['Lette touch', 'Begge føtter'] },
      { type: 'do',    name: '50 pasninger – høyre fot',         detail: 'Mot vegg eller med partner', bullets: ['Treff samme punkt', 'Rolig og presist'] },
      { type: 'do',    name: '50 pasninger – venstre fot',       detail: 'Mot vegg eller med partner', bullets: ['Ta deg god tid', 'Sikt før du slår'] },
      { type: 'timer', name: 'Mottak og pasning på ett touch',   detail: 'Alene mot en vegg: spill ballen i veggen og send den rett tilbake i samme berøring. Hold en jevn rytme.', seconds: 300, bullets: ['Ett touch', 'Jevn rytme', 'Mot vegg eller partner'] },
      { type: 'do',    name: '20 pasninger uten feil',           detail: 'Avslutning', bullets: ['Konsentrer deg', 'Tell høyt'] },
      { type: 'do',    name: '20 pasninger med svak fot',        detail: 'Avslutning', bullets: ['Tøff utfordring', 'Ro i bevegelsen'] },
    ],
  },
  C: {
    kind: 'Avslutninger', title: 'Avslutninger og hurtighet', dur: '25–30 min', icon: '⚽', tint: 'var(--driv-blue-tint)',
    steps: [
      { type: 'timer',     name: 'Oppvarming med ball', detail: 'Få opp tempoet',         seconds: 300, bullets: ['Lett føring', 'Noen lette pasninger'] },
      { type: 'do',        name: 'Sprintløp',           detail: '10 sprinter på 10–20 meter', bullets: ['Full fart', 'Gå rolig tilbake mellom hver'] },
      { type: 'timer',     name: 'Skuddtrening',        detail: 'Sikt og treff',           seconds: 600, bullets: ['Høyre fot', 'Venstre fot', 'Etter føring'] },
      { type: 'challenge', name: 'Treff mål eller kjegle', detail: 'Av 10 forsøk',        seconds: 0,   pbKey: 'targets', unit: 'treff av 10', prompt: 'Hvor mange treff?' },
    ],
  },
};

const CHEERS  = ['Bra jobba!', 'Du fikser dette!', 'Sterkt!', 'Fortsett sånn!', 'Heia deg!', 'Du blir bedre for hver gang!', 'Nesten der!', 'Skikkelig innsats!'];
const PRAISES = ['Bra jobba', 'Sterkt', 'Heia', 'Stå på', 'Supert'];

const BADGE_DEFS = [
  { id: 'start',   name: 'Kom i gang',   icon: '🌟', test: p => (p.totalDone || 0) >= 1 },
  { id: 'core',    name: 'Sterk kjerne', icon: '💪', test: p => anyType(p, ['styrke']) },
  { id: 'ball',    name: 'Ballfølelse',  icon: '⚽', test: p => anyType(p, ['A', 'B', 'C']) },
  { id: 'streak3', name: '3 på rad',     icon: '🔥', test: p => (p.streak || 0) >= 3 },
  { id: 'week',    name: 'Hel uke',      icon: '✅', test: p => anyFullWeek(p) },
  { id: 'sharp',   name: 'Skarpskytter', icon: '🎯', test: p => (p.pb?.targets || 0) >= 8 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveSession(week, key) {
  if (key === 'okt1') return week % 2 === 1 ? SESSIONS.jogg : SESSIONS.styrke;
  return SESSIONS[['A', 'B', 'C'][(week - 1) % 3]];
}

function resolveType(week, key) {
  if (key === 'okt1') return week % 2 === 1 ? 'jogg' : 'styrke';
  return ['A', 'B', 'C'][(week - 1) % 3];
}

function anyType(p, types) {
  return Object.keys(p.completed || {}).some(k => {
    if (!p.completed[k]) return false;
    const [w, s] = k.split('-');
    return types.includes(resolveType(+w, s));
  });
}

function anyFullWeek(p) {
  const c = p.completed || {};
  const weeks = new Set(Object.keys(c).filter(k => c[k]).map(k => k.split('-')[0]));
  return [...weeks].some(w => c[`${w}-okt1`] && c[`${w}-okt2`]);
}

function earnedSet(p) {
  return Object.fromEntries(BADGE_DEFS.filter(d => d.test(p)).map(d => [d.id, true]));
}

function fmt(sec) {
  sec = Math.max(0, sec);
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${s < 10 ? '0' + s : s}`;
}

function loadProgress() {
  try { return JSON.parse(localStorage.getItem('j2013_progress') || 'null'); } catch { return null; }
}

function saveProgress(p) {
  try { localStorage.setItem('j2013_progress', JSON.stringify(p)); } catch {}
}

// ─── Icon component ───────────────────────────────────────────────────────────

function Icon({ name, size = 22, style: extra }) {
  return (
    <span style={{ fontFamily: "'Material Symbols Rounded'", fontSize: size, lineHeight: 1, display: 'inline-flex', userSelect: 'none', ...extra }}>
      {name}
    </span>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [progress, setProgressRaw] = useState(() => loadProgress() ?? { completed: {}, pb: {}, streak: 0, totalDone: 0 });
  const [view, setView]             = useState(() => (loadProgress()?.name ? 'home' : 'name'));
  const [week, setWeek]             = useState(1);
  const [nameInput, setNameInput]   = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [stepIndex, setStepIndex]   = useState(0);
  const [timerLeft, setTimerLeft]   = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [checks, setChecks]         = useState([]);
  const [challengeVal, setChallengeVal] = useState(0);
  const [videoModal, setVideoModal] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [lastDone, setLastDone]     = useState(null);

  // Sync html + body background and Safari theme-color to current screen.
  // useLayoutEffect runs synchronously before paint, preventing any flash.
  useLayoutEffect(() => {
    const color = view === 'home' ? '#fbf8f3'
                : view === 'done' ? '#ffa424'
                :                   '#23347a';
    document.documentElement.style.background = color;
    document.body.style.background = color;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  }, [view]);

  // Timer tick
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerLeft(l => {
        if (l <= 1) { setTimerRunning(false); return 0; }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  function updateProgress(p) { saveProgress(p); setProgressRaw(p); }

  function openSession(id) {
    const sess = resolveSession(week, id);
    const step = sess.steps[0];
    setActiveSession(id);
    setStepIndex(0);
    setTimerRunning(false);
    setTimerLeft(step.seconds || 0);
    setChecks(step.type === 'checklist' ? step.items.map(() => false) : []);
    setChallengeVal(0);
    setView('session');
  }

  function goStep(i) {
    const sess = resolveSession(week, activeSession);
    const step = sess.steps[i];
    setStepIndex(i);
    setTimerRunning(false);
    setTimerLeft(step.seconds || 0);
    setChecks(step.type === 'checklist' ? step.items.map(() => false) : []);
    setChallengeVal(0);
  }

  function goBack() {
    if (stepIndex > 0) goStep(stepIndex - 1);
    else { setView('home'); setTimerRunning(false); }
  }

  function closePlayer() { setView('home'); setTimerRunning(false); }

  function setName() {
    const nm = (nameInput || '').trim();
    const p = { ...progress, name: nm };
    updateProgress(p);
    setView('home');
  }

  function editName() { setNameInput(progress.name || ''); setView('name'); }

  function changeWeek(d) { setWeek(w => Math.min(12, Math.max(1, w + d))); }

  function toggleCheck(i) {
    setChecks(c => { const nc = [...c]; nc[i] = !nc[i]; return nc; });
  }

  function startOrPause() {
    const total = resolveSession(week, activeSession).steps[stepIndex].seconds || 0;
    if (timerLeft <= 0 && total > 0) { setTimerLeft(total); setTimerRunning(true); }
    else setTimerRunning(r => !r);
  }

  function resetTimer() {
    setTimerLeft(resolveSession(week, activeSession).steps[stepIndex].seconds || 0);
    setTimerRunning(false);
  }

  function handleNext() {
    const sess = resolveSession(week, activeSession);
    const step = sess.steps[stepIndex];
    const p = { ...progress, completed: { ...progress.completed }, pb: { ...(progress.pb || {}) } };
    let record = false, recordText = '';
    if (step?.type === 'challenge' && step.pbKey) {
      const prev = p.pb[step.pbKey] || 0;
      if (challengeVal > prev) {
        p.pb[step.pbKey] = challengeVal;
        record = true;
        recordText = `Ny rekord: ${challengeVal} ${step.unit || ''}!`;
      }
    }
    if (stepIndex >= sess.steps.length - 1) complete(p, sess, record, recordText);
    else { updateProgress(p); goStep(stepIndex + 1); }
  }

  function complete(p, sess, record, recordText) {
    const before = earnedSet(progress);
    const key = `${week}-${activeSession}`;
    if (!p.completed[key]) {
      p.completed[key] = true;
      p.totalDone = (p.totalDone || 0) + 1;
      p.streak    = (p.streak || 0) + 1;
    }
    const after = earnedSet(p);
    const newBadgeId = Object.keys(after).find(id => !before[id]);
    const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
    updateProgress(p);
    setTimerRunning(false);
    setLastDone({
      headline: praise + (p.name ? `, ${p.name}` : '') + '!',
      title: sess.title, kind: sess.kind, streak: p.streak,
      newBadge: newBadgeId ? BADGE_DEFS.find(d => d.id === newBadgeId)?.name : null,
      record, recordText,
    });
    setView('done');
  }

  // ── Derived ──────────────────────────────────────────────────────────────────
  const nm         = progress.name || '';
  const doneCount  = ['okt1', 'okt2'].filter(k => progress.completed[`${week}-${k}`]).length;
  const sess       = activeSession ? resolveSession(week, activeSession) : null;
  const step       = sess ? sess.steps[stepIndex] : null;
  const total      = step?.seconds || 0;
  const timerDone  = total > 0 && timerLeft <= 0;
  const CIRC       = 326.73;
  const timerOffset = total > 0 ? (CIRC * (1 - timerLeft / total)).toFixed(1) : CIRC.toFixed(1);
  const isLast     = sess ? stepIndex >= sess.steps.length - 1 : false;
  const isChallenge = step?.type === 'challenge';
  const progressPct = sess ? `${Math.round(stepIndex / sess.steps.length * 100)}%` : '0%';
  const firstName  = nm ? `, ${nm}` : '';

  // Summer note
  let summerTitle, summerBody;
  if (doneCount >= 2) {
    summerTitle = `Uke ${week} i boks! 🎉`;
    summerBody  = `Råsterkt${firstName} — begge øktene er gjort. Nyt sommeren, vi ses neste uke!`;
  } else if (doneCount === 1) {
    summerTitle = `Bra start på uke ${week}!`;
    summerBody  = `Én økt igjen før uka er i boks. Du holder ferieforma oppe${firstName} 💪`;
  } else if (week >= 4) {
    summerTitle = 'Hold det gående i ferien ☀️';
    summerBody  = `Hver økt nå teller mot toppform til sesongstart. Velg en økt og kjør i gang${firstName}!`;
  } else {
    summerTitle = `God sommer${firstName}! ☀️`;
    summerBody  = 'Ta med ballen i ferien — 1–2 økter i uka holder deg skarp til sesongstart. Velg uke når du er klar.';
  }

  const greeting = doneCount === 0
    ? `Hei${nm ? ', ' + nm : ''}! Klar for første økt?`
    : doneCount === 1
    ? (nm ? `Bra start, ${nm} — én igjen!` : 'Én økt igjen denne uka')
    : (nm ? `Råsterkt, ${nm}!` : 'Begge økter er gjort!');

  const sessionCards = ['okt1', 'okt2'].map(key => {
    const s    = resolveSession(week, key);
    const done = !!progress.completed[`${week}-${key}`];
    return { id: key, label: `${key === 'okt1' ? 'Økt 1' : 'Økt 2'} · ${s.kind}`, title: s.title, dur: s.dur, icon: s.icon, tint: s.tint, stepsCount: s.steps.length, done };
  });

  const earned = earnedSet(progress);
  const badges = BADGE_DEFS.map(d => ({
    name: d.name,
    icon: earned[d.id] ? d.icon : '🔒',
    bg:   earned[d.id] ? 'var(--badge-bg)' : 'var(--badge-locked-bg)',
    border: earned[d.id] ? 'var(--badge-border)' : 'var(--badge-locked-bd)',
    labelColor: earned[d.id] ? 'var(--driv-blue)' : 'var(--text-label)',
    filter: earned[d.id] ? 'none' : 'grayscale(1) opacity(0.7)',
  }));

  const checklistItems = (step?.type === 'checklist' ? step.items : []).map((item, i) => ({
    ...item, checked: !!checks[i], idx: i,
  }));

  // ── Phone wrapper ─────────────────────────────────────────────────────────────
  return (
    <div className="app-outer">
      <div className="app-shell">

        {/* ═══ NAME SCREEN ═══ */}
        {view === 'name' && (
          <div style={{ minHeight: '100vh', background: 'var(--driv-blue)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'calc(32px + env(safe-area-inset-top)) 30px calc(32px + env(safe-area-inset-bottom))', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.22)' }}>
              <img src="/assets/driv-logo.png" alt="Driv Fotball" style={{ width: 54, height: 'auto' }} />
            </div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 30, color: '#fff', marginTop: 22, letterSpacing: '-0.02em' }}>Velkommen!</div>
            <div style={{ font: '400 15px/22px Inter,sans-serif', color: 'rgba(255,255,255,0.8)', marginTop: 10, maxWidth: 280 }}>
              Skriv inn fornavnet ditt, så heier vi på deg gjennom hver økt.
            </div>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setName()}
              placeholder="Fornavnet ditt"
              style={{ width: '100%', maxWidth: 300, marginTop: 24, padding: '15px 18px', border: 'none', borderRadius: 14, background: '#fff', color: 'var(--driv-blue)', font: '600 17px Inter,sans-serif', textAlign: 'center', outline: 'none' }}
            />
            <button onClick={setName} style={{ width: '100%', maxWidth: 300, marginTop: 14, border: 'none', cursor: 'pointer', background: 'var(--driv-red)', color: '#fff', font: '700 17px Inter,sans-serif', padding: 16, borderRadius: 14 }}>
              Kom i gang ⚽
            </button>
            <button onClick={setName} style={{ marginTop: 12, border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', font: '600 14px Inter,sans-serif' }}>
              Hopp over
            </button>
          </div>
        )}

        {/* ═══ HOME SCREEN ═══ */}
        {view === 'home' && (
          <div style={{ minHeight: '100vh', background: 'var(--bg-app)', paddingBottom: 'calc(36px + env(safe-area-inset-bottom))' }}>

            {/* navy header band */}
            <div style={{ background: 'var(--driv-blue)', padding: 'calc(20px + env(safe-area-inset-top)) 20px 42px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <div style={{ flexShrink: 0, width: 50, height: 50, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
                    <img src="/assets/driv-logo.png" alt="Driv Fotball" style={{ width: 38, height: 'auto' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 24, lineHeight: 1, color: '#fff', letterSpacing: '-0.02em' }}>Egentrening</div>
                    <div style={{ font: '600 12px/1 Inter,sans-serif', color: 'rgba(255,255,255,0.7)', marginTop: 6, letterSpacing: '0.03em' }}>Driv Fotball · Jenter 2013</div>
                  </div>
                </div>
                <button onClick={editName} style={{ border: 'none', background: 'rgba(255,255,255,0.12)', cursor: 'pointer', width: 38, height: 38, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Icon name="edit" size={20} />
                </button>
              </div>
              {/* week switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 9999, padding: 4, marginTop: 18, width: 'fit-content' }}>
                <button onClick={() => changeWeek(-1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', width: 30, height: 30, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Icon name="chevron_left" size={20} />
                </button>
                <span style={{ font: '700 13px Inter,sans-serif', color: '#fff', minWidth: 48, textAlign: 'center' }}>Uke {week}</span>
                <button onClick={() => changeWeek(1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', width: 30, height: 30, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Icon name="chevron_right" size={20} />
                </button>
              </div>
            </div>

            {/* streak hero */}
            <div style={{ margin: '-26px 20px 0', background: 'var(--celebrate)', borderRadius: 20, padding: '17px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', boxShadow: '0 8px 22px rgba(31,157,87,0.30)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 50, height: 50, borderRadius: 9999, background: 'rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 27 }}>🔥</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: "'Roboto Mono',monospace", fontWeight: 700, fontSize: 30 }}>{progress.streak || 0}</span>
                    <span style={{ font: '600 14px Inter,sans-serif', color: 'rgba(255,255,255,0.85)' }}>på rad</span>
                  </div>
                  <div style={{ font: '600 12px/16px Inter,sans-serif', color: 'rgba(255,255,255,0.8)', marginTop: 1 }}>{greeting}</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', paddingLeft: 14, borderLeft: '1px solid rgba(255,255,255,0.25)' }}>
                <div style={{ fontFamily: "'Roboto Mono',monospace", fontWeight: 700, fontSize: 20, color: '#fff' }}>{doneCount} / 2</div>
                <div style={{ font: '600 11px Inter,sans-serif', color: 'rgba(255,255,255,0.8)' }}>denne uka</div>
              </div>
            </div>

            {/* summer note */}
            <div style={{ margin: '16px 20px 0', background: 'var(--summer-bg)', border: '1px solid var(--summer-border)', borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 13 }}>
              <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>☀️</div>
              <div>
                <div style={{ font: '700 14px Inter,sans-serif', color: 'var(--driv-blue)' }}>{summerTitle}</div>
                <div style={{ font: '400 13px/19px Inter,sans-serif', color: 'var(--text-muted)', marginTop: 3 }}>{summerBody}</div>
              </div>
            </div>

            {/* sessions */}
            <div style={{ padding: '0 20px', marginTop: 24 }}>
              <div style={{ font: '700 11px Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-label)', marginBottom: 12 }}>Øktene denne uka</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sessionCards.map(s => (
                  <button key={s.id} onClick={() => openSession(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left', background: '#fff', border: '1px solid var(--border)', borderRadius: 18, padding: 14, cursor: 'pointer', boxShadow: '0 2px 12px rgba(66,64,61,0.06)' }}>
                    <div style={{ flexShrink: 0, width: 58, height: 58, borderRadius: 16, background: s.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{s.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: '700 10px Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-label)' }}>{s.label}</div>
                      <div style={{ font: '700 17px/22px Inter,sans-serif', color: 'var(--driv-blue)', marginTop: 3 }}>{s.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5, color: 'var(--text-muted)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: '500 12px Inter,sans-serif' }}><Icon name="schedule" size={15} />{s.dur}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: '500 12px Inter,sans-serif' }}><Icon name="format_list_numbered" size={15} />{s.stepsCount} øvelser</span>
                      </div>
                    </div>
                    {s.done ? (
                      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, background: 'var(--green-bg)', color: 'var(--green-text)', borderRadius: 9999, padding: '6px 11px 6px 8px', font: '600 12px Inter,sans-serif' }}>
                        <Icon name="check_circle" size={18} />Gjort
                      </div>
                    ) : (
                      <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 9999, background: 'var(--driv-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Icon name="play_arrow" size={23} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* badges */}
            <div style={{ marginTop: 26 }}>
              <div style={{ font: '700 11px Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-label)', padding: '0 20px', marginBottom: 12 }}>Merker du har samlet</div>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '2px 20px 6px' }}>
                {badges.map(b => (
                  <div key={b.name} style={{ flexShrink: 0, width: 76, textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 9999, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: b.bg, border: `1px solid ${b.border}`, fontSize: 29, filter: b.filter }}>{b.icon}</div>
                    <div style={{ font: '600 11px/14px Inter,sans-serif', color: b.labelColor, marginTop: 7 }}>{b.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* records */}
            <div style={{ margin: '24px 20px 0' }}>
              <div style={{ font: '700 11px Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-label)', marginBottom: 12 }}>Dine rekorder</div>
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 6, display: 'flex' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 11, padding: 12 }}>
                  <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 12, background: 'var(--driv-blue-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚽</div>
                  <div>
                    <div style={{ fontFamily: "'Roboto Mono',monospace", fontWeight: 700, fontSize: 22, color: 'var(--driv-blue)', lineHeight: 1 }}>{progress.pb?.touches || '–'}</div>
                    <div style={{ font: '500 11px Inter,sans-serif', color: 'var(--text-muted)', marginTop: 3 }}>Berøringer / min</div>
                  </div>
                </div>
                <div style={{ width: 1, background: 'var(--hairline)', margin: '8px 0' }} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 11, padding: 12 }}>
                  <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 12, background: '#fbe3e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎯</div>
                  <div>
                    <div style={{ fontFamily: "'Roboto Mono',monospace", fontWeight: 700, fontSize: 22, color: 'var(--driv-blue)', lineHeight: 1 }}>
                      {progress.pb?.targets || '–'}<span style={{ fontSize: 13, color: 'var(--text-label)' }}> / 10</span>
                    </div>
                    <div style={{ font: '500 11px Inter,sans-serif', color: 'var(--text-muted)', marginTop: 3 }}>Treff på mål</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SESSION PLAYER ═══ */}
        {view === 'session' && (
          <div style={{ minHeight: '100vh', background: 'var(--driv-blue)', color: '#fff', display: 'flex', flexDirection: 'column' }}>

            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'calc(18px + env(safe-area-inset-top)) 18px 10px' }}>
              <button onClick={goBack} style={{ border: 'none', background: 'rgba(255,255,255,0.08)', cursor: 'pointer', width: 38, height: 38, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Icon name="arrow_back" size={22} />
              </button>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ font: '700 10px Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>{sess?.kind}</div>
                <div style={{ font: '600 14px Inter,sans-serif', marginTop: 2 }}>Steg {stepIndex + 1} av {sess?.steps.length}</div>
              </div>
              <button onClick={closePlayer} style={{ border: 'none', background: 'rgba(255,255,255,0.08)', cursor: 'pointer', width: 38, height: 38, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Icon name="close" size={22} />
              </button>
            </div>

            {/* progress bar */}
            <div style={{ height: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 9999, margin: '6px 20px 0' }}>
              <div style={{ height: '100%', width: progressPct, background: 'var(--green)', borderRadius: 9999, transition: 'width 0.35s ease' }} />
            </div>

            {/* scrollable body */}
            <div style={{ flex: 1, padding: '24px 20px 12px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>
              <div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{step?.name}</div>
                <div style={{ font: '400 15px/22px Inter,sans-serif', color: 'rgba(255,255,255,0.72)', marginTop: 6 }}>{step?.detail}</div>
              </div>

              {/* video links */}
              {step?.videos?.length > 0 && (
                <div>
                  <div style={{ font: '700 10px Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 9 }}>🎬 Se hvordan</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {step.videos.map((v, i) => (
                      <button key={i} onClick={() => setVideoModal(v.embed)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, cursor: 'pointer', padding: '9px 14px', borderRadius: 9999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.24)', color: '#fff', font: '600 13px Inter,sans-serif' }}>
                        🎬 {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* timer (used for timer steps and challenge steps that have a timer) */}
              {(step?.type === 'timer' || (step?.type === 'challenge' && total > 0)) && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, padding: '4px 0' }}>
                  <div style={{ position: 'relative', width: 172, height: 172 }}>
                    <svg width="172" height="172" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#43c878" strokeWidth="9" strokeLinecap="round" strokeDasharray="326.73" strokeDashoffset={timerOffset} style={{ transition: 'stroke-dashoffset 1s linear' }} />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontFamily: "'Roboto Mono',monospace", fontWeight: 700, fontSize: 38, letterSpacing: '-0.02em' }}>{fmt(timerLeft)}</div>
                      <div style={{ font: '500 12px Inter,sans-serif', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                        {timerDone ? 'Ferdig!' : timerRunning ? 'Holder på …' : 'Trykk start'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={startOrPause} style={{ border: 'none', cursor: 'pointer', background: 'var(--green)', color: '#0c3a20', font: '700 15px Inter,sans-serif', padding: '12px 26px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Icon name="timer" size={20} />
                      {timerRunning ? 'Pause' : timerDone ? 'Start på nytt' : 'Start'}
                    </button>
                    <button onClick={resetTimer} style={{ border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer', background: 'rgba(255,255,255,0.08)', color: '#fff', font: '600 15px Inter,sans-serif', padding: '12px 20px', borderRadius: 9999 }}>Nullstill</button>
                  </div>
                </div>
              )}

              {/* checklist */}
              {step?.type === 'checklist' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {checklistItems.map(item => (
                    <div key={item.idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 4px 15px', borderRadius: 13, background: item.checked ? 'rgba(67,200,120,0.18)' : 'rgba(255,255,255,0.05)', border: `1px solid ${item.checked ? 'rgba(67,200,120,0.55)' : 'rgba(255,255,255,0.13)'}` }}>
                      <button onClick={() => toggleCheck(item.idx)} style={{ display: 'flex', alignItems: 'center', gap: 13, flex: 1, textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: '9px 0' }}>
                        <Icon name={item.checked ? 'check_circle' : 'radio_button_unchecked'} size={24} style={{ color: item.checked ? 'var(--green)' : 'rgba(255,255,255,0.4)' }} />
                        <span style={{ font: '600 15px/20px Inter,sans-serif', color: item.checked ? '#fff' : 'rgba(255,255,255,0.85)' }}>{item.label}</span>
                      </button>
                      {item.img && (
                        <button onClick={() => setImageModal(item.img)} style={{ flexShrink: 0, width: 42, height: 52, padding: 0, borderRadius: 9, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)' }}>
                          <img src={item.img} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* challenge counter */}
              {isChallenge && (
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 18, padding: 20, textAlign: 'center' }}>
                  <div style={{ font: '600 14px Inter,sans-serif', color: 'rgba(255,255,255,0.78)' }}>{step.prompt}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, margin: '14px 0 6px' }}>
                    <button onClick={() => setChallengeVal(v => Math.max(0, v - 1))} style={{ border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.08)', cursor: 'pointer', width: 54, height: 54, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Icon name="remove" size={26} />
                    </button>
                    <div style={{ fontFamily: "'Roboto Mono',monospace", fontWeight: 700, fontSize: 56, color: 'var(--accent)', minWidth: 96, lineHeight: 1 }}>{challengeVal}</div>
                    <button onClick={() => setChallengeVal(v => v + 1)} style={{ border: 'none', background: 'var(--accent)', cursor: 'pointer', width: 54, height: 54, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)' }}>
                      <Icon name="add" size={26} />
                    </button>
                  </div>
                  <div style={{ font: '500 13px Inter,sans-serif', color: 'rgba(255,255,255,0.6)' }}>{step.unit}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, background: 'rgba(255,164,36,0.18)', color: '#ffd485', borderRadius: 9999, padding: '6px 13px', font: '600 13px Inter,sans-serif' }}>
                    🏆 Din rekord: {progress.pb?.[step.pbKey] || '–'}
                  </div>
                </div>
              )}

              {/* plain do */}
              {step?.type === 'do' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '10px 0' }}>
                  <div style={{ width: 128, height: 128, borderRadius: 9999, background: 'rgba(255,164,36,0.16)', border: '2px solid rgba(255,164,36,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>{sess?.icon || '⚽'}</div>
                  <div style={{ font: '400 14px/20px Inter,sans-serif', color: 'rgba(255,255,255,0.65)', textAlign: 'center', maxWidth: 260 }}>Gjør øvelsen i ditt eget tempo, og trykk «Ferdig» når du er klar.</div>
                </div>
              )}

              {/* tips */}
              {step?.bullets?.length > 0 && (
                <div>
                  <div style={{ font: '700 10px Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 9 }}>Slik gjør du</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {step.bullets.map((b, i) => (
                      <span key={i} style={{ padding: '8px 13px', borderRadius: 9999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.16)', font: '500 13px Inter,sans-serif', color: 'rgba(255,255,255,0.9)' }}>{b}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green)', font: '600 14px Inter,sans-serif', marginTop: 2 }}>
                ✨ {CHEERS[stepIndex % CHEERS.length]}
              </div>
            </div>

            {/* sticky footer */}
            <div style={{ position: 'sticky', bottom: 0, background: 'var(--driv-blue)', borderTop: '1px solid rgba(255,255,255,0.12)', padding: '14px 20px calc(22px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={handleNext} style={{ border: 'none', cursor: 'pointer', background: 'var(--driv-red)', color: '#fff', font: '700 17px Inter,sans-serif', padding: 16, borderRadius: 14, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {isLast ? (isChallenge ? 'Lagre og fullfør' : 'Fullfør økt') : 'Neste øvelse'}
                <Icon name="arrow_forward" size={21} />
              </button>
              <button onClick={handleNext} style={{ border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,0.55)', font: '600 14px Inter,sans-serif', padding: 6 }}>Hopp over</button>
            </div>

            {/* video modal */}
            {videoModal && (
              <div onClick={() => setVideoModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'var(--scrim)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <div style={{ width: '100%', maxWidth: 390, display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                  <button onClick={() => setVideoModal(null)} style={{ border: 'none', background: 'rgba(255,255,255,0.14)', cursor: 'pointer', width: 40, height: 40, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Icon name="close" size={24} />
                  </button>
                </div>
                <div style={{ width: '100%', maxWidth: 390, aspectRatio: '9/16', maxHeight: '74vh', borderRadius: 18, overflow: 'hidden', background: '#000', boxShadow: '0 12px 48px rgba(0,0,0,0.5)' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${videoModal}?autoplay=1&playsinline=1&rel=0`}
                    title="Øvelsesvideo"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
                  />
                </div>
              </div>
            )}

            {/* image modal */}
            {imageModal && (
              <div onClick={() => setImageModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'var(--scrim)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <div style={{ width: '100%', maxWidth: 420, display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                  <button onClick={() => setImageModal(null)} style={{ border: 'none', background: 'rgba(255,255,255,0.14)', cursor: 'pointer', width: 40, height: 40, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Icon name="close" size={24} />
                  </button>
                </div>
                <img src={imageModal} alt="Øvelse" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 18, objectFit: 'contain', boxShadow: '0 12px 48px rgba(0,0,0,0.5)' }} />
              </div>
            )}
          </div>
        )}

        {/* ═══ DONE SCREEN ═══ */}
        {view === 'done' && (() => {
          const ld = lastDone || {};
          return (
            <div style={{ minHeight: '100vh', background: 'var(--accent)', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'calc(36px + env(safe-area-inset-top)) 26px calc(36px + env(safe-area-inset-bottom))', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              {/* confetti */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {[
                  { l: '8%',  w: 9,  h: 14, r: 2,      bg: '#fff',    d: '0s',   dur: '2.6s' },
                  { l: '20%', w: 8,  h: 8,  r: '50%',  bg: 'var(--driv-red)', d: '0.4s', dur: '3.1s' },
                  { l: '33%', w: 10, h: 16, r: 2,      bg: 'var(--driv-blue)', d: '0.9s', dur: '2.9s' },
                  { l: '46%', w: 8,  h: 8,  r: '50%',  bg: '#fff',    d: '0.2s', dur: '3.3s' },
                  { l: '58%', w: 9,  h: 14, r: 2,      bg: '#ffd23f', d: '1.1s', dur: '2.7s' },
                  { l: '70%', w: 8,  h: 8,  r: '50%',  bg: 'var(--driv-red)', d: '0.6s', dur: '3.0s' },
                  { l: '82%', w: 10, h: 15, r: 2,      bg: 'var(--driv-blue)', d: '0.1s', dur: '2.8s' },
                  { l: '92%', w: 8,  h: 8,  r: '50%',  bg: '#fff',    d: '0.8s', dur: '3.2s' },
                  { l: '14%', w: 8,  h: 12, r: 2,      bg: '#ffd23f', d: '1.4s', dur: '3.0s' },
                  { l: '64%', w: 8,  h: 12, r: 2,      bg: '#fff',    d: '1.7s', dur: '2.9s' },
                ].map((c, i) => (
                  <span key={i} style={{ position: 'absolute', left: c.l, top: 0, width: c.w, height: c.h, background: c.bg, borderRadius: c.r, animation: `j13fall ${c.dur} ease-in ${c.d} infinite` }} />
                ))}
              </div>

              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 104, height: 104, borderRadius: 9999, background: 'var(--text-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, boxShadow: '0 6px 20px rgba(0,0,0,0.15)', animation: 'j13pop 0.5s ease-out both' }}>🏆</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 40, lineHeight: 1, color: 'var(--text-dark)', marginTop: 18, letterSpacing: '-0.02em' }}>{ld.headline || 'Bra jobba!'}</div>
                <div style={{ font: '500 16px/22px Inter,sans-serif', color: 'var(--text-dark)', opacity: 0.9, marginTop: 8, maxWidth: 280 }}>Du fullførte «{ld.title}»</div>

                <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
                  <div style={{ background: '#fff', borderRadius: 16, padding: '14px 20px', minWidth: 104 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                      <span style={{ fontSize: 20 }}>🔥</span>
                      <span style={{ fontFamily: "'Roboto Mono',monospace", fontWeight: 700, fontSize: 26, color: 'var(--driv-blue)' }}>{ld.streak}</span>
                    </div>
                    <div style={{ font: '600 11px Inter,sans-serif', color: 'var(--text-muted)', marginTop: 4 }}>økter på rad</div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: 16, padding: '14px 20px', minWidth: 104, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 24 }}>✅</span>
                    <div style={{ font: '600 11px Inter,sans-serif', color: 'var(--text-muted)', marginTop: 5 }}>{ld.kind}</div>
                  </div>
                </div>

                {ld.record && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 16, background: 'var(--text-dark)', color: '#fff', borderRadius: 9999, padding: '9px 16px', font: '700 14px Inter,sans-serif', animation: 'j13pulse 1.6s ease-in-out infinite' }}>
                    📈 {ld.recordText}
                  </div>
                )}

                {ld.newBadge && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14, background: 'rgba(255,255,255,0.2)', color: 'var(--text-dark)', border: '1px dashed rgba(23,0,30,0.35)', borderRadius: 9999, padding: '9px 16px', font: '600 14px Inter,sans-serif' }}>
                    🏅 Nytt merke: {ld.newBadge}
                  </div>
                )}

                <button onClick={() => setView('home')} style={{ border: 'none', cursor: 'pointer', background: 'var(--text-dark)', color: '#fff', font: '700 16px Inter,sans-serif', padding: '15px 30px', borderRadius: 14, marginTop: 30 }}>
                  Tilbake til uka
                </button>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
