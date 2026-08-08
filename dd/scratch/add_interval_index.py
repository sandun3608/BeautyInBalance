import sys

path = r'c:\Users\etsy dream\Desktop\hg (1)\hg (1)\hg\index.html'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    new_lines.append(line)
    if 'setTimeout(renderAvuruduSale, 3000);' in line:
        new_lines.append("\n        // Self-healing check\n")
        new_lines.append("        setInterval(() => {\n")
        new_lines.append("          const g = document.getElementById('avurudu-sale-grid');\n")
        new_lines.append("          if (g && g.innerHTML.trim() === '' && window.productsData && window.productsData.length > 0) {\n")
        new_lines.append("            renderAvuruduSale();\n")
        new_lines.append("          }\n")
        new_lines.append("        }, 5000);\n")

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Successfully added interval to index.html")
