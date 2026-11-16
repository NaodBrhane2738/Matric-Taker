import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_animation():
    width, height = 900, 320
    scale = 2
    w_s, h_s = width * scale, height * scale
    n_frames = 48
    fps = 24

    font_path = 'C:/Windows/Fonts/bahnschrift.ttf'
    font_size = 145 * scale
    font_main = ImageFont.truetype(font_path, font_size)

    text = 'For VIXY'
    bbox = font_main.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    base_tx = (w_s - tw) // 2 - bbox[0]
    base_ty = (h_s - th) // 2 - bbox[1]

    # Pre-generate sparkles/stars
    random.seed(1337)
    sparkles = []
    for _ in range(55):
        sx = random.randint(30 * scale, (width - 30) * scale)
        sy = random.randint(25 * scale, (height - 25) * scale)
        srad = random.uniform(1.2, 3.8) * scale
        phase = random.uniform(0, 2 * math.pi)
        speed = random.choice([1, 2])
        color_pool = [
            (0, 240, 255),    # Cyan
            (255, 42, 133),   # Hot pink
            (168, 85, 247),   # Purple
            (240, 246, 252),  # Soft white
            (255, 215, 0)     # Gold
        ]
        sparkles.append({
            'x': sx, 'y': sy, 'rad': srad,
            'phase': phase, 'speed': speed,
            'color': random.choice(color_pool)
        })

    def lerp_color(c1, c2, t):
        return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))

    # Color palette for gradient cycling
    palette = [
        (255, 42, 133),   # Neon pink
        (168, 85, 247),   # Electric violet
        (0, 240, 255),    # Cyber cyan
        (59, 130, 246),   # Royal blue
        (236, 72, 153),   # Magenta
        (255, 42, 133),   # Loop back
    ]

    frames = []

    for frame_idx in range(n_frames):
        progress = frame_idx / n_frames
        angle = 2 * math.pi * progress

        # 1. Canvas setup
        img = Image.new('RGB', (w_s, h_s), (13, 17, 23))  # GitHub dark #0d1117
        draw = ImageDraw.Draw(img)

        # 2. Card background with subtle inner gradient
        card_margin = 12 * scale
        card_rect = [card_margin, card_margin, w_s - card_margin, h_s - card_margin]

        # Draw card container
        draw.rounded_rectangle(
            card_rect,
            radius=24 * scale,
            fill=(16, 22, 31),
            outline=(48, 54, 61),
            width=int(1.5 * scale)
        )

        # 3. Dynamic ambient glow spots behind text
        ambient_img = Image.new('RGB', (w_s, h_s), (0, 0, 0))
        amb_draw = ImageDraw.Draw(ambient_img)

        amb_x1 = int(w_s * (0.38 + 0.08 * math.sin(angle)))
        amb_y1 = int(h_s * (0.50 + 0.06 * math.cos(angle)))
        amb_rad1 = int(180 * scale)

        amb_x2 = int(w_s * (0.62 - 0.08 * math.sin(angle)))
        amb_y2 = int(h_s * (0.50 - 0.06 * math.cos(angle)))
        amb_rad2 = int(180 * scale)

        amb_draw.ellipse([amb_x1 - amb_rad1, amb_y1 - amb_rad1, amb_x1 + amb_rad1, amb_y1 + amb_rad1], fill=(255, 42, 133))
        amb_draw.ellipse([amb_x2 - amb_rad2, amb_y2 - amb_rad2, amb_x2 + amb_rad2, amb_y2 + amb_rad2], fill=(0, 240, 255))
        ambient_blurred = ambient_img.filter(ImageFilter.GaussianBlur(radius=60 * scale))

        # Blend ambient into base
        img = Image.blend(img, ambient_blurred, 0.18)
        draw = ImageDraw.Draw(img)

        # 4. Twinkling sparkles
        for sp in sparkles:
            t_alpha = 0.35 + 0.65 * (0.5 + 0.5 * math.sin(angle * sp['speed'] + sp['phase']))
            cur_rad = sp['rad'] * (0.8 + 0.35 * math.sin(angle + sp['phase']))
            sc = tuple(int(c * t_alpha) for c in sp['color'])
            draw.ellipse([sp['x'] - cur_rad, sp['y'] - cur_rad, sp['x'] + cur_rad, sp['y'] + cur_rad], fill=sc)

            # Cross flare for larger sparkles
            if cur_rad > 2.5 * scale and t_alpha > 0.7:
                flare_len = cur_rad * 2.2
                draw.line([(sp['x'] - flare_len, sp['y']), (sp['x'] + flare_len, sp['y'])], fill=sc, width=int(scale))
                draw.line([(sp['x'], sp['y'] - flare_len), (sp['x'], sp['y'] + flare_len)], fill=sc, width=int(scale))

        # 5. Text physics: subtle vertical levitation
        cur_ty = base_ty + math.sin(angle) * 7 * scale

        # 6. Current color progression
        p_len = len(palette) - 1
        pos = progress * p_len
        idx = int(pos)
        t_pos = pos - idx
        c_from = palette[idx]
        c_to = palette[min(idx + 1, p_len)]
        glow_color = lerp_color(c_from, c_to, t_pos)

        # Secondary complementary glow color
        comp_idx = (idx + 2) % p_len
        comp_color = palette[comp_idx]

        # 7. Text Glow Layer
        glow_layer = Image.new('RGB', (w_s, h_s), (0, 0, 0))
        glow_draw = ImageDraw.Draw(glow_layer)
        glow_draw.text((base_tx, cur_ty), text, font=font_main, fill=glow_color)

        wide_glow = glow_layer.filter(ImageFilter.GaussianBlur(radius=28 * scale))
        tight_glow = glow_layer.filter(ImageFilter.GaussianBlur(radius=8 * scale))

        img = Image.blend(img, wide_glow, 0.65)
        img = Image.blend(img, tight_glow, 0.75)
        draw = ImageDraw.Draw(img)

        # 8. Drop shadow for 3D depth
        draw.text((base_tx + 4 * scale, cur_ty + 6 * scale), text, font=font_main, fill=(8, 12, 18))

        # 9. Main letter gradient + specular sweep mask
        text_mask = Image.new('L', (w_s, h_s), 0)
        tm_draw = ImageDraw.Draw(text_mask)
        tm_draw.text((base_tx, cur_ty), text, font=font_main, fill=255)

        # Generate smooth horizontal-diagonal gradient across letters
        text_surface = Image.new('RGB', (w_s, h_s), (0, 0, 0))
        ts_draw = ImageDraw.Draw(text_surface)

        # Shimmer position (sweeps smoothly left to right)
        shimmer_pos = (progress * 1.8 - 0.4) * w_s
        shimmer_width = 160 * scale

        for gx in range(int(base_tx - 20 * scale), int(base_tx + tw + 20 * scale)):
            if 0 <= gx < w_s:
                norm_x = (gx - base_tx) / tw
                norm_x = max(0.0, min(1.0, norm_x))
                # Base horizontal gradient between glow_color and comp_color
                col = lerp_color(glow_color, comp_color, norm_x)

                # Shimmer overlay
                dist = abs(gx - shimmer_pos)
                if dist < shimmer_width:
                    shimmer_intensity = (1.0 - (dist / shimmer_width) ** 2)
                    col = lerp_color(col, (255, 255, 255), shimmer_intensity * 0.92)

                ts_draw.line([(gx, 0), (gx, h_s)], fill=col)

        # Paste gradient letters onto main image using mask
        img.paste(text_surface, (0, 0), text_mask)

        # 10. Downsample with Lanczos for anti-aliasing
        final_frame = img.resize((width, height), Image.Resampling.LANCZOS)
        frames.append(final_frame)

    frames[0].save(
        'assets/for-vixy.gif',
        save_all=True,
        append_images=frames[1:],
        duration=int(1000 / fps),
        loop=0,
        optimize=True
    )
    print('Successfully generated polished assets/for-vixy.gif')

if __name__ == '__main__':
    create_animation()
