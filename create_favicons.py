import os
from PIL import Image, ImageDraw

# Create favicons directory
os.makedirs("/workspace/favicons", exist_ok=True)

size_map = {
    "favicon-16x16.png": (16, 16),
    "favicon-32x32.png": (32, 32),
    "favicon-48x48.png": (48, 48),
    "apple-touch-icon-180x180.png": (180, 180),
    "icon-192x192.png": (192, 192),
    "icon-512x512.png": (512, 512),
}

primary_color = (34, 139, 34)  # #228b22
white = (255, 255, 255)

for filename, size in size_map.items():
    img = Image.new("RGBA", size, primary_color)
    draw = ImageDraw.Draw(img)
    
    # Draw calculator icon
    margin = size[0] // 5
    inner_width = size[0] - margin * 2
    inner_height = size[1] - margin * 2
    
    # Calculator body (white rounded rect)
    calc_x, calc_y = margin, margin + inner_height // 6
    calc_w, calc_h = inner_width, inner_height * 4 // 5
    
    # Draw rounded rectangle for calculator
    radius = min(calc_w, calc_h) // 6
    draw.rounded_rectangle([calc_x, calc_y, calc_x + calc_w, calc_y + calc_h], 
                          radius=radius, fill=white)
    
    # Screen
    screen_margin = calc_w // 8
    screen_h = calc_h // 4
    screen_x = calc_x + screen_margin
    screen_y = calc_y + screen_margin
    screen_w = calc_w - screen_margin * 2
    
    screen_color = (240, 248, 240)  # Light green-gray
    draw.rounded_rectangle([screen_x, screen_y, screen_x + screen_w, screen_y + screen_h],
                          radius=radius // 2, fill=screen_color)
    
    # Buttons (3x3 grid)
    btn_margin = calc_w // 10
    btn_area_y = screen_y + screen_h + btn_margin
    btn_area_h = calc_y + calc_h - btn_area_y
    btn_size = min(calc_w, calc_h) // 8
    
    for row in range(3):
        for col in range(3):
            btn_x = calc_x + screen_margin + col * (btn_size + btn_margin // 2)
            btn_y = btn_area_y + row * (btn_size + btn_margin // 2)
            if btn_x + btn_size <= calc_x + calc_w - screen_margin:
                draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_size, btn_y + btn_size],
                                      radius=btn_size // 4, fill=primary_color)
    
    img.save(f"/workspace/favicons/{filename}")
    print(f"Created {filename}")

print("Favicons created successfully!")
