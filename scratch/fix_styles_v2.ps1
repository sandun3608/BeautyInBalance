$content = Get-Content "styles.css"
$newContent = @()
$skip = $false

# Remove the nested block from hero section
foreach ($line in $content) {
    if ($line.Trim() -eq "/* --- BRANDS MARQUEE --- */") { $skip = $true; continue }
    if ($skip) {
        if ($line.Contains("}")) { $skip = $false }
        continue
    }
    $newContent += $line
}

# Final truncate and append
$finalContent = @()
foreach ($line in $newContent) {
    if ($line.StartsWith('$css') -or $line.Contains(" / *   - - -   B R A N D S")) { break }
    $finalContent += $line
}

$marqueeCss = @"

/* --- BRANDS MARQUEE (FIXED) --- */
.brands-section { padding: 30px 0; background: #fff; overflow: hidden; }
.brands-marquee { width: 100%; overflow: hidden; position: relative; padding: 15px 0; border-top: 1px solid var(--luxury-border); border-bottom: 1px solid var(--luxury-border); }
.brands-track {
  display: flex;
  width: max-content;
  gap: 60px;
  animation: scrollRight 60s linear infinite;
  align-items: center;
}
.brand-item img {
  height: 25px;
  width: auto;
  opacity: 0.5;
  filter: grayscale(100%);
  transition: all 0.4s ease;
}
.brand-item:hover img {
  opacity: 1;
  filter: grayscale(100% 0%);
  transform: scale(1.1);
}
.luxe-text { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--brown); font-weight: 700; }

@keyframes scrollRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
"@

$finalContent += $marqueeCss
$finalContent | Set-Content "styles.css" -Encoding UTF8
