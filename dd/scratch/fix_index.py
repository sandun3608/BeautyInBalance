import sys

path = r'c:\Users\etsy dream\Desktop\hg (1)\hg (1)\hg\index.html'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    # Adjusting for 1-based line numbers in view_file
    ln = i + 1
    if ln == 934: # setTimeout(renderAvuruduSale, 500);
        new_lines.append(line)
        new_lines.append('          setTimeout(renderAvuruduSale, 3000);\n')
    elif ln in [936, 937]: # stray tags
        continue 
    else:
        new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Successfully modified index.html")
