import re

with open('checkout.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all SVGs that contain the signature color fill of Visa (#1434CB)
svgs = re.findall(r'<svg[^>]*>.*?</svg>', html, re.DOTALL)
visas = [s for s in svgs if '#1434CB' in s]

print(f"Total Visa SVGs found: {len(visas)}")
for i, v in enumerate(visas):
    print(f"Visa {i}: length={len(v)}")
    print(v[:150], "...", v[-150:])
    print("-" * 40)
