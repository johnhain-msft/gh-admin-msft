/* ================================================================================================
   gh-admin-msft teaching deck — runtime
   One document, two surfaces. `#/<slide-id>` is the presentation; `#/speaker` is the speaker window.
   The two stay in sync through BroadcastChannel (same origin) with a localStorage fallback. The
   speaker window can drive the deck (prev/next/goto); the deck answers with its state.
   Nothing from the script is rendered on the presentation surface.
   ================================================================================================ */
(() => {
  'use strict';
  const DATA = JSON.parse(document.getElementById('deck-data').textContent);
  const SLIDES = DATA.slides;
  const byId = new Map(SLIDES.map((s) => [s.id, s]));
  const CHANNEL = 'gh-admin-deck';
  const LS_STATE = 'gh-admin-deck:state';
  const LS_TIMER = 'gh-admin-deck:timer';
  const LS_THEME = 'gh-admin-deck:theme';
  const LS_NOTES = 'gh-admin-deck:notes-size';
  const LS_TZ = 'gh-admin-deck:tz';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const live = $('#live');
  const announce = (t) => { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 30); };
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const pad = (n) => String(n).padStart(2, '0');

  // ---------------------------------------------------------------- theme
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(LS_THEME, t); } catch {}
  }
  function initTheme() {
    let t = null;
    try { t = localStorage.getItem(LS_THEME); } catch {}
    if (!t) t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    applyTheme(t);
  }
  const toggleTheme = () => applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

  // ---------------------------------------------------------------- transport
  // Three transports, used together: postMessage between the deck and the window it opened (works even
  // from file:// where each page is its own opaque origin), BroadcastChannel for same-origin windows,
  // and a localStorage write whose `storage` event reaches other same-origin windows.
  const bc = typeof BroadcastChannel === 'function' ? new BroadcastChannel(CHANNEL) : null;
  const listeners = new Set();
  let peer = null; // the other surface's window handle, when we have one
  let lastSeen = 0;
  function deliver(m) {
    if (!m || m.__deck !== CHANNEL) return;
    const key = `${m.type}:${m.ts}:${m.id || ''}:${m.frag || ''}`;
    if (key === deliver.last) return; // the same message can arrive on two transports
    deliver.last = key;
    lastSeen = Date.now();
    listeners.forEach((fn) => fn(m));
  }
  function send(msg) {
    const payload = { ...msg, __deck: CHANNEL, ts: Date.now() };
    if (peer && !peer.closed) { try { peer.postMessage(payload, '*'); } catch {} }
    if (bc) bc.postMessage(payload);
    try { localStorage.setItem(`${CHANNEL}:msg`, JSON.stringify(payload)); } catch {}
  }
  function onMessage(fn) { listeners.add(fn); }
  if (bc) bc.onmessage = (e) => deliver(e.data);
  window.addEventListener('storage', (e) => {
    if (e.key === `${CHANNEL}:msg` && e.newValue) {
      try { deliver(JSON.parse(e.newValue)); } catch {}
    }
  });
  window.addEventListener('message', (e) => {
    if (e.data && e.data.__deck === CHANNEL) {
      if (e.source && e.source !== window) peer = e.source; // adopt whoever talks to us
      deliver(e.data);
    }
  });

  // ---------------------------------------------------------------- shared timer (both surfaces)
  function readTimer() {
    try { return JSON.parse(localStorage.getItem(LS_TIMER) || 'null') || { startedAt: null, accumulated: 0, running: false }; }
    catch { return { startedAt: null, accumulated: 0, running: false }; }
  }
  function writeTimer(t) { try { localStorage.setItem(LS_TIMER, JSON.stringify(t)); } catch {} send({ type: 'timer', timer: t }); }
  function elapsedMs(t) { return t.accumulated + (t.running && t.startedAt ? Date.now() - t.startedAt : 0); }
  function fmtElapsed(ms) { const s = Math.floor(ms / 1000); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return (h ? `${h}:` : '') + `${pad(m)}:${pad(s % 60)}`; }

  // ---------------------------------------------------------------- routing
  function route() {
    const h = decodeURIComponent(window.location.hash || '');
    const m = h.match(/^#\/([^/]+)(?:\/(\d+))?/);
    if (!m) return { kind: 'slide', id: SLIDES[0]?.id, frag: 0 };
    if (m[1] === 'speaker') return { kind: 'speaker' };
    if (byId.has(m[1])) return { kind: 'slide', id: m[1], frag: Number(m[2] || 0) };
    const n = Number(m[1]);
    if (Number.isInteger(n) && SLIDES[n - 1]) return { kind: 'slide', id: SLIDES[n - 1].id, frag: 0 };
    return { kind: 'slide', id: SLIDES[0]?.id, frag: 0, unknown: m[1] };
  }

  // ---------------------------------------------------------------- slide DOM
  function slideElement(s, { preview = false } = {}) {
    const el = document.createElement('section');
    el.className = `slide layout-${s.layout || 'default'}`;
    el.dataset.id = s.id;
    el.setAttribute('aria-roledescription', 'slide');
    el.setAttribute('aria-label', `Slide ${s.n}: ${s.title || s.id}`);
    const kicker = s.kicker || s.section;
    const inner = [];
    if (kicker && !['title', 'break'].includes(s.layout)) inner.push(`<div class="slide-kicker">${escapeHtml(kicker)}</div>`);
    if (s.title) inner.push(`<h1>${s.titleHtml}</h1>`);
    if (s.layout === 'lab') {
      inner.push(`<div class="slide-body">${s.html}</div>`);
    } else {
      inner.push(`<div class="slide-body">${s.html}</div>`);
    }
    if (s.layout === 'title') inner.push('<div class="glyph" aria-hidden="true"></div><div class="glyph2" aria-hidden="true"></div>');
    el.innerHTML = inner.join('');
    if (preview) el.classList.add('active');
    return el;
  }
  function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // ---------------------------------------------------------------- interactions inside slides
  function mountInteractions(root, { interactive = true } = {}) {
    // quiz
    $$('.quiz', root).forEach((q) => {
      const answer = q.dataset.answer;
      const expl = $('.quiz-expl', q);
      $$('.quiz-option', q).forEach((b) => {
        if (!interactive) { b.disabled = true; return; }
        b.addEventListener('click', () => {
          $$('.quiz-option', q).forEach((x) => { x.classList.remove('is-wrong'); x.classList.toggle('is-correct', x.dataset.key === answer); x.setAttribute('aria-pressed', String(x === b)); });
          if (b.dataset.key !== answer) b.classList.add('is-wrong');
          expl.hidden = false;
          announce(b.dataset.key === answer ? 'Correct.' : `Not quite. The answer is ${answer}.`);
        });
      });
    });
    // highlight groups in diagrams
    $$('.diagram', root).forEach((fig) => {
      const nodes = $$('[data-hl]', fig);
      if (!nodes.length) return;
      const clear = () => { fig.classList.remove('has-focus'); nodes.forEach((n) => n.classList.remove('is-hl')); };
      nodes.forEach((n) => {
        n.setAttribute('tabindex', '0');
        const on = () => { fig.classList.add('has-focus'); const g = n.dataset.hl; nodes.forEach((x) => x.classList.toggle('is-hl', x.dataset.hl === g)); };
        n.addEventListener('mouseenter', on); n.addEventListener('focus', on);
        n.addEventListener('mouseleave', clear); n.addEventListener('blur', clear);
      });
    });
    // base permissions grid
    $$('[data-bp]', root).forEach((grid) => {
      const buttons = $$('[data-base]', grid);
      const cells = $$('[data-cell]', grid);
      const note = $('[data-bp-note]', grid);
      const rules = {
        none:  { public: 'full', internal: 'full', private: 'partial', text: 'No permission: members reach private repositories only through a team, direct access or an organization role. Internal and public stay readable. This is the usual enterprise setup.' },
        read:  { public: 'full', internal: 'full', private: 'full', text: 'Read: every member can read every repository the organization owns, including private ones. Pushing still needs a team or direct access.' },
        write: { public: 'full', internal: 'full', private: 'full', text: 'Write or Admin: every member can push to, or administer, every repository. Almost never what an enterprise wants.' },
      };
      const icons = { full: '●', partial: '◌', none: '○' };
      const apply = (base) => {
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.base === base)));
        cells.forEach((c) => {
          const vis = c.dataset.cell;
          const state = rules[base][vis];
          c.className = `bp-cell bp-${state}`;
          $('.bp-icon', c).textContent = icons[state];
          $('.bp-text', c).textContent = state === 'full' ? 'Every member' : state === 'partial' ? 'Team, direct access or role' : 'No access';
        });
        if (note) note.textContent = rules[base].text;
      };
      buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.base)));
      apply(grid.dataset.bp || 'none');
      if (!interactive) buttons.forEach((b) => { b.disabled = true; });
    });
    // decision tree
    $$('[data-decision]', root).forEach((tree) => {
      let steps;
      try { steps = JSON.parse($('script[type="application/json"]', tree).textContent); } catch { return; }
      const qEl = $('[data-dq]', tree);
      const actions = $('[data-dactions]', tree);
      const path = $('[data-dpath]', tree);
      const render = (key, trail) => {
        const node = steps[key];
        path.innerHTML = trail.map((t, i) => `<li class="${i === trail.length - 1 ? 'is-current' : ''}">${escapeHtml(t)}</li>`).join('');
        if (node.result) {
          qEl.innerHTML = `<div class="decision-result">${escapeHtml(node.result)}<small>${escapeHtml(node.why || '')}</small></div>`;
          actions.innerHTML = `<button type="button" class="btn" data-reset>Start over</button>`;
        } else {
          qEl.innerHTML = `<h3>${escapeHtml(node.q)}</h3><p class="muted">${escapeHtml(node.hint || '')}</p>`;
          actions.innerHTML = `<button type="button" class="btn" data-go="${node.yes}" data-say="Yes">Yes</button><button type="button" class="btn" data-go="${node.no}" data-say="No">No</button><button type="button" class="btn" data-reset>Start over</button>`;
        }
        $$('button', actions).forEach((b) => {
          if (b.dataset.reset !== undefined) b.addEventListener('click', () => render('start', [steps.start.q]));
          else b.addEventListener('click', () => { const next = steps[b.dataset.go]; render(b.dataset.go, [...trail.slice(0, -1), `${trail[trail.length - 1]} → ${b.dataset.say}`, next.q || next.result]); });
          if (!interactive) b.disabled = true;
        });
      };
      render('start', [steps.start.q]);
    });
  }

  // ================================================================ PRESENTATION SURFACE
  function mountPresentation() {
    const root = $('#presentation');
    root.hidden = false;
    document.title = DATA.title;
    const stage = $('#stage');
    const deck = $('#deck');
    const els = new Map();
    for (const s of SLIDES) {
      const el = slideElement(s);
      els.set(s.id, el);
      stage.appendChild(el);
    }
    mountInteractions(stage);
    $('#day-badge').textContent = '';

    let currentId = null;
    let frag = 0;
    let typed = '';

    function fragmentsOf(id) { return $$('.fragment', els.get(id)); }
    function applyFragments(id, n) {
      fragmentsOf(id).forEach((f, i) => f.classList.toggle('visible', i < n));
    }
    function show(id, n = 0, { push = true, announceIt = true } = {}) {
      if (!byId.has(id)) return;
      const s = byId.get(id);
      const frags = fragmentsOf(id);
      frag = clamp(n, 0, frags.length);
      if (currentId !== id) {
        if (currentId) els.get(currentId)?.classList.remove('active');
        currentId = id;
        els.get(id).classList.add('active');
      }
      applyFragments(id, frag);
      $('#kicker-section').textContent = s.section || '';
      const lab = $('#lab-badge');
      if (s.lab) { lab.hidden = false; lab.textContent = `🧪 Lab ${s.lab}`; } else lab.hidden = true;
      $('#day-badge').textContent = s.day ? `Day ${s.day}` : '';
      $('#counter').textContent = `${s.n} / ${SLIDES.length}`;
      $('#progress-bar').style.width = `${((s.n - 1) / Math.max(1, SLIDES.length - 1)) * 100}%`;
      document.title = `${s.n}. ${s.title || s.id} — ${DATA.title}`;
      const hash = `#/${id}${frag ? '/' + frag : ''}`;
      if (push && window.location.hash !== hash) history.replaceState(null, '', hash);
      if (announceIt) announce(`Slide ${s.n} of ${SLIDES.length}: ${s.title || s.id}`);
      broadcastState();
    }
    function broadcastState() {
      if (!currentId) return;
      const s = byId.get(currentId);
      const state = { type: 'state', id: currentId, frag, n: s.n, total: SLIDES.length, fragTotal: fragmentsOf(currentId).length };
      try { localStorage.setItem(LS_STATE, JSON.stringify(state)); } catch {}
      send(state);
    }
    function next() {
      const frags = fragmentsOf(currentId);
      if (frag < frags.length) { show(currentId, frag + 1); return; }
      const i = byId.get(currentId).n; // n is 1-based, so SLIDES[i] is the next
      if (SLIDES[i]) show(SLIDES[i].id, 0);
    }
    function prev() {
      if (frag > 0) { show(currentId, frag - 1); return; }
      const i = byId.get(currentId).n - 2;
      if (SLIDES[i]) show(SLIDES[i].id, fragmentsOf(SLIDES[i].id).length);
    }

    // scale stage to the deck area
    function fit() {
      const r = deck.getBoundingClientRect();
      const scale = Math.min(r.width / 1920, r.height / 1080);
      stage.style.setProperty('--scale', String(scale));
    }
    new ResizeObserver(fit).observe(deck);
    fit();

    // overlays
    const dlgHelp = $('#dlg-help');
    const dlgGrid = $('#dlg-grid');
    const dlgAgenda = $('#dlg-agenda');
    function openGrid() {
      const grid = $('#grid');
      grid.innerHTML = SLIDES.map((s) => `<button type="button" class="grid-item${s.id === currentId ? ' is-current' : ''}" data-go="${s.id}"><span class="gi-n">${s.n} · Day ${s.day}</span><span class="gi-t">${escapeHtml(s.title || s.id)}</span><span class="gi-s">${escapeHtml(s.section || '')}</span>${s.lab ? `<span class="gi-lab">🧪 Lab ${escapeHtml(s.lab)}</span>` : ''}</button>`).join('');
      $$('.grid-item', grid).forEach((b) => b.addEventListener('click', () => { dlgGrid.close(); show(b.dataset.go, 0); }));
      dlgGrid.showModal();
      $('.is-current', grid)?.focus();
    }
    function openAgenda() {
      renderAgenda(dlgAgenda, { currentId, onGo: (id) => { dlgAgenda.close(); show(id, 0); } });
      dlgAgenda.showModal();
      // focus the day tab, not the time-zone select, so the key that opened the dialog cannot type-ahead into it
      $('#agenda-tabs button[aria-selected="true"]')?.focus();
    }
    function closeDialogs() { [dlgHelp, dlgGrid, dlgAgenda].forEach((d) => d.open && d.close()); }

    // speaker window
    let speakerWin = null;
    function openSpeaker() {
      const url = window.location.href.split('#')[0] + '#/speaker';
      speakerWin = window.open(url, 'gh-admin-deck-speaker', 'width=1280,height=800');
      if (!speakerWin) { announce('The browser blocked the speaker window. Allow pop-ups for this page and press S again.'); return; }
      peer = speakerWin;
      setTimeout(broadcastState, 400);
      setTimeout(broadcastState, 1200);
    }
    // fullscreen
    async function present() {
      try {
        if (!document.fullscreenElement) { await document.documentElement.requestFullscreen(); }
        else await document.exitFullscreen();
      } catch { announce('Fullscreen is not available here. Use the browser\'s own fullscreen (F11).'); }
    }
    document.addEventListener('fullscreenchange', () => { document.body.classList.toggle('presenting', !!document.fullscreenElement); fit(); });
    // blackout
    const blackout = $('#blackout');
    const toggleBlackout = () => { blackout.hidden = !blackout.hidden; };

    // keyboard
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target && e.target.tagName) || '';
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) return;
      const anyOpen = [dlgHelp, dlgGrid, dlgAgenda].some((d) => d.open);
      if (anyOpen) {
        // the key that opened an overlay closes it again, so a presenter never needs Esc (Esc also leaves fullscreen in every browser)
        const k = e.key.toLowerCase();
        if (e.key === 'Escape' || (k === 'g' && dlgGrid.open) || (k === 'a' && dlgAgenda.open) || ((e.key === '?' || e.key === '/') && dlgHelp.open)) { e.preventDefault(); closeDialogs(); }
        return;
      }
      if (e.target && e.target.closest && e.target.closest('.quiz, [data-decision], [data-bp]') && ['Enter', ' '].includes(e.key)) return;
      switch (e.key) {
        case 'ArrowRight': case ' ': case 'PageDown': case 'ArrowDown': e.preventDefault(); next(); break;
        case 'ArrowLeft': case 'PageUp': case 'ArrowUp': e.preventDefault(); prev(); break;
        case 'Home': e.preventDefault(); show(SLIDES[0].id, 0); break;
        case 'End': e.preventDefault(); show(SLIDES[SLIDES.length - 1].id, 0); break;
        case 'g': case 'G': openGrid(); break;
        case 'a': case 'A': openAgenda(); break;
        case 's': case 'S': openSpeaker(); break;
        case 'f': case 'F': present(); break;
        case 'b': case 'B': case '.': toggleBlackout(); break;
        case 't': case 'T': toggleTheme(); break;
        case 'p': case 'P': window.print(); break;
        case '?': case '/': dlgHelp.showModal(); break;
        case 'Escape': if (!blackout.hidden) toggleBlackout(); break;
        case 'Enter': if (typed) { const n = Number(typed); typed = ''; if (SLIDES[n - 1]) show(SLIDES[n - 1].id, 0); } break;
        default:
          if (/^\d$/.test(e.key)) { typed = (typed + e.key).slice(-3); setTimeout(() => { typed = ''; }, 2500); }
      }
    });
    $('#btn-prev').addEventListener('click', prev);
    $('#btn-next').addEventListener('click', next);
    $('#btn-agenda').addEventListener('click', openAgenda);
    $('#btn-grid').addEventListener('click', openGrid);
    $('#btn-speaker').addEventListener('click', openSpeaker);
    $('#btn-theme').addEventListener('click', toggleTheme);
    $('#btn-fullscreen').addEventListener('click', present);
    $('#btn-help').addEventListener('click', () => dlgHelp.showModal());
    // click right/left thirds of the stage to advance when presenting (touch friendly)
    deck.addEventListener('click', (e) => {
      if (!document.fullscreenElement) return;
      if (e.target.closest('button, a, .quiz, [data-decision], [data-bp], [data-hl]')) return;
      const r = deck.getBoundingClientRect();
      if (e.clientX - r.left > r.width * 0.5) next(); else prev();
    });
    // messages from the speaker window
    onMessage((m) => {
      if (m.type === 'hello') broadcastState();
      else if (m.type === 'next') next();
      else if (m.type === 'prev') prev();
      else if (m.type === 'goto' && byId.has(m.id)) show(m.id, m.frag || 0);
    });
    window.addEventListener('hashchange', () => {
      const r = route();
      if (r.kind === 'speaker') { window.location.reload(); return; }
      if (r.id !== currentId || r.frag !== frag) show(r.id, r.frag, { push: false });
    });
    // print mode: reveal everything
    window.addEventListener('beforeprint', () => document.body.classList.add('print'));
    window.addEventListener('afterprint', () => document.body.classList.remove('print'));

    const r = route();
    show(r.id, r.frag, { announceIt: false });
    if (r.unknown) announce(`Unknown slide "${r.unknown}". Showing the first slide.`);
    deck.focus();
  }

  // ---------------------------------------------------------------- agenda rendering (shared)
  const TZ_CHOICES = [
    ['America/New_York', 'Eastern (US)'], ['America/Chicago', 'Central (US)'], ['America/Denver', 'Mountain (US)'],
    ['America/Los_Angeles', 'Pacific (US)'], ['America/Phoenix', 'Arizona'], ['America/Anchorage', 'Alaska'], ['Pacific/Honolulu', 'Hawaii'],
    ['America/Toronto', 'Toronto'], ['America/Sao_Paulo', 'São Paulo'], ['Europe/London', 'London'], ['Europe/Dublin', 'Dublin'],
    ['Europe/Paris', 'Paris / Berlin'], ['Europe/Madrid', 'Madrid'], ['Europe/Warsaw', 'Warsaw'], ['Asia/Kolkata', 'India'],
    ['Asia/Singapore', 'Singapore'], ['Asia/Tokyo', 'Tokyo'], ['Australia/Sydney', 'Sydney'], ['UTC', 'UTC'],
  ];
  function tzOffsetMinutes(tz, date) {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]));
    const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    return Math.round((asUTC - date.getTime()) / 60000);
  }
  function convertWall(hhmm, dateStr, fromTz, toTz) {
    if (!fromTz || !toTz || fromTz === toTz) return hhmm;
    const [h, m] = hhmm.split(':').map(Number);
    const ref = new Date(`${dateStr || '2026-11-16'}T12:00:00Z`);
    const base = Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate(), h, m) - tzOffsetMinutes(fromTz, ref) * 60000;
    const target = new Date(base + tzOffsetMinutes(toTz, new Date(base)) * 60000);
    return `${pad(target.getUTCHours())}:${pad(target.getUTCMinutes())}`;
  }
  function renderAgenda(dlg, { currentId, onGo }) {
    const ag = DATA.agenda;
    if (!ag) { $('#agenda-body').innerHTML = '<p class="muted">No agenda in this build.</p>'; return; }
    const sel = $('#agenda-tz');
    let tz = ag.baseTz;
    try { tz = localStorage.getItem(LS_TZ) || ag.baseTz; } catch {}
    if (!sel.options.length) {
      const have = new Set();
      for (const [id, label] of [[ag.baseTz, `${ag.baseTzLabel || ag.baseTz} (workshop)`], ...TZ_CHOICES]) {
        if (have.has(id)) continue; have.add(id);
        const o = document.createElement('option'); o.value = id; o.textContent = label; sel.appendChild(o);
      }
      sel.addEventListener('change', () => { try { localStorage.setItem(LS_TZ, sel.value); } catch {} draw(sel.value); });
    }
    sel.value = tz;
    const tabs = $('#agenda-tabs');
    let dayIdx = Math.max(0, ag.days.findIndex((d) => d.blocks.some((b) => (b.slides || []).includes(currentId))));
    function draw(tzNow) {
      tabs.innerHTML = ag.days.map((d, i) => `<button type="button" role="tab" aria-selected="${i === dayIdx}">${escapeHtml(d.label || `Day ${d.day}`)}</button>`).join('');
      $$('button', tabs).forEach((b, i) => b.addEventListener('click', () => { dayIdx = i; draw(tzNow); }));
      const d = ag.days[dayIdx];
      const rows = d.blocks.map((b) => {
        const cur = (b.slides || []).includes(currentId);
        const icon = b.type === 'break' ? '☕' : b.type === 'lab' ? '🧪' : b.type === 'discussion' ? '💬' : '📖';
        const first = (b.slides || [])[0];
        return `<tr class="${cur ? 'is-current ' : ''}ag-${b.type}"><td class="ag-time">${convertWall(b.start, d.date, ag.baseTz, tzNow)}</td><td>${b.minutes} min</td><td>${icon} ${escapeHtml(b.title)}${b.detail ? `<div class="muted">${escapeHtml(b.detail)}</div>` : ''}</td><td>${first ? `<button type="button" class="ag-go" data-go="${first}">go</button>` : ''}</td></tr>`;
      }).join('');
      $('#agenda-body').innerHTML = `<p class="muted">${escapeHtml(d.title || '')}${d.date ? ` · ${d.date}` : ''} · times shown in ${escapeHtml(sel.options[sel.selectedIndex]?.textContent || tzNow)}</p><table class="agenda-table"><thead><tr><th>Start</th><th>Length</th><th>Block</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
      $$('.ag-go', $('#agenda-body')).forEach((b) => b.addEventListener('click', () => onGo && onGo(b.dataset.go)));
    }
    draw(tz);
  }

  // ================================================================ SPEAKER SURFACE
  function mountSpeaker() {
    const root = $('#speaker');
    root.hidden = false;
    document.title = `Speaker — ${DATA.title}`;
    $('#sp-deck-title').textContent = DATA.title;
    const cur = $('#sp-current');
    const nextWrap = $('#sp-next-preview');
    const notes = $('#sp-notes');
    const status = $('#sp-status');
    if (window.opener && window.opener !== window) peer = window.opener;
    let state = null;
    try { state = JSON.parse(localStorage.getItem(LS_STATE) || 'null'); } catch {}
    let notesSize = 22;
    try { notesSize = Number(localStorage.getItem(LS_NOTES)) || 22; } catch {}
    const applyNotesSize = () => { notes.style.setProperty('--notes-size', `${notesSize}px`); try { localStorage.setItem(LS_NOTES, String(notesSize)); } catch {} };
    applyNotesSize();

    function fitPreview() {
      for (const el of [cur, nextWrap]) {
        const w = el.parentElement.getBoundingClientRect().width;
        el.style.transform = `scale(${w / 1920})`;
      }
    }
    function blockFor(id) {
      const ag = DATA.agenda; if (!ag) return null;
      for (const d of ag.days) for (const b of d.blocks) if ((b.slides || []).includes(id)) return { day: d, block: b };
      return null;
    }
    function render(st) {
      if (!st || !byId.has(st.id)) { notes.innerHTML = '<p class="empty">Waiting for the deck. Open the deck in another window, or press Next here to start it.</p>'; return; }
      state = st;
      const s = byId.get(st.id);
      const nextS = SLIDES[s.n];
      cur.replaceChildren(slideElement(s, { preview: true }));
      $$('.fragment', cur).forEach((f, i) => f.classList.toggle('visible', i < (st.frag || 0)));
      mountInteractions(cur, { interactive: false });
      nextWrap.replaceChildren(nextS ? slideElement(nextS, { preview: true }) : Object.assign(document.createElement('div'), { className: 'muted', textContent: 'End of deck' }));
      if (nextS) mountInteractions(nextWrap, { interactive: false });
      $('#sp-slide-title').textContent = `${s.n}. ${s.title || s.id}`;
      $('#sp-counter').textContent = `${s.n} / ${SLIDES.length}${st.fragTotal ? ` · step ${st.frag}/${st.fragTotal}` : ''}`;
      $('#sp-words').textContent = s.words ? `${s.words} words · ~${Math.max(1, Math.round(s.words / 150))} min spoken · budget ${s.minutes || '—'} min` : '';
      notes.innerHTML = s.notes || '<p class="empty">No notes for this slide.</p>';
      notes.scrollTop = 0;
      const bf = blockFor(s.id);
      $('#sp-budget').textContent = bf ? `${bf.day.label || 'Day ' + bf.day.day} · ${bf.block.title} · ${bf.block.start} · ${bf.block.minutes} min block` : '';
      fitPreview();
    }
    // timer
    function tickTimer() {
      const t = readTimer();
      const el = $('#sp-elapsed');
      el.textContent = fmtElapsed(elapsedMs(t));
      $('#sp-timer-toggle').textContent = t.running ? 'Pause' : (t.accumulated ? 'Resume' : 'Start');
      $('#sp-time').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      // over budget? compare elapsed with the planned minutes up to and including the current slide of this day
      if (state && byId.has(state.id)) {
        const s = byId.get(state.id);
        const planned = SLIDES.filter((x) => x.day === s.day && x.n <= s.n).reduce((n, x) => n + x.minutes, 0);
        el.classList.toggle('over', planned > 0 && elapsedMs(t) > planned * 60000);
        el.title = `Planned through this slide: ${planned} min`;
      }
    }
    $('#sp-timer-toggle').addEventListener('click', () => {
      const t = readTimer();
      if (t.running) { t.accumulated = elapsedMs(t); t.running = false; t.startedAt = null; }
      else { t.running = true; t.startedAt = Date.now(); }
      writeTimer(t); tickTimer();
    });
    $('#sp-timer-reset').addEventListener('click', () => { writeTimer({ startedAt: null, accumulated: 0, running: false }); tickTimer(); });
    setInterval(tickTimer, 1000); tickTimer();
    // controls
    $('#sp-prev').addEventListener('click', () => send({ type: 'prev' }));
    $('#sp-next').addEventListener('click', () => send({ type: 'next' }));
    $('#sp-font-dec').addEventListener('click', () => { notesSize = clamp(notesSize - 2, 14, 40); applyNotesSize(); });
    $('#sp-font-inc').addEventListener('click', () => { notesSize = clamp(notesSize + 2, 14, 40); applyNotesSize(); });
    $('#sp-open-deck').addEventListener('click', () => {
      const w = window.open(window.location.href.split('#')[0] + `#/${state?.id || SLIDES[0].id}`, 'gh-admin-deck-main');
      if (w) { peer = w; setTimeout(() => send({ type: 'hello' }), 800); }
    });
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) { e.preventDefault(); send({ type: 'next' }); }
      else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); send({ type: 'prev' }); }
      else if (e.key === 't' || e.key === 'T') toggleTheme();
      else if (e.key === '+' || e.key === '=') { notesSize = clamp(notesSize + 2, 14, 40); applyNotesSize(); }
      else if (e.key === '-') { notesSize = clamp(notesSize - 2, 14, 40); applyNotesSize(); }
    });
    onMessage((m) => {
      if (m.type === 'state') { render(m); status.textContent = `Synchronized with the deck · ${new Date(m.ts).toLocaleTimeString()}`; }
      else if (m.type === 'timer') tickTimer();
    });
    window.addEventListener('resize', fitPreview);
    render(state);
    status.textContent = state ? 'Showing the last known deck position. Waiting for the deck to answer…' : 'Waiting for the deck.';
    send({ type: 'hello' });
    setTimeout(() => { if (!status.textContent.startsWith('Synchronized')) status.textContent = 'No deck answered yet. Open the deck (button above) and this window will follow it.'; }, 1500);
  }

  // ================================================================ boot
  initTheme();
  const r = route();
  if (r.kind === 'speaker') mountSpeaker(); else mountPresentation();
})();
