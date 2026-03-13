# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Public-Util** is a personal static website (spizza.cc) that serves as a portfolio and hosts public utility scripts. No build process, no package manager — pure HTML/CSS/JS deployed via GitHub Pages.

## Deployment

Changes pushed to `main` are auto-deployed to GitHub Pages via `.github/workflows/static.yml`. No manual deploy steps.

## Architecture

### Website (index.html / scripts.js / styles.css)

Single-page layout with sections: hero, about, skills, projects, contact, and a utilities section. All dependencies are loaded from CDN (Bootstrap 5, Prism.js, Font Awesome, AOS).

`scripts.js` dynamically fetches the `ssh` and `signing` files from the same origin to display public keys in the UI. Copy-to-clipboard buttons reference these loaded values.

### Hosted Utility Scripts

Plain-text scripts served directly at `spizza.cc/<filename>` — meant to be piped into shells or run directly. Each script is a standalone file with no dependencies on the rest of the repo:

| File | Type | Purpose |
|------|------|---------|
| `ssh` | plain text | SSH public key |
| `signing` | plain text | GPG signing public key |
| `windows-repair` | PowerShell | Windows system diagnostics (DISM, SFC, chkdsk) with ntfy notifications |
| `send` | Bash | File uploader to Jirafeau with Gotify push notifications |
| `ps` | PowerShell | Prank script |
| `brainrot` | PowerShell | Fetches and runs brainrot.vbs |
| `launch-rs` | PowerShell | Roblox Studio project launcher |

### Key Files

- `index.html` — all page structure and content
- `styles.css` — CSS variables, animations, responsive layout
- `scripts.js` — typing animation, key loading, copy buttons, particle effect
