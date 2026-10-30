# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Public-Util** ist die persönliche statische Website (spizza.cc) – Portfolio plus
öffentlich gehostete Utility-Skripte. Kein Build-Prozess, kein Package-Manager –
reines HTML/CSS/JS, deployed via GitHub Pages (`.github/workflows/static.yml`, Push auf `main`).

## Architecture

### Website (index.html / scripts.js / styles.css)

Single-Page („Journey“): ein gepinnter, scroll-gesteuerter Szenenlauf mit 6 Kapiteln
(Hero, About, Skills, Projects, Contact, Utilities). Bewusst **nur Google Fonts** als
externe Abhängigkeit; keine Frameworks (kein Bootstrap/AOS/Font Awesome/Prism – wurde
2026-10-30 entfernt). Icons sind als Inline-SVG-Sprite (`<symbol>`-Defs) in `index.html`.

- Deep-Links: Kapitel per `#about`, `#skills`, `#projects`, `#contact`, `#utilities`
  erreichbar; `scripts.js` mappt Hash ↔ Scroll-Position (`CHAPTER_SLUGS`).
- `prefers-reduced-motion`: Szene entpinnt zu normal gestapelter Longpage
  (`journey--static`), Typing-Effekt entfällt.
- `scripts.js` lädt den `ssh`-File vom eigenen Origin in die Utilities-Zeile;
  Copy-Buttons schreiben den vollständigen Inhalt in die Clipboard-API.

### Branding / Icons

`favicon.svg` = „MS“-Monogramm im Seiten-Akkord (Gradient `#38bdf8 → #0ea5e9`,
dunkle Schrift `#04121c`). SVG ist Master; alle PNG-Derivate (favicon.ico 16–48,
apple-touch-icon 180, icon-192/512 fürs Manifest) werden erzeugt mit:

```
python3 tools/gen-icons.py   # nur Pillow nötig; Geometrie = Polygone wie im SVG
```

Beim Ändern des Logos: zuerst `favicon.svg`, dann Polygone in `tools/gen-icons.py`
nachziehen und PNGs neu generieren; beides committen.

### Hosted Utility Scripts

Plain-Text-Skripte im Repo-Root, direkt unter `spizza.cc/<filename>` abrufbar zum
Pipen in Shells. Jedes Skript ist unabhängig vom Rest des Repos:

| File | Type | Purpose |
|------|------|---------|
| `ssh` | plain text | SSH public key |
| `windows-repair` | PowerShell | Windows-Diagnose (DISM, SFC, chkdsk) mit ntfy-Notifications |
| `clean.bat` | Batch | Löscht Temp-Dateien (User-Temp und `C:\Windows\Temp`) |
| `autoKeyInstallation.bat` | Batch | Windows-Aktivierung per KMS (`slmgr`) |
| `send` | Bash | File-Uploader zu Jirafeau mit Gotify-Push |
| `rotation` | PowerShell | Auto-Rotation aktivieren (HKLM-Reg) |
| `upside-down` | PowerShell | 180°-Display-Toggle (DEVMODE, Admin-Relaunch) |
| `u` | PowerShell | Orientierungs-Toggle via ChangeDisplaySettingsEx (User-Ebene) |
| `launch-rs` | PowerShell | Roblox-Studio-Project-Launcher |
| `brainrot` / `brainrot.vbs` / `ps` | PowerShell/VBS | PRANK-Skripte |

## Notes

- HTTP→HTTPS: GitHub Pages erzwingt HTTPS auf der Custom-Domain nicht zuverlässig;
  der Inline-Redirect in `index.html` bleibt deshalb drin (Pages-Einstellung
  „Enforce HTTPS“ separat prüfen, wenn geändert).
- Deployment: Push auf `main` reicht; Pages-Workflow baut das komplette Repo als Artefakt.

## Hosting-Migration (geplant)

Das Repo zieht bald von GitHub nach OneDev (`git.spizza.cc`), die Seite wird selbst
gehostet und verschwindet von GitHub Pages. Dann entfällt `.github/workflows/static.yml`;
Deployment-Weg wird dort neu festgelegt.
