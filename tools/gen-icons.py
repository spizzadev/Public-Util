#!/usr/bin/env python3
"""Erzeugt die Favicon-/Icon-PNGs aus derselben Geometrie wie favicon.svg.

Nutzung (aus Repo-Wurzel):  python3 tools/gen-icons.py
Abhängig:  Pillow

Ausgaben im Repo-Root:
  favicon-16x16.png  favicon-32x32.png  favicon-ico (favicon.ico: 16/24/32/48)
  apple-touch-icon.png (180, vollflächig)  icon-192.png  icon-512.png
"""
from PIL import Image, ImageDraw

SIZE = 512
SS = 8  # Supersampling für saubere Kanten
BG_A = (56, 189, 248)   # --accent   #38bdf8
BG_B = (14, 165, 233)   # --accent-deep #0ea5e9
FG = (4, 18, 28)        # #04121c
RADIUS = 112

# Dieselben Polygone wie die Pfade in favicon.svg (512er Raster)
M_POLY = [(86, 360), (86, 152), (144, 152), (179, 233), (214, 152), (272, 152),
          (272, 360), (220, 360), (220, 246), (179, 333), (138, 246), (138, 360)]
S_POLY = [(298, 152), (426, 152), (426, 204), (350, 204), (350, 230), (426, 230),
          (426, 360), (298, 360), (298, 308), (374, 308), (374, 282), (298, 282)]


def gradient(size: int) -> Image.Image:
    """Diagonaler Verlauf BG_A -> BG_B (135 deg wie im CSS)."""
    small = Image.new("RGB", (64, 64))
    px = small.load()
    for y in range(64):
        for x in range(64):
            t = (x + y) / (2 * 63)
            px[x, y] = tuple(round(a + (b - a) * t) for a, b in zip(BG_A, BG_B))
    return small.resize((size, size), Image.LANCZOS)


def build(px_size: int, rounded: bool = True) -> Image.Image:
    canvas = px_size * SS
    img = gradient(canvas).convert("RGBA")
    if rounded:
        mask = Image.new("L", (canvas, canvas), 0)
        ImageDraw.Draw(mask).rounded_rectangle(
            [0, 0, canvas - 1, canvas - 1], radius=RADIUS * SS, fill=255)
        img.putalpha(mask)
    draw = ImageDraw.Draw(img)
    scale = canvas / SIZE
    for poly in (M_POLY, S_POLY):
        draw.polygon([(x * scale, y * scale) for x, y in poly], fill=FG + (255,))
    return img.resize((px_size, px_size), Image.LANCZOS)


def main() -> None:
    ico_sizes = [16, 24, 32, 48]
    for px in sorted(set(ico_sizes + [180, 192, 512])):
        if px == 180:  # apple-touch-icon: iOS rundet selbst -> vollflächig
            build(px, rounded=False).save("apple-touch-icon.png")
            continue
        img = build(px)
        if px == 192:
            img.save("icon-192.png")
        elif px == 512:
            img.save("icon-512.png")
        elif px == 16:
            img.save("favicon-16x16.png")
        elif px == 32:
            img.save("favicon-32x32.png")
    icos = {px: build(px) for px in ico_sizes}
    icos[16].save("favicon.ico", sizes=[(s, s) for s in ico_sizes], append_images=[])
    print("OK:", ", ".join(["favicon.ico", "favicon-16x16.png", "favicon-32x32.png",
                            "apple-touch-icon.png", "icon-192.png", "icon-512.png"]))


if __name__ == "__main__":
    main()
