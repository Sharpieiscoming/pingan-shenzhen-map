# 生成平安银行橙色 logo（圆角橙方块 + 白色「平安银行」），替换 src/assets/pingan-logo.png
from PIL import Image, ImageDraw, ImageFont

OUT = r"C:\Users\jiaju\Documents\kimi\tasks\2026-10-22\10-16-20-11f7ba7b\pingan-outlet-system\src\assets\pingan-logo.png"
ORANGE = (255, 106, 0, 255)
W, H = 640, 200

img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

# 左侧橙色圆角方块，内嵌白色「平」字
box = 168
x0, y0, x1, y1 = 8, (H - box) // 2, 8 + box, (H + box) // 2
d.rounded_rectangle([x0, y0, x1, y1], radius=36, fill=ORANGE)
f_ping = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 104)
t = "平"
tb = d.textbbox((0, 0), t, font=f_ping)
d.text((x0 + (box - (tb[2]-tb[0])) / 2 - tb[0], y0 + (box - (tb[3]-tb[1])) / 2 - tb[1]), t, font=f_ping, fill=(255, 255, 255, 255))

# 右侧两行：平安银行 / PING AN BANK
f_cn = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 64)
f_en = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 26)
tx = x1 + 26
d.text((tx, 42), "平安银行", font=f_cn, fill=ORANGE)
d.text((tx + 2, 126), "PING AN BANK", font=f_en, fill=(120, 113, 108, 255))

img.save(OUT)
print("saved", OUT)
