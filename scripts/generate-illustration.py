#!/usr/bin/env python3
"""
Generate topographic field illustration SVG (B1 style: brand green/gold).
Uses real GPS → pixel projection matching plot-field.json imageBounds.
"""
import math

# ── Image / bounds ─────────────────────────────────────────────────────────
W, H = 1024, 718

IMAGE_BOUNDS = {
    "minLat": 40.25237050, "maxLat": 40.25273795,
    "minLng": 44.53411102, "maxLng": 44.53479767,
}

FIELD_CORNERS = [
    {"lat": 40.25260122, "lng": 44.53419455},  # TL
    {"lat": 40.25267617, "lng": 44.53440019},  # TR
    {"lat": 40.25254870, "lng": 44.53461399},  # BR
    {"lat": 40.25243123, "lng": 44.53429019},  # BL
]

COLS, ROWS = 14, 15

def proj(lat, lng):
    b = IMAGE_BOUNDS
    x = (lng - b["minLng"]) / (b["maxLng"] - b["minLng"]) * W
    y = (b["maxLat"] - lat) / (b["maxLat"] - b["minLat"]) * H
    return (x, y)

def lerp(a, b, t):
    return (a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t)

def bilerp(tl, tr, br, bl, u, v):
    top = lerp(tl, tr, u)
    bot = lerp(bl, br, u)
    return lerp(top, bot, v)

# ── Project field corners ───────────────────────────────────────────────────
TL = proj(FIELD_CORNERS[0]["lat"], FIELD_CORNERS[0]["lng"])
TR = proj(FIELD_CORNERS[1]["lat"], FIELD_CORNERS[1]["lng"])
BR = proj(FIELD_CORNERS[2]["lat"], FIELD_CORNERS[2]["lng"])
BL = proj(FIELD_CORNERS[3]["lat"], FIELD_CORNERS[3]["lng"])

def pt(p): return f"{p[0]:.1f},{p[1]:.1f}"
def pts(ps): return " ".join(pt(p) for p in ps)

# centroid
cx = sum(p[0] for p in [TL,TR,BR,BL]) / 4
cy = sum(p[1] for p in [TL,TR,BR,BL]) / 4

# field bounding box for ring sizing
field_w = math.dist(TL, TR)
field_h = math.dist(TL, BL)
field_diag = math.dist(TL, BR)

# field polygon string
field_poly = pts([TL, TR, BR, BL])

# ── Grid lines ──────────────────────────────────────────────────────────────
h_lines = []  # horizontal (row direction)
for r in range(ROWS + 1):
    t = r / ROWS
    s = lerp(TL, BL, t)
    e = lerp(TR, BR, t)
    h_lines.append((s, e))

v_lines = []  # vertical (col direction)
for c in range(COLS + 1):
    t = c / COLS
    s = lerp(TL, TR, t)
    e = lerp(BL, BR, t)
    v_lines.append((s, e))

# ── Topo rings (concentric polygons offset outward from field) ──────────────
def offset_polygon(corners, amount):
    """Expand polygon outward by `amount` pixels (simple centroid-based offset)."""
    cx_ = sum(p[0] for p in corners) / len(corners)
    cy_ = sum(p[1] for p in corners) / len(corners)
    result = []
    for p in corners:
        dx, dy = p[0]-cx_, p[1]-cy_
        d = math.sqrt(dx*dx + dy*dy)
        if d == 0:
            result.append(p)
        else:
            result.append((cx_ + dx/d*(d+amount), cy_ + dy/d*(d+amount)))
    return result

field_corners_px = [TL, TR, BR, BL]
ring_offsets = [30, 65, 108, 160, 222, 295, 380]
ring_colors = ["#3D7A35", "#336828", "#2A5820", "#224A18", "#1A3E12", "#12340C", "#0C2A08"]
ring_opacities = [0.9, 0.8, 0.7, 0.65, 0.6, 0.55, 0.5]
ring_stroke_colors = ["#5A9B50", "#4A8840", "#3D7A35", "#306028", "#264E20", "#1E4018", "#163410"]

# ── Trees (right side of field, matching satellite) ─────────────────────────
# Place trees near TR/BR area
tree_positions = [
    (BR[0]+18, BR[1]-22, 18, "#1E5218", "#2D6B25"),
    (BR[0]+32, BR[1]-38, 13, "#2D6B25", "#3D7A35"),
    (BR[0]+10, BR[1]-42, 10, "#1E5218", "#2D7A1A"),
    (TR[0]+28, TR[1]+18, 14, "#2D6B25", "#1E5218"),
    (TR[0]+42, TR[1]+32, 10, "#1E5218", "#3D7A35"),
]

# ── SVG output ──────────────────────────────────────────────────────────────
lines = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
    '<defs>',
    '  <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">',
    '    <stop offset="0%" stop-color="#243D1C"/>',
    '    <stop offset="100%" stop-color="#0E1E0A"/>',
    '  </radialGradient>',
    '  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">',
    '    <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#000" flood-opacity="0.4"/>',
    '  </filter>',
    '  <filter id="glow">',
    '    <feGaussianBlur stdDeviation="3" result="blur"/>',
    '    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>',
    '  </filter>',
    '</defs>',
    '',
    '<!-- Background -->',
    f'<rect width="{W}" height="{H}" fill="url(#bgGrad)"/>',
    '',
    '<!-- Topo rings (outermost first) -->',
]

for i, (offset, color, opacity, stroke) in enumerate(zip(
    reversed(ring_offsets), reversed(ring_colors),
    reversed(ring_opacities), reversed(ring_stroke_colors)
)):
    ring = offset_polygon(field_corners_px, offset)
    lines.append(f'<polygon points="{pts(ring)}" fill="{color}" fill-opacity="{opacity}" stroke="{stroke}" stroke-width="0.8" stroke-opacity="0.6"/>')

lines += [
    '',
    '<!-- Field fill -->',
    f'<polygon points="{field_poly}" fill="#3D7A35" fill-opacity="0.92"/>',
    '',
    '<!-- Grid lines — horizontal -->',
    '<g stroke="#6AAA55" stroke-width="0.55" stroke-opacity="0.45">',
]
for s, e in h_lines:
    lines.append(f'  <line x1="{s[0]:.1f}" y1="{s[1]:.1f}" x2="{e[0]:.1f}" y2="{e[1]:.1f}"/>')
lines += [
    '</g>',
    '',
    '<!-- Grid lines — vertical -->',
    '<g stroke="#6AAA55" stroke-width="0.55" stroke-opacity="0.45">',
]
for s, e in v_lines:
    lines.append(f'  <line x1="{s[0]:.1f}" y1="{s[1]:.1f}" x2="{e[0]:.1f}" y2="{e[1]:.1f}"/>')
lines += [
    '</g>',
    '',
    '<!-- Field border — gold glow -->',
    f'<polygon points="{field_poly}" fill="none" stroke="#C49A3C" stroke-width="3" stroke-opacity="0.3" filter="url(#glow)"/>',
    f'<polygon points="{field_poly}" fill="none" stroke="#C49A3C" stroke-width="1.8"/>',
    '',
    '<!-- Corner markers -->',
]
for corner in [TL, TR, BR, BL]:
    lines.append(f'<circle cx="{corner[0]:.1f}" cy="{corner[1]:.1f}" r="3.5" fill="#C49A3C"/>')
    lines.append(f'<circle cx="{corner[0]:.1f}" cy="{corner[1]:.1f}" r="6" fill="none" stroke="#C49A3C" stroke-width="1" stroke-opacity="0.5"/>')

lines += [
    '',
    '<!-- Trees — right/upper-right of field -->',
]
for tx, ty, r, c1, c2 in tree_positions:
    lines.append(f'<circle cx="{tx:.1f}" cy="{ty:.1f}" r="{r+3}" fill="{c1}" opacity="0.85"/>')
    lines.append(f'<circle cx="{tx:.1f}" cy="{ty:.1f}" r="{r}" fill="{c2}" opacity="0.9"/>')
    lines.append(f'<circle cx="{tx-r*0.25:.1f}" cy="{ty-r*0.25:.1f}" r="{r*0.45:.1f}" fill="#5AAA40" opacity="0.35"/>')

lines += [
    '',
    '<!-- Compass rose — top right -->',
    '<g transform="translate(960, 52)">',
    '  <circle r="28" fill="#1A2E1B" fill-opacity="0.88" stroke="#3D7A35" stroke-width="1.2"/>',
    '  <circle r="24" fill="none" stroke="#2D5A27" stroke-width="0.5" stroke-dasharray="3 3"/>',
    '  <!-- N pointer -->',
    '  <polygon points="0,-18 3,0 0,6 -3,0" fill="#C49A3C"/>',
    '  <!-- S pointer -->',
    '  <polygon points="0,18 2,0 0,-4 -2,0" fill="#3D7A35" opacity="0.6"/>',
    '  <!-- E/W ticks -->',
    '  <line x1="-18" y1="0" x2="-14" y2="0" stroke="#5A9B50" stroke-width="1"/>',
    '  <line x1="14" y1="0" x2="18" y2="0" stroke="#5A9B50" stroke-width="1"/>',
    '  <text x="0" y="-20" text-anchor="middle" font-size="9" fill="#C49A3C" font-family="Georgia, serif" font-weight="600">N</text>',
    '  <text x="0" y="27" text-anchor="middle" font-size="7" fill="#5A9B50" font-family="Georgia, serif">S</text>',
    '  <text x="-22" y="3" text-anchor="middle" font-size="7" fill="#5A9B50" font-family="Georgia, serif">W</text>',
    '  <text x="22" y="3" text-anchor="middle" font-size="7" fill="#5A9B50" font-family="Georgia, serif">E</text>',
    '</g>',
    '',
    '<!-- Scale bar — bottom left -->',
    '<g transform="translate(32, 672)">',
    '  <rect x="0" y="0" width="80" height="5" fill="none" stroke="#5A9B50" stroke-width="0.8"/>',
    '  <rect x="0" y="0" width="40" height="5" fill="#5A9B50" fill-opacity="0.7"/>',
    '  <line x1="0" y1="-3" x2="0" y2="8" stroke="#5A9B50" stroke-width="0.8"/>',
    '  <line x1="40" y1="-3" x2="40" y2="8" stroke="#5A9B50" stroke-width="0.8"/>',
    '  <line x1="80" y1="-3" x2="80" y2="8" stroke="#5A9B50" stroke-width="0.8"/>',
    '  <text x="0" y="-6" font-size="9" fill="#5A9B50" font-family="monospace">0</text>',
    '  <text x="35" y="-6" font-size="9" fill="#5A9B50" font-family="monospace">10m</text>',
    '  <text x="72" y="-6" font-size="9" fill="#5A9B50" font-family="monospace">20m</text>',
    '</g>',
    '',
    '<!-- Coordinates label — bottom right -->',
    f'<text x="{W-16}" y="{H-28}" text-anchor="end" font-size="9" fill="#5A9B50" fill-opacity="0.6" font-family="monospace">40.2526°N  44.5344°E</text>',
    f'<text x="{W-16}" y="{H-16}" text-anchor="end" font-size="8" fill="#3D7A35" fill-opacity="0.5" font-family="monospace">Hyeland · Plot Field</text>',
    '',
    '</svg>',
]

svg_content = "\n".join(lines)

out_path = "public/images/field-illustration.svg"
with open(out_path, "w") as f:
    f.write(svg_content)

print(f"Saved: {out_path}  ({W}×{H})")
print(f"Field corners (px): TL={pt(TL)} TR={pt(TR)} BR={pt(BR)} BL={pt(BL)}")
print(f"Centroid: ({cx:.0f}, {cy:.0f})")
