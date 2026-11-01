# Study Room

A browser-based study room with a Markdown reader, multiple themes, multi-file tabs, dedicated media panels, and AI-powered text analysis.

Live at: **https://xalebxen99.github.io/study_room/**

## Features

- **Blank Editor** -- Start writing immediately in an empty document, with a quiet placeholder instead of a central title or upload box. New documents and closing the last tab also return to a blank editor.
- **Study quotes** -- Four motivational quotes rotate every 12 seconds above the timer in an italic serif font. Rotation pauses while the tab is hidden.
- **Upload & Render** -- Drag and drop or browse to select `.md` files, rendered instantly with GitHub-style formatting
- **Multi-file Tabs** -- Open multiple Markdown files at once, switch between them with tabs. Files persist in localStorage across page refreshes
- **Study files** -- Seven bundled maths exam notes can be clicked or dragged from the left panel into the editor. Edits are saved locally; download an edited Markdown copy to keep it. The OS book is available as a complete ZIP download.
- **Study timer** -- Matches the left-hand panels' combined height on desktop, with its status at the top-right. Choose Pomodoro (25 min), Feynman (20 min), Deep work (50 min), Break (5 min), or a custom duration, then Start. Presets pause selection during an active session; Reset unlocks them. Breaks are started manually. Pause/Resume and the full-screen "Hey your time is up!" overlay still work.
- **Study checklist** -- Add study goals beneath Study files, tick them off, or remove them. Goals and completion are saved on this device.
- **Saved media** -- Choose from four saved YouTube videos and three Spotify playlists. Playlist choices collapse when music starts; expand Playlists to change them. External links remain available.
- **Compact players** -- Music and YouTube switch to player-only views after media loads. The up arrow expands settings; the down arrow returns to the player. Minus minimises to the corner button without unloading media. With nothing loaded, opening a player shows its setup controls.
- **Themes** -- Switch between four visual themes via the dropdown in the top right:
  - **Default** -- Clean GitHub-style white theme
  - **Sci-Fi** -- Dark navy with neon cyan accents and glowing effects
  - **Pixel Art** -- Retro 8-bit aesthetic with pixel fonts and chunky borders
  - **Office** -- Warm paper tones with serif fonts, like writing on quality paper
- **AI Text Analysis** -- Highlight any text in the rendered Markdown and click "Ask AI" to ask questions about the selection (powered by Google Gemini)
- **LaTeX Math** -- Inline `\( ... \)` / `$ ... $` and display `\[ ... \]` / `$$ ... $$` formulas render with KaTeX; code blocks are left alone
- **Syntax Highlighting** -- Code blocks are highlighted with highlight.js, theme-matched
- **Client-Side Workspace** -- Markdown, study files, the timer, checklist and music players run in your browser.
- **Workspace Panels** -- Study files and the checklist sit on the left; the timer sits on the right, aligned with Edit/Preview on desktop. Music stays within the sidebar width in the bottom-left corner and YouTube stays in the bottom-right, including while scrolling. Both players start collapsed, use the active theme and have bounded heights. Narrow screens keep them side by side at reduced widths.

For Spotify sign-in, register `https://xalebxen99.github.io/study_room/` as a redirect URI in your Spotify app settings.

## AI Setup

The AI feature uses the Google Gemini API (free tier).

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Generate a free API key
3. Click the gear icon in the app and paste your key
4. The key is stored in your browser's localStorage only

## Usage

1. Open the app and start writing, or choose a note from Study files
2. Drag a `.md` file into the centre or use the file picker in the left panel
3. The file renders with full GitHub-style Markdown formatting
4. Use the theme dropdown (top right) to switch visual themes
5. Open additional files with the + button next to your tabs
6. Highlight text in any rendered file and click "Ask AI" to query it

## Study library and downloads

The left panel contains the seven approved maths notes in `assets/maths/`.
Click a note or drag it into the middle to open an editable tab. Reopening an
already-open note switches to its existing draft without replacing edits.
Drafts and their library associations survive reloads in this browser.
Editing does not modify the published notes: use the Download button to export.
Local Markdown files can still be dropped into the library or editor (5 MB limit).
Imported Markdown is sanitized and Mermaid uses strict mode.

The complete OS book archive is hosted as the
[os-book.zip release asset](https://github.com/XalebXEn99/study_room/releases/download/study-resources-2026/os-book.zip)
because its 203,715,562 bytes exceed GitHub's 100 MB per-file Git limit. The
archive contains 564 files, including original attribution and notices, and
was published with the repository owner's confirmation of redistribution
permission. Extract it and open `os-book/index.html`; keep the complete folder
together. The local packaging copy `assets/os-book.zip` is intentionally ignored
by Git. SHA-256:
`72b447f2cd1c192f2ea15f4cb0d1590f92c6b5f40c971b15c67e4ad41596f8a8`.

No Google Drive credentials or authorization are required. The existing Gemini
key setting is browser-local only; never commit API keys, including reversed
or otherwise encoded copies. Settings also has a standalone text reverser.
Its input/output are not persisted or sent anywhere and are cleared on closing
Settings. Reversing text is not encryption and is not connected to API-key entry.

## Timer

Set a duration from one second to 24 hours. Start begins the countdown, Pause
preserves the remainder, Resume continues it, and Reset restores the configured
duration. Running timers use a wall-clock deadline, so background throttling and
reloads do not restart the countdown. Timer state is local to this browser.
Keep the site open: if it is closed or suspended, the completion overlay appears
when the page next opens or resumes. Dismiss (or Escape) closes the full-screen
"Hey your time is up!" message. It does not navigate away or discard documents.

## Tech Stack

- HTML / CSS / Vanilla JavaScript
- [marked](https://github.com/markedjs/marked) -- Markdown parsing
- [highlight.js](https://highlightjs.org/) -- Code syntax highlighting
- [KaTeX](https://katex.org/) -- LaTeX math rendering
- [DOMPurify](https://github.com/cure53/DOMPurify) -- Sanitize imported Markdown output
- [Google Fonts](https://fonts.google.com/) -- Orbitron, Press Start 2P, Outfit, Lora, Inter
- Google Gemini API -- AI text analysis

## Archived movie feature

The movie UI is removed from the live app. Its complete implementation is saved
on the [archive/movie-player branch](https://github.com/XalebXEn99/study_room/tree/archive/movie-player).
The bridge/resolver tools remain available for development, but the live page
does not load or display the movie player.

<details>
<summary>Historical setup notes (archived version only)</summary>

The right-side **Video / Watch** panel searches movies and series using TMDB
metadata and resolves playback through VidLink, one provider used by StreamPlay.
Click a thumbnail to open the player, select an episode for series, and choose a
stream quality. Native controls provide seeking, volume, and fullscreen; HLS uses
hls.js when necessary. Subtitle selection supports SRT and WebVTT.

This is **not the full StreamPlay extension** or a `.cs3` loader. It runs without
Android, but requires a separate Node.js 22+ bridge for provider requests and media
relaying. Browser JavaScript cannot set the User-Agent needed by the tested media
source, and that source does not return browser CORS permission.

### Local use

**Recommended: keep the live GitHub Pages website and run a helper on the viewing
computer.** In **Video > Video setup**, copy the command and run it in PowerShell
from **any folder**. You do not need to be in the project root:

```powershell
npm exec --yes --package=https://github.com/XalebXEn99/study_room/archive/refs/heads/main.tar.gz -- study-room-helper
```

Requires Node.js 22+ and permission to install/run npm packages. This downloads
and executes this repository's current `main` branch, including its dependencies.
The launcher must be committed and pushed there before this command is available.
If you already have this checkout and dependencies, use `npm run helper` from the
project root instead.

The helper optionally asks for your TMDB API Read Access Token (Enter skips full
search), binds only to `127.0.0.1` on an available port, and opens the **live**
`https://xalebxen99.github.io/study_room/` page with a random pairing token in its
URL fragment. The fragment is removed after pairing; the helper address and token
stay in tab-scoped sessionStorage. The token is not sent to GitHub in HTTP requests.
Do not share the pairing URL, and do not enter personal tokens on an untrusted
computer. The TMDB token stays in the helper's memory.

Keep the terminal open while watching; **Ctrl+C** stops the helper. Approve
local-network access if your browser prompts. This workflow does not require
public HTTPS hosting, port forwarding, or a separately hosted backend. It does
still run a local backend. Browser mixed-content/local-network policies vary;
managed browsers may block it, which the page cannot override. You can manually
open the private pairing URL printed by the helper if automatic opening fails.
`node tools\start-local-helper.mjs --no-open` prints the URL without opening a browser.

Alternatively, serve both the website and bridge locally:

```powershell
npm ci
# Optional for full movie/series search: your own TMDB API Read Access Token
$env:TMDB_READ_TOKEN = "<your-tmdb-read-access-token>"
npm start
```

Open `http://127.0.0.1:4173`, then **Video**. Without a TMDB token, **Try Sintel
(open film)** provides a clearly labeled playback test, not a substitute search
catalogue. TMDB configuration stays on the server. Use authorized media sources.

### GitHub Pages frontend with a hosted bridge

The existing Markdown, study library, timer, Spotify and YouTube features remain static-site
features. GitHub Pages also serves the video panel, but **cannot run its bridge**.
Deploy the same Node application on a separate machine with HTTPS termination
and streaming/range support. Do not use a host that prohibits media relay traffic.

Set these environment variables on that machine:

```powershell
$env:BRIDGE_PUBLIC_URL = "https://your-bridge.example"
$env:FRONTEND_ORIGIN = "https://xalebxen99.github.io"
$env:BRIDGE_TOKEN = "<random-access-token-at-least-32-characters>"
$env:TMDB_READ_TOKEN = "<your-tmdb-read-access-token>"
$env:PORT = "4173"
npm ci
npm start
```

Generate a bridge token locally, for example with
`node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
Do not commit either token. Configure the reverse proxy to your bridge's port.
Public mode binds to all interfaces; local mode binds only to `127.0.0.1`.

On GitHub Pages, open **Video > Bridge connection**, enter the HTTPS bridge origin
and access token, and click **Connect**. The bridge URL is saved locally, while the
access token is kept in tab-scoped sessionStorage. The allowed frontend origin
has no `/study_room/` path. API calls require the bridge token; video and subtitle
requests use random, expiring capability URLs so native browser playback works
without exposing the access token in URLs. Capability URLs must not be shared.

The bridge restricts browser origins, upstream destinations, headers and byte
ranges, and never accepts arbitrary client-supplied upstream URLs. It rewrites HLS
playlists, segments and key references. Remote hosts can still refuse requests,
rate-limit, expire links, or return unsupported codecs. Link labels say
**not checked**, **playing**, **played**, or **failed** rather than promising every link works.
Refresh links if a source expires. Long-idle playback sessions expire.

### Verification and resolver CLI

```powershell
npm test
# Sintel, an openly licensed Blender short (TMDB 45745)
node tools\streamplay-resolver.mjs 45745
# Also check the first candidate with a bounded media range request
node tools\streamplay-resolver.mjs 45745 --probe
# TV: TMDB ID, season, episode
node tools\streamplay-resolver.mjs <tmdb-id> <season> <episode>
```

The CLI returns JSON containing stream candidates, required headers, upstream
proxy hints, and subtitles. The bridge uses `enc-dec.app` to obtain a provider token, then
queries `vidlink.pro`; the requested TMDB ID is sent to both services. Neither
service is controlled by this project. Network access, their availability, and
authorized source access are required. No embedded upstream keys or Kotlin code
are included.

Protocol research used the public
[StreamPlay fork at commit 3f4f271](https://github.com/mahmoodnizamani94-png/cloudstream-extensions-phisher/tree/3f4f271d3500bd168e61ddab98dcb0dbadb9df9f/StreamPlay).
The original repository states GPLv3-or-later, but this fork has no root license
file; establish licensing/provenance before copying its implementation.

Live browser validation played Sintel at 720p through the bridge, switched to 360p,
sought past two minutes, and loaded English subtitles. These tests do not promise
availability for other titles or every upstream quality. TMDB search/episode
integration is covered with test fixtures; live full search requires your token.
`--probe` verifies only an MP4 header or HLS manifest, not complete decoding or all
HLS segments. Stream URLs may expire and should not be committed or shared.

</details>
