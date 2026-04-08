#!/usr/bin/env python3
"""
Fetch satellite tiles from ESRI World Imagery and stitch into a single image
cropped to the field bounds.
"""
import math
import urllib.request
import io
import os
from PIL import Image

# Field bounds from plot-field.json
MIN_LAT = 40.25243123
MAX_LAT = 40.25267617
MIN_LNG = 44.53419455
MAX_LNG = 44.53461399

ZOOM = 20
TILE_SIZE = 256
PAD_X = 160  # wide horizontal padding → landscape ratio
PAD_Y = 60   # less vertical padding → shorter height

def tile_coords(lat, lng, zoom):
    n = 2 ** zoom
    x = int((lng + 180) / 360 * n)
    lat_r = math.radians(lat)
    y = int((1 - math.log(math.tan(lat_r) + 1 / math.cos(lat_r)) / math.pi) / 2 * n)
    return x, y

def tile_to_lnglat(tx, ty, zoom):
    n = 2 ** zoom
    lng = tx / n * 360 - 180
    lat_r = math.atan(math.sinh(math.pi * (1 - 2 * ty / n)))
    lat = math.degrees(lat_r)
    return lng, lat

# Tile range covering the bounds
x_min, y_max = tile_coords(MIN_LAT, MIN_LNG, ZOOM)  # SW corner → max tile y
x_max, y_min = tile_coords(MAX_LAT, MAX_LNG, ZOOM)  # NE corner → min tile y

print(f"Tile range: x={x_min}–{x_max}, y={y_min}–{y_max} at zoom {ZOOM}")

cols = x_max - x_min + 1
rows = y_max - y_min + 1
print(f"Fetching {cols}×{rows} = {cols*rows} tiles...")

canvas = Image.new("RGB", (cols * TILE_SIZE, rows * TILE_SIZE))

for ty in range(y_min, y_max + 1):
    for tx in range(x_min, x_max + 1):
        url = f"https://mt1.google.com/vt/lyrs=s&x={tx}&y={ty}&z={ZOOM}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                tile = Image.open(io.BytesIO(resp.read())).convert("RGB")
            px = (tx - x_min) * TILE_SIZE
            py = (ty - y_min) * TILE_SIZE
            canvas.paste(tile, (px, py))
            print(f"  tile ({tx},{ty}) ok")
        except Exception as e:
            print(f"  tile ({tx},{ty}) FAILED: {e}")

# Canvas bounds in lng/lat
canvas_lng_min, canvas_lat_max = tile_to_lnglat(x_min, y_min, ZOOM)
canvas_lng_max, canvas_lat_min = tile_to_lnglat(x_max + 1, y_max + 1, ZOOM)

canvas_w, canvas_h = canvas.size

def lnglat_to_px(lng, lat):
    px = (lng - canvas_lng_min) / (canvas_lng_max - canvas_lng_min) * canvas_w
    py = (canvas_lat_max - lat) / (canvas_lat_max - canvas_lat_min) * canvas_h
    return int(px), int(py)

crop_x0, crop_y0 = lnglat_to_px(MIN_LNG, MAX_LAT)
crop_x1, crop_y1 = lnglat_to_px(MAX_LNG, MIN_LAT)

# Add asymmetric padding: wider sides, shorter top/bottom
crop_x0 = max(0, crop_x0 - PAD_X)
crop_y0 = max(0, crop_y0 - PAD_Y)
crop_x1 = min(canvas_w, crop_x1 + PAD_X)
crop_y1 = min(canvas_h, crop_y1 + PAD_Y)

cropped = canvas.crop((crop_x0, crop_y0, crop_x1, crop_y1))

out_path = os.path.join(os.path.dirname(__file__), "../public/images/field-satellite.jpg")
os.makedirs(os.path.dirname(out_path), exist_ok=True)
# Upscale 2x with Lanczos for sharper display on modern screens
upscaled = cropped.resize((cropped.width * 2, cropped.height * 2), Image.LANCZOS)
upscaled.save(out_path, "JPEG", quality=95)
print(f"\nSaved: {out_path}  ({upscaled.width}×{upscaled.height}px)")

# Print updated imageBounds accounting for padding
pad_lng_min, pad_lat_max = (
    canvas_lng_min + (crop_x0 / canvas_w) * (canvas_lng_max - canvas_lng_min),
    canvas_lat_max - (crop_y0 / canvas_h) * (canvas_lat_max - canvas_lat_min),
)
pad_lng_max, pad_lat_min = (
    canvas_lng_min + (crop_x1 / canvas_w) * (canvas_lng_max - canvas_lng_min),
    canvas_lat_max - (crop_y1 / canvas_h) * (canvas_lat_max - canvas_lat_min),
)
print(f"\nimageBounds to put in plot-field.json:")
print(f'  "minLat": {pad_lat_min:.8f},')
print(f'  "maxLat": {pad_lat_max:.8f},')
print(f'  "minLng": {pad_lng_min:.8f},')
print(f'  "maxLng": {pad_lng_max:.8f}')
print(f'  "imageWidth": {upscaled.width},')
print(f'  "imageHeight": {upscaled.height}')
