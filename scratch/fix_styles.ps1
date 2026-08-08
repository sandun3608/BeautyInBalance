$content = Get-Content "styles.css"
$newContent = @()
$skip = $false

# Pass 1: Remove nested block in hero section
for ($i = 0; $i -lt $content.Count; $i++) {
    $line = $content[$i]
    if ($line -like "*/* --- BRANDS MARQUEE --- */*") {
        $skip = $true
        continue
    }
    if ($skip) {
        if ($line -like "*@keyframes scrollRight {*") {
             # Skipping the keyframes too
        } elseif ($line -like "*100% { transform: translateX(0); }*") {
             # End of keyframes
        } elseif ($line -like "*}*") {
             $skip = $false
             continue
        }
        continue
    }
    $newContent += $line
}

# Pass 2: Truncate at messed up end (before the echo $css mess)
$finalContent = @()
for ($i = 0; $i -lt $newContent.Count; $i++) {
    $line = $newContent[$i]
    if ($line -match "^\$css" -or $line -match "^ / \*   - - -   B R A N D S") {
        break
    }
    $finalContent += $line
}

# Add fresh Clean Marquee CSS at the end
$marqueeCss = @"

/* --- BRANDS MARQUEE (CLEAN) --- */
.brands-section { padding: 40px 0; background: #fff; overflow: hidden; }
.brands-marquee { width: 100%; overflow: hidden; position: relative; padding: 20px 0; border-top: 1px solid var(--luxury-border); border-bottom: 1px solid var(--luxury-border); background: #fff; }
.brands-track {
  display: flex;
  width: max-content;
  gap: 60px;
  animation: scrollRight 40s linear infinite;
  align-items: center;
}
.brand-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-decoration: none;
}
.brand-item img {
  height: 25px; /* Elegant smaller size */
  width: auto;
  opacity: 0.5;
  filter: grayscale(100%);
  transition: all 0.4s ease;
  display: block;
}
.brand-item:hover img {
  opacity: 1;
  filter: grayscale(0%);
  transform: scale(1.08);
}
.luxe-text {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 1px;
  color: var(--brown);
}

@keyframes scrollRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
"@

$finalContent += $marqueeCss
$finalContent | Set-Content "styles.css"
