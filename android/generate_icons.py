#!/usr/bin/env python3
"""Generate icon.png and adaptive-icon.png from the pixel lantern design."""

from PIL import Image, ImageDraw

BG       = (11, 11, 22, 255)    # #0b0b16
GLASS_BG = (30, 30, 46, 255)    # #1e1e2e
IVORY    = (253, 240, 213, 255) # #fdf0d5
ORANGE   = (244, 162, 97,  255) # #f4a261
PEACH    = (255, 180, 162, 255) # #ffb4a2

def rgba(hex_color, opacity=1.0):
    h = hex_color.lstrip('#')
    r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    return (r, g, b, int(opacity * 255))

def draw_lantern(draw, scale, ox, oy):
    def r(x, y, w, h, fill, opacity=1.0):
        x0 = int(ox + x * scale)
        y0 = int(oy + y * scale)
        x1 = int(ox + (x + w) * scale)
        y1 = int(oy + (y + h) * scale)
        color = fill[:3] + (int(opacity * 255),)
        draw.rectangle([x0, y0, x1, y1], fill=color)

    # Handle
    r(42, 0,  16, 4,  IVORY)
    r(36, 4,  6,  4,  IVORY)
    r(58, 4,  6,  4,  IVORY)
    r(32, 8,  4,  4,  IVORY)
    r(64, 8,  4,  4,  IVORY)
    r(32, 12, 4,  10, IVORY)
    r(64, 12, 4,  10, IVORY)
    # Top cap
    r(18, 22, 64, 6,  IVORY)
    r(12, 28, 76, 8,  IVORY)
    # Frame uprights
    r(12, 36, 6,  102, IVORY)
    r(82, 36, 6,  102, IVORY)
    # Glass top & bottom
    r(18, 36,  64, 4,  IVORY)
    r(18, 134, 64, 4,  IVORY)
    # Glass interior
    r(18, 40, 64, 94, GLASS_BG)
    # Flame body
    r(36, 80, 28, 42, ORANGE)
    # Flame tip (peach)
    r(40, 72, 20, 10, PEACH)
    # Flame tip (white)
    r(44, 66, 12, 8,  IVORY)
    # Inner glow — semi-transparent orange over the flame (composited correctly)
    r(28, 88, 44, 28, ORANGE, 0.4)
    # Decorative strut — faint ivory line
    r(48, 40, 4,  94, IVORY, 0.18)
    # Bottom cap
    r(12, 138, 76, 8, IVORY)
    r(18, 146, 64, 6, IVORY)
    # Feet
    r(24, 152, 14, 12, IVORY)
    r(62, 152, 14, 12, IVORY)


def add_halo(base_img, cx, cy, radius):
    """Radial orange glow composited over the base image."""
    halo = Image.new('RGBA', base_img.size, (0, 0, 0, 0))
    hd = ImageDraw.Draw(halo)
    steps = 80
    for i in range(steps, 0, -1):
        frac = i / steps
        stop = 0.55
        if frac > stop:
            alpha = int(255 * 0.45 * (frac - stop) / (1.0 - stop))
        else:
            alpha = 0
        r = int(radius * frac)
        hd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(244, 162, 97, alpha))
    return Image.alpha_composite(base_img, halo)


def make_icon(size, lantern_scale, with_halo=True):
    # Build on RGBA canvas so alpha compositing works correctly
    img = Image.new('RGBA', (size, size), BG)
    draw = ImageDraw.Draw(img)

    lw = 100 * lantern_scale
    lh = 170 * lantern_scale
    ox = (size - lw) / 2
    oy = (size - lh) / 2

    draw_lantern(draw, lantern_scale, ox, oy)

    if with_halo:
        cx = size // 2
        cy = int(oy + lh // 2)
        img = add_halo(img, cx, cy, int(size * 0.6))

    return img.convert('RGB')


base = '/Users/angshumannandy/Angshuman/projects/storybook/android/assets'

icon = make_icon(1024, lantern_scale=2.7, with_halo=True)
icon.save(f'{base}/icon.png')
print("Wrote assets/icon.png")

adaptive = make_icon(1024, lantern_scale=2.0, with_halo=True)
adaptive.save(f'{base}/adaptive-icon.png')
print("Wrote assets/adaptive-icon.png")
