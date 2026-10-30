#!/usr/bin/env node
/**
 * scripts/deck-qa.mjs — renders the built deck with Playwright and writes screenshots for visual QA.
 *
 *   node scripts/deck-qa.mjs                 every slide, dark theme, 1920×1080 → presentation/qa/
 *   node scripts/deck-qa.mjs --ids a,b,c     only those slide ids
 *   node scripts/deck-qa.mjs --light         light theme
 *   node scripts/deck-qa.mjs --speaker       the speaker surface (and the overview + agenda overlays)
 *   node scripts/deck-qa.mjs --contact       one contact sheet of every slide (small thumbnails)
 *
 * Also runs a few mechanical checks on every slide: no horizontal/vertical overflow of the stage,
 * no element taller than the stage, and no script text on the presentation surface.
 */
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const DIST = join(ROOT, 'presentation', 'dist', 'index.html');
const OUT = join(ROOT, 'presentation', 'qa');
mkdirSync(OUT, { recursive: true });

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const opt = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] : null; };
const theme = flag('--light') ? 'light' : 'dark';
const onlyIds = opt('--ids') ? opt('--ids').split(',') : null;

const data = JSON.parse(readFileSync(DIST, 'utf8').match(/<script type="application\/json" id="deck-data">([\s\S]*?)<\/script>/)[1]);
const slides = onlyIds ? data.slides.filter((s) => onlyIds.includes(s.id)) : data.slides;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.addInitScript((t) => { localStorage.setItem('gh-admin-deck:theme', t); }, theme);
const url = pathToFileURL(DIST).href;
const findings = [];

if (flag('--speaker')) {
  await page.goto(`${url}#/${data.slides[1]?.id || data.slides[0].id}`);
  await page.waitForTimeout(300);
  await page.keyboard.press('g');
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, `overlay-grid-${theme}.png`) });
  await page.keyboard.press('Escape');
  await page.keyboard.press('a');
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, `overlay-agenda-${theme}.png`) });
  await page.keyboard.press('Escape');
  await page.keyboard.press('?');
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(OUT, `overlay-help-${theme}.png`) });
  await page.keyboard.press('Escape');
  // open the speaker window the way a presenter does: with S from the deck, so the opener link exists
  const [sp] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('s')]);
  await sp.setViewportSize({ width: 1440, height: 900 });
  await sp.waitForTimeout(800);
  await page.keyboard.press('ArrowRight');
  await sp.waitForTimeout(700);
  const synced = await sp.evaluate(() => document.getElementById('sp-status').textContent);
  console.log('speaker status:', synced);
  await sp.screenshot({ path: join(OUT, `speaker-${theme}.png`) });
  console.log('wrote overlay and speaker screenshots');
  await browser.close();
  process.exit(0);
}

// present fullscreen-like: hide chrome by emulating the presenting class
for (const s of slides) {
  await page.goto(`${url}#/${s.id}`);
  await page.evaluate(() => { document.body.classList.add('presenting'); });
  await page.waitForTimeout(150);
  // reveal every fragment for the screenshot
  await page.evaluate(() => { document.querySelectorAll('.slide.active .fragment').forEach((f) => f.classList.add('visible')); });
  await page.waitForTimeout(120);
  const checks = await page.evaluate(() => {
    const stage = document.getElementById('stage');
    const active = document.querySelector('.slide.active');
    const sr = stage.getBoundingClientRect();
    const scale = sr.width / 1920;
    const out = { overflow: [], leaked: false, title: active?.querySelector('h1')?.textContent || '' };
    for (const el of active.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.bottom > sr.bottom + 1 || r.right > sr.right + 1 || r.left < sr.left - 1) {
        const tag = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').join('.') : '');
        out.overflow.push(`${tag} bottom=${Math.round((r.bottom - sr.top) / scale)} right=${Math.round((r.right - sr.left) / scale)}`);
        if (out.overflow.length > 3) break;
      }
    }
    out.leaked = /\b(SAY|DO|SHOW):/.test(active.textContent);
    return out;
  });
  const file = join(OUT, `${String(s.n).padStart(2, '0')}-${s.id}-${theme}.png`);
  await page.screenshot({ path: file });
  if (checks.overflow.length) findings.push(`${s.n} ${s.id}: overflow → ${checks.overflow.join(' | ')}`);
  if (checks.leaked) findings.push(`${s.n} ${s.id}: script cue text visible on the audience surface`);
  process.stdout.write(`${s.n} ${s.id}${checks.overflow.length ? '  ⚠ overflow' : ''}\n`);
}

if (flag('--contact')) {
  // build a contact sheet page from the screenshots just taken
  const thumbs = slides.map((s) => `<figure><img src="${String(s.n).padStart(2, '0')}-${s.id}-${theme}.png"><figcaption>${s.n} · ${s.title || s.id}</figcaption></figure>`).join('');
  const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#111;color:#ddd;font:12px system-ui}main{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;padding:8px}figure{margin:0}img{width:100%;display:block;border:1px solid #333}figcaption{padding:3px 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style><main>${thumbs}</main>`;
  writeFileSync(join(OUT, `contact-${theme}.html`), html);
  const cp = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await cp.goto(pathToFileURL(join(OUT, `contact-${theme}.html`)).href);
  await cp.waitForTimeout(500);
  await cp.screenshot({ path: join(OUT, `contact-${theme}.png`), fullPage: true });
}

await browser.close();
if (findings.length) {
  console.log('\nFindings:');
  for (const f of findings) console.log(' - ' + f);
  process.exitCode = 2;
} else console.log(`\n${slides.length} slides rendered, no overflow, no script leakage.`);
