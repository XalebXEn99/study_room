# Study Room

A browser-based study room with a Markdown reader, multiple themes, multi-file tabs, dedicated media panels, and AI-powered text analysis.

Live at: **https://xalebxen99.github.io/study_room/**

## Features

- **Blank Editor** -- Start writing immediately in an empty document, with a quiet placeholder instead of a central title or upload box. New documents and closing the last tab also return to a blank editor.
- **Study quotes** -- 24 motivational messages rotate every 12 seconds above the timer in an italic serif font. Rotation pauses while the tab is hidden and never starts audio.
- **Book encouragement** -- Click the book beside the logo for a comic-style speech bubble and a matching Sam Sumit - Calm & Friendly recording from ElevenLabs. One more works through a shuffled deck without repeating until all 24 messages have been shown. Replay voice repeats the current recording; Voice on/off is saved on this device. Closing the popup, pressing Escape or leaving the tab stops its voice.
- **Upload & Render** -- Drag and drop or browse to select `.md` files, rendered instantly with GitHub-style formatting
- **Multi-file Tabs** -- Open multiple Markdown files at once and switch between them with tabs. Local collections and drafts persist in localStorage across refreshes. Closing a tab does not delete its collection item; click or drag it from Study files to reopen the same document. Storage failures are shown explicitly; unreadable stored drafts are not overwritten by a blank starter.
- **Study files** -- Initially shows only the local Markdown drop/browse area. Uploaded files populate **Uploads**; New documents populate **Created**. The automatic blank starter appears in Created only after writing or renaming it. Use each row's pencil to rename a file (Enter confirms, Escape cancels); names retain a `.md` extension. A download icon marks created files and uploads changed from their original/last-downloaded content or filename. Untouched uploads have no icon. Download initiates a copy and clears the indicator; later changes restore it. Browser downloads cannot confirm that a copy was retained, and local autosave does not write to the original disk file. Older drafts without a known save baseline conservatively require a download.
- **Bundled resources** -- Click **Ready** five times within two seconds while the timer is idle to reveal seven maths notes, the SDP exam tips note and the OS-book ZIP. The reveal lasts for this page visit; it is a UI Easter egg, not access control, and the bundled resources remain public. Notes still open by clicking or dragging into the editor. The SDP note includes development links, an AI security checklist and a Docker-lab revision guide.
- **Study timer** -- Matches the left-hand panels' combined height on desktop, with its status at the top-right. Choose Pomodoro (25 min), Feynman (20 min), Deep work (50 min), Break (5 min), or a custom duration, then Start. Presets pause selection during an active session; Reset unlocks them. Breaks are started manually. Pause/Resume and the full-screen "Hey your time is up!" overlay still work.
- **Study checklist** -- Add study goals beneath Study files, tick them off, or remove them. Goals and completion are saved on this device.
- **Saved media** -- YouTube contains only the SDP - Software Development Party playlist; the earlier individual videos have been removed. The three Spotify playlists are unchanged. Playlist choices collapse when music starts; expand Playlists to change them. External links remain available.
- **Compact players** -- Music and YouTube switch to player-only views after media loads. The up arrow expands settings; the down arrow returns to the player. Minus minimises to the corner button without unloading media. With nothing loaded, opening a player shows its setup controls.
- **Icon-only media buttons** -- Music and YouTube use compact corner icons with accessible labels and tooltips. While Spotify reports active playback, an animated equalizer replaces the music icon and appears beside the track title in the open player. It stops on pause, playback loss/errors or logout; reduced-motion users get a static indicator. This is a playback indicator, not an audio-frequency visualizer.
- **Themes** -- Open Theme, then expand **Legacy** for the original 12 themes or **Graphic Design** for 22 styles: Minimalism, Maximalism, Futuristic, Vector Art, Collage Art, Retro, Cyberpunk, Pop Art, Glassmorphism, Clay Style, Pixel Art, Editorial, Y2K, Swiss Design, Surreal Design, Bohemian, Victorian Style, Graffiti, Aurora, Handwritten, **Cityscape** and **90s Anime**. Each changes the workspace, editor, Markdown, study tools, media and dialogs. Themes still persist per document and across reloads.
  - Visual references: [Kittl's design-style guide](https://www.kittl.com/blogs/design-styles-name-stl/) and [Nielsen Norman Group on glassmorphism](https://www.nngroup.com/articles/glassmorphism/). Decorative typography stays in headings, source code and maths retain their own fonts, and backgrounds do not move the study layout.
- **AI Text Analysis** -- Highlight any text in the rendered Markdown and click "Ask AI" to ask questions about the selection (powered by Google Gemini)
- **LaTeX Math** -- Inline `\( ... \)` / `$ ... $` and display `\[ ... \]` / `$$ ... $$` formulas render with KaTeX; code blocks are left alone
- **Syntax Highlighting** -- Code blocks are highlighted with highlight.js, theme-matched
- **Client-Side Workspace** -- Markdown, study files, the timer, checklist and music players run in your browser.
- **Workspace Panels** -- Study files and the checklist sit on the left; the timer sits on the right, aligned with Edit/Preview on desktop. Music stays within the sidebar width in the bottom-left corner and YouTube stays in the bottom-right, including while scrolling. Both players start collapsed, use the active theme and have bounded heights. Narrow screens keep them side by side at reduced widths.

For Spotify sign-in, register `https://xalebxen99.github.io/study_room/` as a redirect URI in your Spotify app settings.

### Cityscape design research

This theme is a quiet dusk interpretation of 1990s cel-animation craft, not a
claim that every anime of the period used the same palette.

- [Loppo's cel-painting explanation](https://loppo.co.jp/en/artcel) describes painted transparent layers placed over backgrounds and photographed. The UI translates this into opaque cream surfaces, ink outlines and offset cel-like shadows.
- [Ghibli Museum's colour-design exhibition](https://www.ghibli-museum.jp/en/exhibitions/013128/) explains colour choices through lighting, weather and material. The theme separates warm reading paper, navy ink, rose accents and a cool-to-warm dusk sky.
- [James Gurney's analysis of Kazuo Oga's painting process](https://gurneyjourney.blogspot.com/2017/03/demo-by-kazuo-oga.html) describes soft wet-blended atmospheric passages followed by fine detail. The original [dusk artwork](assets/themes/90s-anime-sky.svg) combines softly layered clouds with hills, buildings and utility lines.

The backdrop and its faint grain are decorative only. Text, code and maths
remain sharp on solid surfaces: there is no VHS distortion or scanline overlay
on reading content. The SVG is original artwork, with no copied anime stills,
logos or characters. The existing fixed players and floating timer keep their
normal positions.

### 90s Anime: action-animation backgrounds

The rebuilt theme takes its harder-edged visual direction from the supplied
Street Fighter II, Tekken, Landlock and Fatal Fury movie references, plus
Hellsing (2001) and Devil May Cry (2007). The latter two are companion
references, not 1990s productions. Reference checking included YouTube
seek-preview scenes from the supplied playlist; full playback was unavailable
in the embedded research browser.

- [Discotek's Street Fighter II release](https://www.discotekmedia.com/street-fighter-ii-the-animated-movie-4k-ultra-hd-blu-ray-primary.htm)
- [Discotek's Fatal Fury release](https://www.discotekmedia.com/fatal_fury_the_movie_blu_ray.htm)
- [GONZO's original Hellsing page](https://www.gonzo.co.jp/works/hellsing/index.html)

Four distinct, original AI-generated illustrations rotate through crimson-red
harbour dusk, jade-green moonlit ruins, ochre-yellow cliffside light and
cobalt-blue storm scenery. They emphasise hand-inked contours, angular faces
and fabric folds, broad cel-like shadow planes and painted environments.
No movie frames, franchise characters or logos are bundled.

Backgrounds crossfade over 1.4 seconds every 45 seconds, only while **90s Anime**
is selected and the tab is visible. Open Theme > Graphic Design for Pause
and Next controls; manual Next also works while paused. Reduced motion disables
automatic changes and fades, but still allows manual selection. Image failures
stop automatic rotation, log an error and show a message in those controls.
Solid warm-ink panels shift subtly with each scene's palette; text, maths and
code stay sharp. There are no scanline overlays, content filters or transforms
that move the fixed media players or floating timer. Cityscape preserves the
previous pastel SVG theme separately. Existing saved 90s Anime selections now
use this rebuilt design without changing document content.

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

The left panel contains the seven approved maths notes in `assets/maths/`
and [SDP exam tips](assets/sdp/SDP-Exam-Tips.md) in a separate SDP section.
The SDP note summarises the supplied SvelteKit/PostgreSQL containerisation lab;
the original lab files, credentials and private paths are not published.
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

When the main countdown scrolls out of view, a small top-right timer shows the
same remaining time and Ready/Running/Paused/finished state. Click it to return
to the timer controls. It disappears when the full countdown is visible again;
it does not create a second timer or announce every tick to screen readers.

## Encouragement recordings

The 24 recordings in `assets/motivation/` use the selected **Sam Sumit - Calm &
Friendly** ElevenLabs voice. Playback uses bundled MP3 files; no ElevenLabs API
key, account token, live synthesis request or recurring generation cost is
needed by visitors. Only opening the book popup, choosing One more, Replay
voice or enabling the voice can start a recording. Music and YouTube are not
restarted or unloaded by the popup.

Attribution is shown in the popup and included in each recording's title.
Treat these bundled recordings as **non-commercial** and retain the
`elevenlabs.io` attribution. Do not assume the site licence grants commercial
rights to the voice or recordings; obtain appropriate rights and regenerate
recordings under a suitable licence before commercial reuse.
See [ElevenLabs' publication terms](https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform).

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
