#!/usr/bin/env node
/**
 * presentation/build.mjs — deck builder for gh-admin-msft. Zero dependencies.
 *
 * Inputs
 *   content/slides/NN-*.md    slide sources: file front matter (section, day), slides split on `---`,
 *                             per-slide attributes as leading `@key: value` lines, then a Markdown body
 *   content/script/NN-*.md    speaker script: `## [slide-id] Title` sections; prose is what you say,
 *                             `DO:` `SHOW:` `ASK:` `PAUSE:` `DEMO:` `CHECK:` `TIME:` lines are cues,
 *                             `> …` is the bridge to the next slide, `SOURCE:` starts a source list
 *   content/diagrams/*.html   diagram fragments (inline SVG/HTML) embedded with `:::diagram name`
 *   content/agenda.json       timed agenda shown in the deck and used for the running clock
 *   src/shell.html, src/styles.css, src/app.js   the runtime shell, inlined
 *
 * Outputs
 *   dist/index.html           one self-contained file: open from disk or serve statically
 *   ../presenter/PRESENTER-SCRIPT.md   the read-aloud presenter script, generated from the same sources
 *
 * Usage:  node presentation/build.mjs [--check]
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const SLIDES_DIR = join(HERE, 'content', 'slides');
const SCRIPT_DIR = join(HERE, 'content', 'script');
const DIAGRAM_DIR = join(HERE, 'content', 'diagrams');
const AGENDA_FILE = join(HERE, 'content', 'agenda.json');
const SRC = join(HERE, 'src');
const DIST = join(HERE, 'dist');
const OUT_HTML = join(DIST, 'index.html');
const OUT_SCRIPT = join(ROOT, 'presenter', 'PRESENTER-SCRIPT.md');

const CHECK_ONLY = process.argv.includes('--check');
const problems = [];
const warnings = [];

// ------------------------------------------------------------------------------------------------
// Small helpers
// ------------------------------------------------------------------------------------------------
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const attr = (s) => esc(s).replace(/`/g, '&#96;');

function parseFrontMatter(raw) {
  const text = raw.replace(/\r\n/g, '\n');
  if (!text.startsWith('---\n')) return { meta: {}, body: text };
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return { meta: {}, body: text };
  const meta = {};
  for (const line of text.slice(4, end).split('\n')) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: text.slice(end + 5) };
}

// ------------------------------------------------------------------------------------------------
// Inline Markdown
// ------------------------------------------------------------------------------------------------
function renderInline(text) {
  const codes = [];
  let out = text.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(`<code>${esc(c)}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  out = esc(out);
  out = out.replace(/\[\[([^\]]+)\]\]/g, '<kbd>$1</kbd>');
  out = out.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(>])\*([^*\s][^*]*?[^*\s]|[^*\s])\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${attr(u)}" target="_blank" rel="noopener">${t}</a>`);
  out = out.replace(/\{\{([^}]+)\}\}/g, '<span class="muted">$1</span>');
  out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[Number(i)]);
  return out;
}

// ------------------------------------------------------------------------------------------------
// Block Markdown with containers
// ------------------------------------------------------------------------------------------------
const SELF_CLOSING = new Set(['diagram', 'spacer']);
const MARKERS = new Set(['col', 'card']);

function isOpener(l) {
  const m = l.match(/^:::\s*([a-z-]+)(.*)$/);
  if (!m) return null;
  return { name: m[1], rest: m[2].trim() };
}

function collectContainer(lines, start) {
  let depth = 1;
  const inner = [];
  let i = start + 1;
  for (; i < lines.length; i++) {
    const l = lines[i];
    const open = isOpener(l);
    if (open && !SELF_CLOSING.has(open.name) && !MARKERS.has(open.name)) depth++;
    else if (/^:::\s*$/.test(l)) {
      depth--;
      if (depth === 0) return { inner, next: i + 1 };
    }
    inner.push(l);
  }
  problems.push(`Unclosed container starting at: ${lines[start]}`);
  return { inner, next: i };
}

function splitMarkers(inner, marker) {
  const parts = [];
  let cur = null;
  let depth = 0;
  for (const l of inner) {
    const open = isOpener(l);
    if (open && open.name === marker && depth === 0) {
      cur = { title: open.rest, lines: [] };
      parts.push(cur);
      continue;
    }
    if (open && !SELF_CLOSING.has(open.name) && !MARKERS.has(open.name)) depth++;
    else if (/^:::\s*$/.test(l)) depth--;
    if (!cur) { cur = { title: '', lines: [] }; parts.push(cur); }
    cur.lines.push(l);
  }
  return parts;
}

function renderList(lines, ctx) {
  const items = lines.map((l) => {
    const m = l.match(/^(\s*)([-*]|\d+[.)])\s+(.*)$/);
    return { indent: m[1].length, ordered: /\d/.test(m[2]), text: m[3] };
  });
  let idx = 0;
  function build(level, ordered) {
    const tag = ordered ? 'ol' : 'ul';
    let html = `<${tag}>`;
    while (idx < items.length && items[idx].indent >= level) {
      const it = items[idx];
      if (it.indent > level) it.indent = level;
      idx++;
      const liClass = ctx.steps ? ' class="fragment"' : '';
      let li = `<li${liClass}>${renderInline(it.text)}`;
      if (idx < items.length && items[idx].indent > level) {
        li += build(items[idx].indent, items[idx].ordered);
      }
      html += li + '</li>';
    }
    return html + `</${tag}>`;
  }
  return build(items[0].indent, items[0].ordered);
}

function renderTable(lines) {
  const rows = lines.map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
  const [head, sep, ...body] = rows;
  const aligns = (sep || []).map((s) => (/^:-+:$/.test(s) ? 'center' : /-+:$/.test(s) ? 'right' : 'left'));
  const th = head.map((c, i) => `<th style="text-align:${aligns[i] || 'left'}">${renderInline(c)}</th>`).join('');
  const tb = body.map((r) => `<tr>${r.map((c, i) => `<td style="text-align:${aligns[i] || 'left'}">${renderInline(c)}</td>`).join('')}</tr>`).join('');
  return `<table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table>`;
}

function loadDiagram(name) {
  for (const ext of ['.html', '.svg']) {
    const p = join(DIAGRAM_DIR, name + ext);
    // comments are stripped: an HTML comment inside the embedded JSON would end the <script> data early
    if (existsSync(p)) return readFileSync(p, 'utf8').replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '');
  }
  problems.push(`Diagram not found: ${name}`);
  return `<div class="diagram-missing">diagram "${esc(name)}" missing</div>`;
}

function renderQuiz(inner, ctx) {
  let q = '';
  const opts = [];
  let answer = '';
  let expl = '';
  for (const l of inner) {
    const mq = l.match(/^Q:\s*(.*)$/);
    const mo = l.match(/^[-*]\s+([A-F])\)\s*(.*)$/);
    const ma = l.match(/^Answer:\s*([A-F])\s*(?:[—–-]\s*(.*))?$/);
    if (mq) q = mq[1];
    else if (mo) opts.push({ key: mo[1], text: mo[2] });
    else if (ma) { answer = ma[1]; expl = ma[2] || ''; }
    else if (l.trim() && answer) expl += ' ' + l.trim();
  }
  ctx.quizCount = (ctx.quizCount || 0) + 1;
  const qid = `${ctx.slideId}-q${ctx.quizCount}`;
  const options = opts.map((o) => `<button type="button" class="quiz-option" data-key="${o.key}"><span class="quiz-key" aria-hidden="true">${o.key}</span><span>${renderInline(o.text)}</span></button>`).join('');
  return `<div class="quiz" data-answer="${answer}" id="${qid}"><p class="quiz-q">${renderInline(q)}</p><div class="quiz-options">${options}</div><p class="quiz-expl" hidden><strong>Answer: ${answer}.</strong> ${renderInline(expl)}</p></div>`;
}

function renderStats(inner) {
  const tiles = inner.filter((l) => l.trim()).map((l) => {
    const [value, label, note] = l.split('|').map((s) => s.trim());
    return `<div class="stat"><div class="stat-value">${renderInline(value || '')}</div><div class="stat-label">${renderInline(label || '')}</div>${note ? `<div class="stat-note">${renderInline(note)}</div>` : ''}</div>`;
  });
  return `<div class="stats">${tiles.join('')}</div>`;
}

function renderTimeline(inner, ctx) {
  const rows = inner.filter((l) => l.trim()).map((l) => {
    const [date, text, state] = l.split('|').map((s) => s.trim());
    const cls = state ? ` tl-${state.toLowerCase().replace(/[^a-z]+/g, '-')}` : '';
    return `<li class="tl-row${cls}${ctx.steps ? ' fragment' : ''}"><span class="tl-date">${renderInline(date)}</span><span class="tl-text">${renderInline(text || '')}</span>${state ? `<span class="tl-state">${esc(state)}</span>` : ''}</li>`;
  });
  return `<ul class="timeline">${rows.join('')}</ul>`;
}

function renderBlocks(lines, ctx) {
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }

    const fence = line.match(/^```(\S*)\s*$/);
    if (fence) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++;
      const lang = fence[1] || 'text';
      out.push(`<pre class="code" data-lang="${attr(lang)}"><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }

    // a bare ":::" that closes nothing (for example after a self-closing :::diagram) is ignored
    if (/^:::\s*$/.test(line)) { i++; continue; }

    const open = isOpener(line);
    if (open) {
      const { name, rest } = open;
      if (SELF_CLOSING.has(name)) {
        i++;
        if (name === 'diagram') {
          const [dname, ...cap] = rest.split(/\s+/);
          const caption = cap.join(' ');
          out.push(`<figure class="diagram" data-diagram="${attr(dname)}">${loadDiagram(dname)}${caption ? `<figcaption>${renderInline(caption)}</figcaption>` : ''}</figure>`);
          ctx.diagrams.push(dname);
        } else if (name === 'spacer') {
          out.push('<div class="spacer"></div>');
        }
        continue;
      }
      const { inner, next } = collectContainer(lines, i);
      i = next;
      switch (name) {
        case 'cols': {
          const cols = splitMarkers(inner, 'col');
          const style = rest ? ` style="grid-template-columns:${attr(rest)}"` : '';
          out.push(`<div class="cols"${style}>${cols.map((c) => `<div class="col">${c.title ? `<h3>${renderInline(c.title)}</h3>` : ''}${renderBlocks(c.lines, ctx)}</div>`).join('')}</div>`);
          break;
        }
        case 'cards': {
          const cards = splitMarkers(inner, 'card');
          const n = rest ? ` data-count="${attr(rest)}"` : '';
          out.push(`<div class="cards"${n}>${cards.map((c, k) => {
            const m = c.title.match(/^\[([^\]]+)\]\s*(.*)$/);
            const tone = m ? ` card-${m[1]}` : '';
            const title = m ? m[2] : c.title;
            return `<div class="card${tone}${ctx.steps ? ' fragment' : ''}" data-i="${k + 1}">${title ? `<h3>${renderInline(title)}</h3>` : ''}${renderBlocks(c.lines, ctx)}</div>`;
          }).join('')}</div>`);
          break;
        }
        case 'callout': {
          const [kind, ...t] = rest.split(/\s+/);
          const title = t.join(' ');
          const icons = { note: 'ℹ️', tip: '💡', warn: '⚠️', dated: '📅', demo: '🖥️', lab: '🧪', ask: '💬', watch: '👀' };
          out.push(`<div class="callout callout-${attr(kind || 'note')}"><div class="callout-title"><span aria-hidden="true">${icons[kind] || 'ℹ️'}</span> ${renderInline(title || kind || 'Note')}</div>${renderBlocks(inner, ctx)}</div>`);
          break;
        }
        case 'steps': out.push(`<div class="steps">${renderBlocks(inner, { ...ctx, steps: true })}</div>`); break;
        case 'labtile': {
          const [num, dur, path] = (inner.find((l) => l.trim()) || '').split('|').map((s) => s.trim());
          out.push(`<div class="lab-tile"><div class="lab-num">${esc(num || '')}</div><div class="lab-dur">${renderInline(dur || '')}</div>${path ? `<div class="lab-path">${esc(path)}</div>` : ''}</div><!--/lab-tile-->`);
          break;
        }
        case 'quiz': out.push(renderQuiz(inner, ctx)); break;
        case 'stats': out.push(renderStats(inner)); break;
        case 'timeline': out.push(renderTimeline(inner, ctx)); break;
        case 'aside': out.push(`<aside class="aside">${renderBlocks(inner, ctx)}</aside>`); break;
        case 'center': out.push(`<div class="center">${renderBlocks(inner, ctx)}</div>`); break;
        case 'big': out.push(`<div class="big">${renderBlocks(inner, ctx)}</div>`); break;
        case 'chips': {
          const chips = inner.filter((l) => l.trim()).map((l) => `<span class="chip${ctx.steps ? ' fragment' : ''}">${renderInline(l.replace(/^[-*]\s+/, ''))}</span>`);
          out.push(`<div class="chips">${chips.join('')}</div>`);
          break;
        }
        case 'kv': {
          const rows = inner.filter((l) => l.trim()).map((l) => {
            const [k, v] = l.split('|').map((s) => s.trim());
            return `<div class="kv-row${ctx.steps ? ' fragment' : ''}"><div class="kv-k">${renderInline(k || '')}</div><div class="kv-v">${renderInline(v || '')}</div></div>`;
          });
          out.push(`<div class="kv">${rows.join('')}</div>`);
          break;
        }
        default:
          problems.push(`Unknown container ":::${name}" in slide ${ctx.slideId}`);
          out.push(renderBlocks(inner, ctx));
      }
      continue;
    }

    if (/^\|/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\|/.test(lines[i])) { buf.push(lines[i]); i++; }
      out.push(renderTable(buf));
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      out.push(`<h${h[1].length}>${renderInline(h[2])}</h${h[1].length}>`);
      i++;
      continue;
    }

    if (/^\s*([-*]|\d+[.)])\s+/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*([-*]|\d+[.)])\s+/.test(lines[i])) { buf.push(lines[i]); i++; }
      out.push(renderList(buf, ctx));
      continue;
    }

    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(`<blockquote>${renderBlocks(buf, ctx)}</blockquote>`);
      continue;
    }

    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (img) {
      out.push(`<img src="${attr(img[2])}" alt="${attr(img[1])}">`);
      i++;
      continue;
    }

    const para = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,4}\s|```|:::|\||>\s?|\s*([-*]|\d+[.)])\s+|!\[)/.test(lines[i])) {
      para.push(lines[i]); i++;
    }
    out.push(`<p>${para.map(renderInline).join(' ')}</p>`);
  }
  return out.join('\n');
}

// ------------------------------------------------------------------------------------------------
// Slides
// ------------------------------------------------------------------------------------------------
function loadSlides() {
  if (!existsSync(SLIDES_DIR)) { problems.push('content/slides is missing'); return []; }
  const files = readdirSync(SLIDES_DIR).filter((f) => f.endsWith('.md')).sort();
  const slides = [];
  const ids = new Set();
  for (const f of files) {
    const { meta, body } = parseFrontMatter(readFileSync(join(SLIDES_DIR, f), 'utf8'));
    const chunks = body.split(/\n---\s*\n/);
    for (const chunk of chunks) {
      const lines = chunk.replace(/^\s*\n/, '').split('\n');
      const attrs = { section: meta.section || '', day: Number(meta.day || 1), layout: 'default', minutes: 0, lab: '', kicker: '' };
      while (lines.length && /^@[a-z-]+:/i.test(lines[0])) {
        const m = lines.shift().match(/^@([a-z-]+):\s*(.*)$/i);
        attrs[m[1]] = m[2].trim();
      }
      const text = lines.join('\n').trim();
      if (!text && !attrs.id) continue;
      if (!attrs.id) { problems.push(`Slide without @id in ${f}: "${text.slice(0, 40)}"`); continue; }
      if (ids.has(attrs.id)) problems.push(`Duplicate slide id "${attrs.id}" in ${f}`);
      ids.add(attrs.id);
      attrs.minutes = Number(attrs.minutes || 0);
      attrs.day = Number(attrs.day);
      if (/^(SAY|DO|SHOW):/m.test(text)) problems.push(`Slide "${attrs.id}" contains script cues on the audience surface`);
      const ctx = { slideId: attrs.id, diagrams: [] };
      const bodyLines = text.split('\n');
      let title = '';
      const tIdx = bodyLines.findIndex((l) => /^#\s+/.test(l));
      if (tIdx !== -1) { title = bodyLines[tIdx].replace(/^#\s+/, ''); bodyLines.splice(tIdx, 1); }
      let html = renderBlocks(bodyLines, ctx);
      if (html.includes('<!--/lab-tile-->')) {
        const [tile, rest] = html.split('<!--/lab-tile-->');
        html = `${tile}<div class="lab-main">${rest}</div>`;
      }
      slides.push({ ...attrs, source: f, title, titleHtml: renderInline(title), html, diagrams: ctx.diagrams });
    }
  }
  slides.forEach((s, i) => { s.n = i + 1; });
  return slides;
}

// ------------------------------------------------------------------------------------------------
// Speaker script
// ------------------------------------------------------------------------------------------------
const CUE_RE = /^(DO|SHOW|ASK|PAUSE|DEMO|CHECK|TIME|LAB|CLICK):\s*(.*)$/;
const CUE_ICON = { DO: '🎬', SHOW: '👁', ASK: '💬', PAUSE: '⏸', DEMO: '🖥', CHECK: '🔎', TIME: '⏱', LAB: '🧪', CLICK: '👉' };

function loadScript() {
  const sections = new Map();
  if (!existsSync(SCRIPT_DIR)) { warnings.push('content/script is missing'); return sections; }
  const files = readdirSync(SCRIPT_DIR).filter((f) => f.endsWith('.md')).sort();
  for (const f of files) {
    const { body } = parseFrontMatter(readFileSync(join(SCRIPT_DIR, f), 'utf8'));
    let cur = null;
    let inSources = false;
    let para = [];
    const flush = () => { if (para.length && cur) cur.parts.push({ type: 'say', text: para.join(' ') }); para = []; };
    for (const raw of body.split('\n')) {
      const line = raw.replace(/\s+$/, '');
      const head = line.match(/^##\s+\[([^\]]+)\]\s*(.*)$/);
      if (head) {
        flush();
        cur = { title: head[2].trim(), parts: [], file: f };
        if (sections.has(head[1])) problems.push(`Script section "[${head[1]}]" defined twice (${f})`);
        sections.set(head[1], cur);
        inSources = false;
        continue;
      }
      if (!cur) continue;
      if (/^#\s/.test(line)) continue;
      if (/^SOURCE:/i.test(line)) {
        flush();
        inSources = true;
        const first = line.replace(/^SOURCE:\s*/i, '').trim();
        cur.parts.push({ type: 'sources', items: first ? [first] : [] });
        continue;
      }
      if (inSources) {
        if (line.trim() === '') { inSources = false; continue; }
        cur.parts[cur.parts.length - 1].items.push(line.trim());
        continue;
      }
      const cue = line.match(CUE_RE);
      if (cue) { flush(); cur.parts.push({ type: 'cue', kind: cue[1], text: cue[2] }); continue; }
      if (/^>\s?/.test(line)) { flush(); cur.parts.push({ type: 'transition', text: line.replace(/^>\s?/, '') }); continue; }
      if (line.trim() === '') { flush(); continue; }
      para.push(line.trim());
    }
    flush();
  }
  return sections;
}

function notesHtml(section) {
  if (!section) return '';
  return section.parts.map((p) => {
    switch (p.type) {
      case 'say': return `<p class="say">${renderInline(p.text)}</p>`;
      case 'cue': return `<p class="cue cue-${p.kind.toLowerCase()}"><span class="cue-kind" aria-hidden="true">${CUE_ICON[p.kind]}</span><span class="cue-label">${p.kind}</span> ${renderInline(p.text)}</p>`;
      case 'transition': return `<p class="transition"><span class="cue-label">Bridge</span> ${renderInline(p.text)}</p>`;
      case 'sources': return p.items.length ? `<details class="sources"><summary>Sources (${p.items.length})</summary><ul>${p.items.map((u) => /^https?:/.test(u) ? `<li><a href="${attr(u)}" target="_blank" rel="noopener">${esc(u.replace(/^https?:\/\//, ''))}</a></li>` : `<li>${renderInline(u)}</li>`).join('')}</ul></details>` : '';
      default: return '';
    }
  }).join('\n');
}

function wordCount(section) {
  if (!section) return 0;
  return section.parts.filter((p) => p.type === 'say').reduce((n, p) => n + p.text.split(/\s+/).length, 0);
}

// ------------------------------------------------------------------------------------------------
// Presenter script document (Markdown)
// ------------------------------------------------------------------------------------------------
function fmtClock(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

function presenterMarkdown(slides, script, agenda) {
  const L = [];
  L.push('# Presenter Script — GitHub Enterprise Cloud Administration (L300)');
  L.push('');
  L.push(`> Generated by \`node presentation/build.mjs\` from \`presentation/content/script/\` on ${new Date().toISOString().slice(0, 10)}. Edit the script sources, not this file.`);
  L.push('');
  L.push('## How to read this script');
  L.push('');
  L.push('- **Plain text is what you say.** It is written to be spoken: short sentences, one idea each, in the order you will say them. Read it as prose, not as bullets.');
  L.push('- **Cue lines are things you do, not things you say.** 🎬 DO, 👁 SHOW, 💬 ASK, ⏸ PAUSE, 🖥 DEMO, 🔎 CHECK, 👉 CLICK, 🧪 LAB. Pause marks are deliberate: give the room the seconds they ask for.');
  L.push('- **The ➜ line is the bridge to the next slide.** Say it while you press Next, so the screen never changes in silence.');
  L.push('- **The clock** under each heading is this slide\'s budget and the running total for the day. If you are more than five minutes behind at a section header, use the recovery notes in the Instructor Guide.');
  L.push('- **Nothing in this script appears on the audience screen.** The deck shows sparse slides; the speaker window (press **S** in the deck) shows these notes beside the current and next slide.');
  L.push('');
  L.push('Oratory rules this script follows: say the point before the detail, one number per sentence, name the slide element you are pointing at, land every section with a takeaway, and never read the slide aloud.');
  L.push('');
  const days = [...new Set(slides.map((s) => s.day))].sort();
  for (const day of days) {
    const dayAgenda = agenda?.days?.find((d) => d.day === day);
    L.push(`## Day ${day}${dayAgenda ? ` — ${dayAgenda.title}` : ''}`);
    L.push('');
    if (dayAgenda) {
      L.push('| Start | Min | Block |');
      L.push('|---|---|---|');
      for (const b of dayAgenda.blocks) L.push(`| ${b.start} | ${b.minutes} | ${b.type === 'break' ? '☕ ' : b.type === 'lab' ? '🧪 ' : ''}${b.title} |`);
      L.push('');
    }
    let running = 0;
    let lastSection = null;
    for (const s of slides.filter((x) => x.day === day)) {
      if (s.section !== lastSection) {
        L.push(`### ▶ ${s.section}`);
        L.push('');
        lastSection = s.section;
      }
      const sec = script.get(s.id);
      L.push(`#### S${s.n} · ${s.title || s.id}`);
      L.push('');
      const budget = s.minutes ? `⏱ ${s.minutes} min` : '⏱ —';
      L.push(`*${budget} · running ${fmtClock(running)} → ${fmtClock(running + s.minutes)}${s.lab ? ` · 🧪 Lab ${s.lab}` : ''}*`);
      L.push('');
      running += s.minutes;
      if (!sec) { L.push('_No script section for this slide._'); L.push(''); continue; }
      for (const p of sec.parts) {
        if (p.type === 'say') { L.push(p.text); L.push(''); }
        else if (p.type === 'cue') { L.push(`> ${CUE_ICON[p.kind]} **${p.kind}** ${p.text}`); L.push(''); }
        else if (p.type === 'transition') { L.push(`> ➜ ${p.text}`); L.push(''); }
        else if (p.type === 'sources' && p.items.length) {
          L.push('<details><summary>Sources</summary>');
          L.push('');
          for (const u of p.items) L.push(`- ${u}`);
          L.push('');
          L.push('</details>');
          L.push('');
        }
      }
    }
  }
  return L.join('\n');
}

// ------------------------------------------------------------------------------------------------
// Build
// ------------------------------------------------------------------------------------------------
function main() {
  const slides = loadSlides();
  const script = loadScript();
  const agenda = existsSync(AGENDA_FILE) ? JSON.parse(readFileSync(AGENDA_FILE, 'utf8')) : null;

  const slideIds = new Set(slides.map((s) => s.id));
  for (const s of slides) {
    if (!script.has(s.id)) warnings.push(`No script for slide "${s.id}" (${s.source})`);
    s.notes = notesHtml(script.get(s.id));
    s.words = wordCount(script.get(s.id));
  }
  for (const id of script.keys()) if (!slideIds.has(id)) warnings.push(`Script section "[${id}]" has no slide`);
  if (agenda) {
    for (const d of agenda.days || []) for (const b of d.blocks || []) for (const ref of b.slides || []) {
      if (!slideIds.has(ref)) (process.argv.includes("--strict") ? problems : warnings).push(`agenda.json references unknown slide "${ref}"`);
    }
  }
  for (const s of slides) {
    if (s.minutes && s.words / 150 > s.minutes * 1.4) warnings.push(`Slide "${s.id}": ${s.words} words for ${s.minutes} min (~${Math.round(s.words / 150)} min spoken)`);
  }

  const totalWords = slides.reduce((n, s) => n + s.words, 0);
  const totalMin = slides.reduce((n, s) => n + s.minutes, 0);
  const report = `${slides.length} slides · ${script.size} script sections · ${totalWords} spoken words · ${totalMin} planned minutes`;
  for (const w of warnings) console.warn(`warn: ${w}`);
  for (const p of problems) console.error(`ERROR: ${p}`);
  console.log(report);
  if (problems.length) process.exit(1);
  if (CHECK_ONLY) return;

  const shell = readFileSync(join(SRC, 'shell.html'), 'utf8');
  const css = readFileSync(join(SRC, 'styles.css'), 'utf8');
  const js = readFileSync(join(SRC, 'app.js'), 'utf8');
  const data = {
    title: agenda?.title || 'GitHub Enterprise Cloud Administration',
    subtitle: agenda?.subtitle || '',
    built: new Date().toISOString(),
    slides: slides.map(({ id, n, day, section, layout, kicker, lab, minutes, title, titleHtml, html, notes, words }) => ({ id, n, day, section, layout, kicker, lab, minutes, title, titleHtml, html, notes, words })),
    agenda,
  };
  // keep the JSON safe inside a <script> element: neither "</" nor "<!--" may appear literally
  const json = JSON.stringify(data).replace(/<\//g, '<\\/').replace(/<!--/g, '\\u003c!--');
  const html = shell
    .replace('{{TITLE}}', esc(data.title))
    .replace('{{STYLES}}', () => css)
    .replace('{{DATA}}', () => json)
    .replace('{{SCRIPT}}', () => js);
  mkdirSync(DIST, { recursive: true });
  writeFileSync(OUT_HTML, html);
  mkdirSync(dirname(OUT_SCRIPT), { recursive: true });
  writeFileSync(OUT_SCRIPT, presenterMarkdown(slides, script, agenda));
  console.log(`wrote ${OUT_HTML} (${(html.length / 1024).toFixed(0)} KB) and ${OUT_SCRIPT}`);
}

main();
