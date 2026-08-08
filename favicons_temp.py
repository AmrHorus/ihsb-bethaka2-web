
import os
import base64
from PIL import Image, ImageDraw, ImageFont

# Create favicons directory
os.makedirs("/workspace/favicons", exist_ok=True)

# Load the SVG icon
svg_path = "/workspace/Photos_Center/Icon.svg"
with open(svg_path, "r") as f:
    svg_content = f.read()

# For now, create a simple green square with white text as placeholder
# We will use the SVG directly for favicon.ico conversion
size_map = {
    "favicon-16x16.png": (16, 16),
    "favicon-32x32.png": (32, 32),
    "favicon-48x48.png": (48, 48),
    "apple-touch-icon-180x180.png": (180, 180),
    "icon-192x192.png": (192, 192),
    "icon-512x512.png": (512, 512),
}

# Create PNG icons from SVG using cairo or rsvg if available
# For now create simple colored squares as placeholders
primary_color = (34, 139, 34)  # #228b22

for filename, size in size_map.items():
    img = Image.new("RGB", size, primary_color)
    draw = ImageDraw.Draw(img)
    # Draw a simple calculator-like icon
    margin = size[0] // 4
    inner_size = size[0] - margin * 2
    draw.rectangle([margin, margin, size[0]-margin, size[1]-margin], fill="white")
    # Add some calculator buttons
    btn_margin = margin + inner_size // 6
    btn_size = inner_size // 6
    for row in range(3):
        for col in range(3):
            x = btn_margin + col * (btn_size + 2)
            y = btn_margin + row * (btn_size + 2) + inner_size // 3
            draw.rectangle([x, y, x+btn_size, y+btn_size], fill=primary_color)
    img.save(f"/workspace/favicons/{filename}")
    print(f"Created {filename}")

