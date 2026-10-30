#!/usr/bin/env node
/**
 * scripts/deck-live-edge.mjs — rehearse the deck in the real Microsoft Edge on this desktop and capture the
 * physical screen after every step, so the screenshots show what a person in the room would see (browser
 * chrome, the fullscreen presenting view, the speaker pop-up as a real window), not a headless render.
 *
 * Phase 1 launches a plain Edge with a throwaway profile and presses real keys through the system input
 * queue. A browser only goes fullscreen on a genuine user gesture, and an Edge launched by an automation
 * protocol never resizes its window for fullscreen, so this phase is the only way to see the true presenting
 * view, the overlays inside it, and the speaker pop-up. It is closed (and its profile deleted) afterwards.
 *
 * Phase 2 drives an Edge that Playwright launched, for the steps that need clicks: staged reveals, the
 * base-permission grid, a quiz, the speaker window driving the deck, the overlays, the theme, the decision tree.
 *
 *   node scripts/deck-live-edge.mjs            # writes presentation/qa/real-NN-*.png and live-NN-*.png
 *   node scripts/deck-live-edge.mjs --keep     # leave the automated Edge open on the cover slide when done
 *
 * Captures and window handling are in scripts/win-shot.ps1.
 */
import { chromium } from 'playwright';
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const DIST = join(ROOT, 'presentation', 'dist', 'index.html');
const OUT = join(ROOT, 'presentation', 'qa');
mkdirSync(OUT, { recursive: true });
const keep = process.argv.includes('--keep');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const url = pathToFileURL(DIST).href;

const SHOT = join(HERE, 'win-shot.ps1');
const ps = (args) => execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', SHOT, ...args], { encoding: 'utf8' }).trim();
const VK = { Enter: 13, Escape: 27, Right: 39, A: 65, F: 70, G: 71, S: 83, T: 84, D2: 50, D9: 57 };

let n = 0;
function capture(prefix, label, extra = []) {
  n += 1;
  const num = String(n).padStart(2, '0');
  const info = ps(['-Out', join(OUT, `${prefix}-${num}-${label}.png`), '-Front', '-Park', ...extra]);
  console.log(`${prefix}-${num} ${label} · ${info}`);
  return info;
}
const previousForeground = ps(['-GetForeground']);

// ---------- phase 1: a plain Edge, a throwaway profile, real keys ----------
console.log('phase 1 · real Edge, real keys');
const profile = join(tmpdir(), 'gh-admin-deck-edge-profile');
rmSync(profile, { recursive: true, force: true });
const edgeExe = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find((p) => existsSync(p));
if (!edgeExe) throw new Error('msedge.exe not found');
const edgeArgs = [`--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--disable-sync',
  '--disable-features=msImplicitSignin,msSeamlessWebToBrowserSignIn', '--new-window', `${url}#/cover`];
spawn(edgeExe, edgeArgs, { detached: true, stdio: 'ignore' }).unref();
await sleep(5000);
const key = (...vks) => ps(['-Front', '-Keys', vks.join(',')]);

capture('real', 'windowed');
key(VK.F); await sleep(1500);
const fs1 = capture('real', 'fullscreen-cover');
if (!/window=0,0 /.test(fs1)) console.warn('!! F did not make the Edge window fullscreen');
key(VK.Right, VK.Right); await sleep(600); capture('real', 'fullscreen-objectives');
key(VK.G); await sleep(800); capture('real', 'fullscreen-overview');
key(VK.G); await sleep(400);                                   // the same key closes the overlay (Esc would leave fullscreen)
key(VK.A); await sleep(800); capture('real', 'fullscreen-agenda');
key(VK.A); await sleep(400);
key(VK.D2, VK.D9, VK.Enter); await sleep(600);                 // type 29 + Enter: the hierarchy diagram
key(VK.Right, VK.Right, VK.Right, VK.Right, VK.Right); await sleep(500); capture('real', 'fullscreen-hierarchy-built');
key(VK.T); await sleep(500); capture('real', 'fullscreen-dark-theme'); key(VK.T); await sleep(300);
key(VK.S); await sleep(3000);                                  // the speaker pop-up as a real window
capture('real', 'speaker-popup', ['-Speaker']);
capture('real', 'deck-after-speaker-opened');
key(VK.Escape); await sleep(800); capture('real', 'after-escape');
execFileSync('powershell', ['-NoProfile', '-Command',
  "Get-CimInstance Win32_Process -Filter \"Name='msedge.exe'\" | Where-Object { $_.CommandLine -like '*gh-admin-deck-edge-profile*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"]);
await sleep(1200);
rmSync(profile, { recursive: true, force: true });

// ---------- phase 2: automated Edge, the steps that need clicks ----------
console.log('phase 2 · automated Edge, interactions');
n = 0;
const browser = await chromium.launch({ channel: 'msedge', headless: false, args: ['--start-maximized', '--new-window'] });
const context = await browser.newContext({ viewport: null });
const page = await context.newPage();
// hover highlights follow the automation pointer, so park it in a corner before each capture
const live = async (label, extra) => { await page.mouse.move(2, 2); await sleep(150); return capture('live', label, extra); };

await page.goto(`${url}#/cover`); await page.bringToFront(); await sleep(1500);
await live('cover-windowed');
await page.goto(`${url}#/ghec`); await sleep(600); await live('ghec-step0');
await page.keyboard.press('ArrowRight'); await sleep(300); await page.keyboard.press('ArrowRight'); await sleep(400);
await live('ghec-step2');
await page.goto(`${url}#/base-permissions`); await sleep(600);
await page.click('[data-base="read"]'); await sleep(400); await live('base-permissions-read');
await page.click('[data-base="none"]'); await sleep(400); await live('base-permissions-none');
await page.goto(`${url}#/day1-quiz`); await sleep(600);
await page.click('.quiz-option[data-key="B"]'); await sleep(400); await live('quiz-answered');
// the speaker window (a pop-up of the deck window) drives the deck
const [speaker] = await Promise.all([page.waitForEvent('popup'), page.keyboard.press('s')]);
await sleep(1500); await speaker.bringToFront(); await sleep(600);
capture('live', 'speaker-window', ['-Speaker']);
await speaker.click('#sp-next'); await sleep(500);
await speaker.click('#sp-timer-toggle'); await sleep(1500);
capture('live', 'speaker-driving-deck', ['-Speaker']);
await page.bringToFront(); await sleep(400);
await page.keyboard.press('g'); await sleep(700); await live('overview-grid');
await page.keyboard.press('g'); await sleep(300);
await page.keyboard.press('a'); await sleep(700); await live('agenda-overlay');
await page.keyboard.press('a'); await sleep(300);
await page.goto(`${url}#/ruleset-anatomy`); await sleep(500);
await page.keyboard.press('t'); await sleep(500); await live('dark-theme-ruleset-anatomy');
await page.keyboard.press('t'); await sleep(300);
await page.goto(`${url}#/auth-decision`); await sleep(600);
await page.click('[data-decision] button[data-go]:nth-of-type(2)'); await sleep(300);
await page.click('[data-decision] button[data-go]:nth-of-type(1)'); await sleep(400);
await live('decision-tree-answer');

if (keep) {
  await speaker.close();
  await page.goto(`${url}#/cover`);
  console.log('Automated Edge left open on the cover slide.');
} else {
  await browser.close();
}
// give the desktop back to whatever was in front before
if (previousForeground && previousForeground !== '0') ps(['-RestoreForeground', previousForeground]);
console.log('done');
if (keep) process.exit(0);
