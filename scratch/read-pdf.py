import os
import sys

pdf_path = r"key/Koko - API Documentation Developer Preview v1.05.pdf"

try:
    import pypdf
    reader = pypdf.PdfReader(pdf_path)
    print("pypdf available. Extracting text to scratch/pdf-text.txt...")
    with open("scratch/pdf-text.txt", "w", encoding="utf-8") as out_f:
        for idx, page in enumerate(reader.pages):
            text = page.extract_text()
            out_f.write(f"--- Page {idx+1} ---\n{text}\n")
    print("Text extracted successfully!")
except ImportError:
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(pdf_path)
        print("PyPDF2 available. Extracting text to scratch/pdf-text.txt...")
        with open("scratch/pdf-text.txt", "w", encoding="utf-8") as out_f:
            for idx, page in enumerate(reader.pages):
                text = page.extract_text()
                out_f.write(f"--- Page {idx+1} ---\n{text}\n")
        print("Text extracted successfully!")
    except ImportError:
        print("Neither pypdf nor PyPDF2 is installed.")
        with open(pdf_path, 'rb') as f:
            content = f.read()
            import re
            print("Raw printable strings containing signature:")
            matches = re.findall(b"[a-zA-Z0-9_]{3,30}", content)
            unique_words = sorted(list(set(matches)))
            sig_words = [w.decode('ascii', errors='ignore') for w in unique_words if b"sign" in w.lower() or b"data" in w.lower() or b"url" in w.lower()]
            print(sig_words[:100])
