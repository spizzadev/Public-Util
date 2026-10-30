# Public-Util

Persönliche statische Website ([spizza.cc](https://spizza.cc)) plus öffentlich gehostete
Utility-Skripte. Kein Build-Prozess, kein Package-Manager – reines HTML/CSS/JS,
deployt via GitHub Pages (`.github/workflows/static.yml` bei Push auf `main`).

## Website

- `index.html` – kompletter Seiteninhalt (Hero + echte Sektionen: About, Skills, Projects, Contact, Utilities)
- `styles.css` – Design (Marke „Paper & Glut“: warmes Nachtschwarz, Glut-Akzent `#f97316`/`#c2410c`), Responsive, Reduced-Motion
- `scripts.js` – Scroll-Reveal (IntersectionObserver), Scroll-Spy, Copy-Buttons, SSH-Fetch
- Icons: Inline-SVG-Sprite in `index.html` – bewusst **kein** Font Awesome / Bootstrap / Prism
- **Performance-Regeln:** kein `backdrop-filter`, keine animierten `filter:blur()`-Flächen,
  keine Scroll-Handler mit Layout-Reads (`offsetHeight`); Animationen nur mit `transform`/`opacity`

### Deep-Links

Die Sektionen sind echte Anker und direkt verlinkbar: `#home`, `#about`, `#skills`,
`#projects`, `#contact`, `#utilities`. Ohne JS ist die Seite vollständig lesbar;
`prefers-reduced-motion` schaltet alle Animationen ab.

### Branding / Favicon

Teil der persönlichen Marke „Paper & Glut“ (Anker: das Movember-Designsystem,
siehe Workspace `brand/BRAND.md`): warme Papier- und Nacht-Töne, eine Akzentfarbe
Glut-Orange. `favicon.svg` ist das „MS“-Monogramm (Glut-Kachel `#f97316 → #c2410c`,
helle Schrift `#fff1e6`).
Alle PNG-Derivate (ICO, Apple-Touch, Manifest-Icons) werden reproduzierbar erzeugt:

```
python3 tools/gen-icons.py
```

Abhängig ist nur Pillow (`pip install pillow`).

## Gehostete Skripte

Plain-Text-Dateien im Repo-Root, erreichbar unter `https://spizza.cc/<dateiname>` –
zum Direkt-Pipen in Shells:

| Datei | Typ | Zweck |
|------|------|---------|
| `ssh` | Text | SSH-Public-Key |
| `windows-repair` | PowerShell | Windows-Diagnose/-Reparatur (DISM, SFC, chkdsk) mit ntfy-Benachrichtigung |
| `clean.bat` | Batch | Löscht Temp-Dateien (User-Temp und `C:\Windows\Temp`) |
| `autoKeyInstallation.bat` | Batch | Windows-Aktivierung per KMS (`slmgr`) |
| `send` | Bash | Datei-Upload zu Jirafeau mit Gotify-Push |
| `rotation` | PowerShell | Auto-Rotation unter Windows aktivieren |
| `upside-down` | PowerShell | Bildschirm um 180° drehen (Toggle) |
| `u` | PowerShell | Screen-Orientierung per WinAPI toggeln (ohne Admin) |
| `launch-rs` | PowerShell | Roblox-Studio-Projektstarter |
| `brainrot` | PowerShell | Führt `brainrot.vbs` aus (PRANK) |
| `ps` | PowerShell | PRANK-Skript |

Beispiel:

```powershell
irm https://spizza.cc/windows-repair | iex
```

## Benchmark

`tools/bench-lighthouse.sh [alter-commit]` vergleicht die Lighthouse-Performance
von altem und neuem Design lokal (Chromium + Lighthouse müssen installiert sein).

## Lizenz

GPL v3, siehe [LICENSE](LICENSE).
