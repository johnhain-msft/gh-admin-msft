/**
 * validate-deck.js
 *
 * Checks the teaching deck sources and the built artifacts:
 * - `node presentation/build.mjs --check --strict` passes (unique ids, every agenda ref resolves, no cue text on slides)
 * - every slide has a script section
 * - each day's planned minutes add up to 180
 * - the built deck and the generated presenter script exist and are newer than, or as new as, their sources
 * - the built deck embeds no "</script" or "<!--" inside its data block
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Reporter, rootPath } = require('./utils');

const reporter = new Reporter('Deck Validation');

function main() {
  const build = rootPath('presentation', 'build.mjs');
  let out = '';
  try {
    out = execFileSync(process.execPath, [build, '--check', '--strict'], { cwd: rootPath(), encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
    reporter.pass('build --check --strict: no errors');
  } catch (err) {
    const text = `${err.stdout || ''}${err.stderr || ''}`;
    for (const line of text.split('\n').filter((l) => l.startsWith('ERROR:'))) reporter.fail('presentation', line.replace(/^ERROR:\s*/, ''));
    if (!text.includes('ERROR:')) reporter.fail('presentation', `build failed: ${text.slice(0, 300)}`);
  }

  // warnings about missing scripts are failures here
  let warnText = '';
  try {
    execFileSync(process.execPath, [build, '--check'], { cwd: rootPath(), encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) { warnText = `${err.stdout || ''}${err.stderr || ''}`; }
  // capture stderr warnings on a successful run too
  try {
    const res = require('child_process').spawnSync(process.execPath, [build, '--check'], { cwd: rootPath(), encoding: 'utf-8' });
    warnText += res.stderr || '';
    out += res.stdout || '';
  } catch { /* ignore */ }
  const missing = warnText.split('\n').filter((l) => /No script for slide/.test(l));
  if (missing.length) missing.forEach((m) => reporter.fail('presentation/content/script', m.replace(/^warn:\s*/, '')));
  else reporter.pass('every slide has a script section');
  const orphans = warnText.split('\n').filter((l) => /has no slide/.test(l));
  orphans.forEach((m) => reporter.warn('presentation/content/script', m.replace(/^warn:\s*/, '')));

  // minutes per day
  const slidesDir = rootPath('presentation', 'content', 'slides');
  const perDay = {};
  for (const f of fs.readdirSync(slidesDir).filter((x) => x.endsWith('.md')).sort()) {
    const raw = fs.readFileSync(path.join(slidesDir, f), 'utf-8').replace(/\r\n/g, '\n');
    const day = Number((raw.match(/^day:\s*(\d+)/m) || [])[1] || 1);
    for (const m of raw.matchAll(/^@minutes:\s*(\d+)/gm)) perDay[day] = (perDay[day] || 0) + Number(m[1]);
  }
  for (const [day, min] of Object.entries(perDay)) {
    if (min === 180) reporter.pass(`day ${day}: 180 planned minutes`);
    else reporter.fail('presentation/content/slides', `day ${day} plans ${min} minutes, expected 180`);
  }

  // built artifacts
  const dist = rootPath('presentation', 'dist', 'index.html');
  const script = rootPath('presenter', 'PRESENTER-SCRIPT.md');
  if (!fs.existsSync(dist)) reporter.fail('presentation/dist/index.html', 'missing: run node presentation/build.mjs');
  else {
    const html = fs.readFileSync(dist, 'utf-8');
    const data = html.match(/<script type="application\/json" id="deck-data">([\s\S]*?)<\/script>/);
    if (!data) reporter.fail('presentation/dist/index.html', 'deck data block not found');
    else if (/<\/script|<!--/.test(data[1])) reporter.fail('presentation/dist/index.html', 'unsafe sequence inside the deck data block');
    else reporter.pass('built deck has a well-formed data block');
    const newest = Math.max(...['slides', 'script', 'diagrams'].flatMap((d) => {
      const dir = rootPath('presentation', 'content', d);
      return fs.existsSync(dir) ? fs.readdirSync(dir).map((f) => fs.statSync(path.join(dir, f)).mtimeMs) : [0];
    }), fs.statSync(rootPath('presentation', 'content', 'agenda.json')).mtimeMs);
    if (fs.statSync(dist).mtimeMs + 2000 < newest) reporter.warn('presentation/dist/index.html', 'older than the content sources: rebuild and commit');
    else reporter.pass('built deck is as new as its sources');
  }
  if (!fs.existsSync(script)) reporter.fail('presenter/PRESENTER-SCRIPT.md', 'missing: run node presentation/build.mjs');
  else reporter.pass('presenter script exists');

  const summary = out.split('\n').find((l) => /slides ·/.test(l));
  if (summary) console.log(`  ${summary.trim()}`);
  reporter.report();
  process.exit(reporter.failures > 0 ? 1 : 0);
}

main();
