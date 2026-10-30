# Public-Util

Persönliche statische Website ([spizza.cc](https://spizza.cc)) plus öffentlich gehostete
Utility-Skripte. Kein Build-Prozess, kein Package-Manager – reines HTML/CSS/JS,
deployt via GitHub Pages (`.github/workflows/static.yml` bei Push auf `main`).

## Website

- `index.html` – kompletter Seiteninhalt (Single-Page mit „Journey“-Szenenlauf)
- `styles.css` – Design (Glass/aurora), Responsive, Reduced-Motion
- `scripts.js` – Scroll-/Kapitel-Steuerung, Deep-Links, Copy-Buttons, SSH-Fetch
- Icons: Inline-SVG-Sprite in `index.html` – bewusst **kein** Font Awesome / Bootstrap / Prism

### Deep-Links

Die Kapitel sind direkt verlinkbar: `#home`, `#about`, `#skills`, `#projects`,
`#contact`, `#utilities`. Ohne JS/Animation (`prefers-reduced-motion`) wird die
Seite zu einem normal gestapelten Longpage.

### Branding / Favicon

`favicon.svg` ist das „MS“-Monogramm (Eiskachel im Seiten-Akkord `#38bdf8 → #0ea5e9`).
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

## Lizenz

GPL v3, siehe [LICENSE](LICENSE).
