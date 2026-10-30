# The teaching deck

`dist/index.html` is the workshop deck: one self-contained HTML file, no server, no dependencies. It is generated from the Markdown under `content/` by `build.mjs`, which also writes the read-aloud script to `../presenter/PRESENTER-SCRIPT.md`. Edit the Markdown, rebuild, commit both outputs.

```bash
node presentation/build.mjs          # build dist/index.html and presenter/PRESENTER-SCRIPT.md
node presentation/build.mjs --check  # validate only
node scripts/deck-qa.mjs             # screenshot every slide into presentation/qa/ and flag overflow
node scripts/deck-qa.mjs --speaker   # screenshot the overlays and the speaker window
node scripts/deck-live-edge.mjs      # Windows + Edge: rehearse on the real screen with real key presses and capture it
```

## Presenting

Open `dist/index.html`. The deck remembers theme, time zone and the notes font size per browser.

| Key | Does |
|---|---|
| `→` `Space` `PgDn` / `←` `PgUp` | next or previous step; a slide with staged reveals takes several presses |
| `Home` / `End`, digits then `Enter` | first or last slide, or jump to a number |
| `S` | open the **speaker window**: current and next slide, the script, a timer against the planned minutes, prev/next buttons that drive the deck. Open it before `F`: a new window leaves fullscreen |
| `F` | present fullscreen (`Esc` leaves fullscreen in every browser, so overlays close with their own key) · `B` blank the screen · `T` light/dark · `P` print to PDF |
| `A` · `G` · `?` | timed agenda in any time zone · overview grid · shortcut help |

The speaker window talks to the deck over `postMessage` (it is opened from the deck, so this works even from `file://`), BroadcastChannel and localStorage. Open it from the deck with `S`; a window opened by hand still synchronizes when the deck and the speaker page share an origin (any `http://` host).

## Authoring

### Slides: `content/slides/NN-name.md`

Front matter sets the section name and the day. Slides are separated by a line containing only `---`. A slide starts with `@key: value` lines, then Markdown. The first `# heading` is the slide title.

```markdown
---
section: Permission flow
day: 1
---

@id: visibility            # required, unique, used in URLs and the agenda
@layout: default           # default | title | section | lab | break | quiz | end
@minutes: 2                # planned minutes; the speaker window and the script use them
@lab: 3                    # optional lab badge
@kicker: Custom label      # optional; defaults to the section name

# Repository visibility
…
```

Markdown subset: headings, paragraphs, bullet and numbered lists (nested by two spaces), `**bold**`, `*em*`, `` `code` ``, links, fenced code with a language, pipe tables, blockquotes, `[[Key]]` for a keycap, `{{muted text}}`.

Containers open with `:::name` and close with `:::`:

| Container | Use |
|---|---|
| `:::cols 1fr 1fr` … `:::col Title` … | columns (the argument is the grid template) |
| `:::cards 3` … `:::card [tone] Title` … | cards; tone is `good`, `warn`, `bad`, `purple` or `muted` |
| `:::callout kind Title` | kind: `note`, `tip`, `warn`, `dated`, `watch`, `demo`, `lab`, `ask` |
| `:::steps` | every list item or card inside becomes a staged reveal |
| `:::timeline` with rows `date \| text \| state` | state: `done`, `ga`, `preview`, `watch`, `soon` |
| `:::stats` with rows `value \| label \| note` | stat tiles |
| `:::kv` with rows `key \| value` | definition rows |
| `:::chips` | one chip per list item |
| `:::quiz` with `Q:`, `- A) …` options and `Answer: B — why` | an interactive knowledge check |
| `:::labtile` with `number \| duration \| path` | the tile on a `lab` layout slide; everything after it becomes the main column |
| `:::big`, `:::center`, `:::aside` | emphasis, centering, small print |
| `:::diagram name [caption]` | embeds `content/diagrams/name.html` (self-closing, no `:::` after it) |

### Diagrams: `content/diagrams/*.html`

Inline SVG or HTML fragments styled with the `d-*` classes from `src/styles.css`, so they follow the theme. Elements with `data-hl="group"` highlight together on hover or focus. Elements with `class="fragment"` are revealed by Next. Two interactive diagrams have their own markup: `[data-bp]` (the base-permission grid) and `[data-decision]` (a Yes/No decision tree described by an embedded JSON object).

### Script: `content/script/NN-name.md`

One section per slide, keyed by id. The builder warns about slides without a script and about scripts longer than the slide's minutes allow (about 150 spoken words a minute).

```markdown
## [visibility] Repository visibility

Plain paragraphs are what you say. Keep sentences short and say the point first.

SHOW: Names the element you are pointing at.
DO: An action for you, never read aloud.
ASK: A question to the room.
PAUSE: How long to wait.
CLICK: Press Next to reveal the next step.
DEMO: Drive the UI.
CHECK: Something to re-verify before this delivery (previews, dated changes).
TIME: A timing call.

> The bridge: one sentence you say while pressing Next.

SOURCE: https://docs.github.com/…
https://github.blog/changelog/…
```

### Agenda: `content/agenda.json`

Days, blocks (`session`, `lab`, `break`, `discussion`) with a start time in the workshop time zone, minutes, and the slide ids the block contains. The deck shows it with `A`, converts it to the viewer's time zone, and the speaker window uses it to show which block you are in. The sum of `@minutes` in a block should equal the block's minutes; `node presentation/build.mjs` reports the totals.

## Checks that run in `npm test`

`tests/validate-deck.js` builds the deck in check mode and fails on: a slide without a script, duplicate ids, agenda references to unknown slides, script cue text on the audience surface, and a day whose planned minutes do not add up to 180.
