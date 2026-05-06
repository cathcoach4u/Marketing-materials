import textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Coach4U brand constants
BG_WHITE = (255, 255, 255)
DARK_BLUE = (27, 54, 100)    # #1B3664
LIGHT_BLUE = (86, 132, 196)  # #5684C4
DARK_GREY = (45, 45, 45)     # #2D2D2D
LIGHT_GREY = (221, 221, 221) # #DDDDDD

SLIDE_W = 1920
SLIDE_H = 1080

FOOTER_TEXT = (
    "Strengths-Based Coaching and Counselling  |  www.coach4u.com.au  "
    "|  cath@coach4u.com.au  |  0402 313 337"
)

_HERE = Path(__file__).parent
LOGO_PATH = _HERE / "assets" / "Coach4ULogo.png"
FONTS_DIR = _HERE / "fonts"


def _font(filename: str, size: int) -> ImageFont.FreeTypeFont:
    path = FONTS_DIR / filename
    if path.exists():
        return ImageFont.truetype(str(path), size)
    # Fallback: PIL default (no brand fonts installed yet)
    return ImageFont.load_default(size=size)


def _paste_logo(img: Image.Image) -> None:
    if not LOGO_PATH.exists():
        return
    logo = Image.open(LOGO_PATH).convert("RGBA")
    target_w = 280
    ratio = target_w / logo.width
    target_h = int(logo.height * ratio)
    logo = logo.resize((target_w, target_h), Image.LANCZOS)
    img.paste(logo, (60, 36), logo)


def _draw_footer(draw: ImageDraw.ImageDraw, font: ImageFont.FreeTypeFont) -> None:
    draw.line(
        [(60, SLIDE_H - 84), (SLIDE_W - 60, SLIDE_H - 84)],
        fill=LIGHT_GREY,
        width=2,
    )
    bbox = draw.textbbox((0, 0), FOOTER_TEXT, font=font)
    text_w = bbox[2] - bbox[0]
    x = (SLIDE_W - text_w) // 2
    draw.text((x, SLIDE_H - 62), FOOTER_TEXT, font=font, fill=DARK_GREY)


def _title_slide(title: str, out_path: Path) -> None:
    img = Image.new("RGB", (SLIDE_W, SLIDE_H), BG_WHITE)
    draw = ImageDraw.Draw(img)

    font_title = _font("Inter-Bold.ttf", 96)
    font_footer = _font("Montserrat-Regular.ttf", 28)

    _paste_logo(img)

    # Left accent bar
    draw.rectangle([(60, 180), (72, SLIDE_H - 100)], fill=LIGHT_BLUE)

    # Title centred vertically
    lines = textwrap.wrap(title, width=28)
    line_h = 116
    total_h = len(lines) * line_h
    y = (SLIDE_H - total_h) // 2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font_title)
        x = (SLIDE_W - (bbox[2] - bbox[0])) // 2
        draw.text((x, y), line, font=font_title, fill=DARK_BLUE)
        y += line_h

    _draw_footer(draw, font_footer)
    img.save(out_path, "PNG")


def _section_slide(section: dict, out_path: Path) -> None:
    img = Image.new("RGB", (SLIDE_W, SLIDE_H), BG_WHITE)
    draw = ImageDraw.Draw(img)

    font_heading = _font("Inter-Bold.ttf", 64)
    font_bullet = _font("Montserrat-Regular.ttf", 38)
    font_footer = _font("Montserrat-Regular.ttf", 28)

    _paste_logo(img)

    # Left accent bar
    draw.rectangle([(60, 160), (72, SLIDE_H - 100)], fill=LIGHT_BLUE)

    x = 104
    y = 164

    # Section heading
    draw.text((x, y), section["heading"], font=font_heading, fill=DARK_BLUE)
    y += 80

    # Underline beneath heading
    h_bbox = draw.textbbox((x, 164), section["heading"], font=font_heading)
    draw.line(
        [(x, y - 6), (min(h_bbox[2] + 20, SLIDE_W - 100), y - 6)],
        fill=LIGHT_GREY,
        width=2,
    )
    y += 24

    bullets = section.get("bullets", [])

    # Two-column layout for 4+ bullets
    if len(bullets) >= 4:
        mid = (len(bullets) + 1) // 2
        columns = [(x, bullets[:mid]), (SLIDE_W // 2 + 20, bullets[mid:])]
    else:
        columns = [(x, bullets)]

    for col_x, col_bullets in columns:
        col_y = y
        for bullet in col_bullets:
            lines = textwrap.wrap(bullet, width=40)
            for j, line in enumerate(lines):
                prefix = "•  " if j == 0 else "   "
                draw.text((col_x, col_y), prefix + line, font=font_bullet, fill=DARK_GREY)
                col_y += 56
            col_y += 10

    _draw_footer(draw, font_footer)
    img.save(out_path, "PNG")


def generate_slides(script: dict, slides_dir: Path) -> list[Path]:
    paths: list[Path] = []

    title_path = slides_dir / "slide_00_title.png"
    _title_slide(script["title"], title_path)
    paths.append(title_path)

    for i, section in enumerate(script["sections"]):
        out_path = slides_dir / f"slide_{i + 1:02d}.png"
        _section_slide(section, out_path)
        paths.append(out_path)

    print(f"  Generated {len(paths)} slides")
    return paths
