// Finalized Product Database with Organized Cerave Assets
const defaultProducts = [
  { 
    id: 'cer-am-spf30',
    name: 'AM Facial Moisturizing Lotion SPF 30 (89ml)', price: 6500, cat: 'cerave', filter: 'sunscreen', 
    images: ['cerave prodcut/Hydrating Cleanser (236ml)  Rs.6800.png'], img: 'cerave prodcut/Hydrating Cleanser (236ml)  Rs.6800.png',
    desc: 'A morning skincare multitasker, featuring three essential ceramides, hydrating hyaluronic acid and soothing niacinamide, plus our patented MVE Delivery Technology to supply much-needed moisture throughout the day. Offering Broad Spectrum sunscreen, our moisturizer with SPF 30 features InVisibleZinc Technology.',
    benefits: ['Broad Spectrum SPF 30', 'Provides All-Day Hydration', 'Restores Skin Barrier'],
    howToUse: 'Apply liberally 15 minutes before sun exposure. Reapply at least every 2 hours.',
    authenticity: '100% Genuine Direct Import.'
  },
  // CeraVe Cleaners - Organized Set (Updated)
  { 
    id: 'cer-acne-control',
    name: 'Acne Control Cleanser (237ml)', price: 6800, cat: 'cerave', filter: 'cleansers', 
    images: ['cerave prodcut/Acne Control Cleanser (237ml)  Rs.6800.png'], img: 'cerave prodcut/Acne Control Cleanser (237ml)  Rs.6800.png',
    desc: 'An expertly formulated daily gel-to-foam acne treatment that visibly clears acne breakouts while gently exfoliating with 2% Salicylic Acid. Enriched with Hectorite Clay to absorb excess oil, and essential ceramides to maintain the skin’s natural barrier, it effectively prevents new breakouts without stripping the skin of moisture.',
    benefits: ['Clears Acne', 'Absorbs Excess Oil', 'Restores Skin Barrier'],
    howToUse: 'Wet face, gently massage product into a lather. Rinse completely. Use every morning and evening.',
    authenticity: '100% Genuine Direct Import.'
  },
  { 
    id: 'cer-blemish-control',
    name: 'Blemish Control Cleanser (236ml)', price: 7400, cat: 'cerave', filter: 'cleansers', 
    images: ['cerave prodcut/Blemish Control Cleanser (236ml)  Rs.7400.png'], img: 'cerave prodcut/Blemish Control Cleanser (236ml)  Rs.7400.png',
    desc: 'A refreshing daily gel cleanser specifically developed for blemish-prone skin. Infused with Purifying Clay, 2% Salicylic Acid, and Niacinamide, it clears clogged pores, regulates sebum production, and visibly reduces the appearance of blackheads and blemishes. The formula guarantees a soft, smoothed texture without disrupting the protective skin barrier.',
    benefits: ['Targets Blemishes', 'Soothes Redness', 'Unclogs Pores'],
    howToUse: 'Massage gently onto wet skin in circular motions. Rinse thoroughly. Ideal for daily use.',
    authenticity: '100% Genuine Direct Import.'
  },
  { 
    id: 'cer-forming',
    name: 'Foaming Cleanser (236ml)', price: 6600, cat: 'cerave', filter: 'cleansers', 
    images: ['cerave prodcut/Forming Cleanser (236ml)  Rs.6600.png'], img: 'cerave prodcut/Forming Cleanser (236ml)  Rs.6600.png',
    desc: 'Developed alongside dermatologists, this deeply purifying gel-based Foaming Cleanser effortlessly washes away dirt, excess oil, and stubborn makeup. Featuring three essential ceramides, hyaluronic acid, and calming niacinamide, it deeply cleanses the surface without compromising or upsetting the skin\'s natural moisture balance. Ideal for normal to oily skin types.',
    benefits: ['Deep Cleansing Foaming Action', 'Balances Oily Skin', 'Non-drying Formula'],
    howToUse: 'Apply to wet skin, massage gently into a rich foam. Rinse off completely with lukewarm water.',
    authenticity: '100% Genuine Direct Import.'
  },
  { 
    id: 'cer-hydrating',
    name: 'Hydrating Cleanser (236ml)', price: 6800, cat: 'cerave', filter: 'cleansers', 
    images: ['cerave prodcut/Hydrating Cleanser (236ml)  Rs.6800.png'], img: 'cerave prodcut/Hydrating Cleanser (236ml)  Rs.6800.png',
    desc: 'A uniquely comforting, non-foaming lotion cleanser designed specifically to hydrate and restore normal to dry skin types. It utilizes patented MVE Delivery Technology combined with hyaluronic acid to effectively cleanse the skin of impurities while locking in moisture all day. Leaves the skin feeling incredibly soft, soothed, and perfectly nourished.',
    benefits: ['All-Day Hydration', 'Gentle Lotion Texture', 'Soothes Dryness'],
    howToUse: 'Wet face, apply a generous amount and massage gently. Rinse off cleanly with water.',
    authenticity: '100% Genuine Direct Import.'
  },
  { 
    id: 'cer-hydrating-oil',
    name: 'Hydrating Foaming Oil Cleanser (237ml)', price: 8000, cat: 'cerave', filter: 'body', 
    images: ['cerave prodcut/Hydrating Forming Oil Cleanser (237ml)  Rs.8000.png'], img: 'cerave prodcut/Hydrating Forming Oil Cleanser (237ml)  Rs.8000.png',
    desc: 'A luxurious, beautifully transforming oil-to-foam cleanser perfectly tailored for extremely dry, sensitive, or atopic-prone skin. Infused with squalane oil and rich triglycerides, it softly melts away dirt and impurities without leaving a greasy residue. The skin is instantly replenished with deep hydration, resulting in a supremely soft and comfortable skin barrier.',
    benefits: ['Oil-to-Foam Texture', 'Deeply Nourishing Squalane', 'Ultra-Mild Cleansing'],
    howToUse: 'Apply onto wet skin and gently massage until the oil transforms into a lather. Rinse fully.',
    authenticity: '100% Genuine Direct Import.'
  },
  { 
    id: 'cer-psoriasis',
    name: 'Psoriasis Cleanser (237ml)', price: 6800, cat: 'cerave', filter: 'body', 
    images: ['cerave prodcut/Psoriasis Cleanser(237ml) rs 6800.png'], img: 'cerave prodcut/Psoriasis Cleanser(237ml) rs 6800.png',
    desc: 'A highly specialized, therapeutic body and face wash formulated to relieve discomfort associated with psoriasis. Medicated with 2% Salicylic Acid to gently remove scaling, and infused with Lactic Acid and Niacinamide, it actively calms stubborn redness, intense itching, and visible flaking. Promotes calmer, visibly smoother, and comfortably restored skin.',
    benefits: ['Relieves Itching & Redness', 'Removes Scales', 'Therapeutic Formula'],
    howToUse: 'Use on affected areas generously. Massage carefully and leave for a few moments before rinsing off.',
    authenticity: '100% Genuine Direct Import.'
  },
  { 
    id: 'cer-renewing-sa',
    name: 'Renewing SA Cleanser (237ml)', price: 7200, cat: 'cerave', filter: 'cleansers', 
    images: ['cerave prodcut/Renewing SA Cleanser (237ml) Rs.7200.png'], img: 'cerave prodcut/Renewing SA Cleanser (237ml) Rs.7200.png',
    desc: 'A gentle yet powerfully effective salicylic acid cleanser that delivers non-irritating exfoliation to slough off dead skin cells. Infused with antioxidant Vitamin D and a ceramide-rich complex, it targets rough, bumpy textures while avoiding mechanical scrubbing, leaving the skin feeling deeply revitalized, incredibly smooth, and beautifully renewed.',
    benefits: ['Exfoliates gently', 'Rich in Vitamin D', 'Smoothes Bumpy Skin'],
    howToUse: 'Wet skin with lukewarm water. Massage the cleanser in a gentle motion. Rinse thoroughly.',
    authenticity: '100% Genuine Direct Import.'
  },
  { 
    id: 'cer-sa-smoothing',
    name: 'SA Smoothing Cleanser (236ml)', price: 6750, cat: 'cerave', filter: 'cleansers', 
    images: ['cerave prodcut/SA Smoothing Cleanser (236ml) Rs.6750.png'], img: 'cerave prodcut/SA Smoothing Cleanser (236ml) Rs.6750.png',
    desc: 'Designed for dry, rough, and noticeably bumpy skin surfaces, this specialized smoothing cleanser provides targeted chemical exfoliation. Utilizing Salicylic Acid combined with hydrating Hyaluronic Acid, it effectively buffs away dead layers while reinforcing the skin barrier. Experience a transformative difference in skin softness without any abrasive microbeads.',
    benefits: ['Targets Rough Exfoliation', 'Fragrance-Free', 'Enhances Skin Softness'],
    howToUse: 'Massage an adequate amount onto wet skin. Wash off completely for best results.',
    authenticity: '100% Genuine Direct Import.'
  },

  // The Ordinary Collection
  { 
    id: 'ord-caffeine-30',
    name: 'Caffeine Solution 5% + EGCG (30ml)', price: 4600, cat: 'ordinary', filter: 'eye', 
    images: ['the ordinary/Caffeine solution (30ml)  Rs.4600.png'], img: 'the ordinary/Caffeine solution (30ml)  Rs.4600.png',
    desc: 'A brilliantly light-textured eye serum optimized with an extraordinarily high 5% concentration of caffeine and highly-purified EGCG extracted from green tea leaves. Independent studies show that topical application of these active ingredients dramatically reduces puffiness, under-eye bags, and dark pigmentation contours around the delicate eye area.',
    benefits: ['Reduces eye bags', 'Minimizes dark circles', 'Antioxidant-rich EGCG'],
    howToUse: 'Massage a small amount onto the eye contour AM and PM.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-aha-bha-30',
    name: 'AHA 30% + BHA 2% Peeling Solution (30ml)', price: 5200, cat: 'ordinary', filter: 'acids', 
    images: ['the ordinary/Aha bha peeling solution (30ml) Rs.5200.png'], img: 'the ordinary/Aha bha peeling solution (30ml) Rs.5200.png',
    desc: 'A highly sought-after 10-minute exfoliating facial treatment featuring a potent 32% blend of alpha and beta-hydroxy acids. It is expertly formulated to deeply exfoliate the skin\'s topmost surface for a brighter, more even appearance. This dramatic peeling solution clears congested pores, combats active blemishes, and helps smooth out fine lines and skin texture irregularities with continuous, careful use.',
    benefits: ['Exfoliates top layers', 'Clears pores', 'Improves textrue & radiance'],
    howToUse: 'Use ideally in the PM, no more frequently than twice per week. Leave on for no more than 10 minutes. Rinse thoroughly.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-rosehip-30',
    name: '100% Organic Cold-Pressed Rose Hip Seed Oil (30ml)', price: 5600, cat: 'ordinary', filter: 'face-oils', 
    images: ['the ordinary/100%25 Organic Cold-Pressed Rose Hip Seed Oil (30ml)  Rs.5600.png'], img: 'the ordinary/100%25 Organic Cold-Pressed Rose Hip Seed Oil (30ml)  Rs.5600.png',
    desc: 'An exquisite, 100% organic, cold-pressed oil that deeply hydrates the skin while supporting a healthy, radiant complexion. Rich in linoleic acid, linolenic acid, and pro-vitamin A, this luxurious daily oil actively targets visible signs of photo-aging, balances uneven skin tone, reduces dullness, and boosts overall skin resilience for a glowing, youthful finish.',
    benefits: ['Deeply Hydrates', 'Improves Skin Tone', 'Anti-aging properties'],
    howToUse: 'Apply once a day to the face, ideally in the PM after application of water-based treatments.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-granactive-retinoid-30',
    name: 'Granactive Retinoid 2% Emulsion (30ml)', price: 5500, cat: 'ordinary', filter: 'retinoids', 
    images: ['the ordinary/Granactive retinoid 2 emulsion (30ml)  Rs.5500.png'], img: 'the ordinary/Granactive retinoid 2 emulsion (30ml)  Rs.5500.png',
    desc: 'This highly advanced, creamy emulsion combines two forms of next-generation retinoid actives in a 2% concentration weight. It effectively delivers better results against multiple signs of aging—such as fine lines, dullness, and textural irregularities—than traditional retinol, all while avoiding the typical irritation and peeling associated with retinoid use.',
    benefits: ['Targets visible aging', 'Refines skin texture', 'Low irritation risk'],
    howToUse: 'Apply a small amount to face in the PM as part of your skincare regimen, after water based serums but before heavier treatments.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-alpha-arbutin-30',
    name: 'Alpha Arbutin 2% + HA (30ml)', price: 4800, cat: 'ordinary', filter: 'glow', 
    images: ['the ordinary/Alpha arbutin (30ml)  Rs.4800.png'], img: 'the ordinary/Alpha arbutin (30ml)  Rs.4800.png',
    desc: 'A concentrated daily serum featuring a high 2% concentration of purified Alpha Arbutin, fortified with Hyaluronic Acid for enhanced delivery. This advanced formula actively reduces the look of stubborn dark spots, hyperpigmentation, and acne scars by suppressing melanin production, ensuring a unified, visibly luminous, and hydrated complexion.',
    benefits: ['Reduces dark spots', 'Evens skin tone', 'Hydrating with HA'],
    howToUse: 'Apply a few drops to face in the AM and PM as part of your skincare regimen.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-ascorbic-arbutin-30',
    name: 'Ascorbic Acid 8% + Alpha Arbutin 2% (30ml)', price: 5200, cat: 'ordinary', filter: 'glow', 
    images: ['the ordinary/Ascorbic Acid 8% + Alpha Arbutin 2% (30ml)  Rs.5200.png'], img: 'the ordinary/Ascorbic Acid 8% + Alpha Arbutin 2% (30ml)  Rs.5200.png',
    desc: 'A water-free, stable formulation combining two of the most powerful brightening agents in skincare: pure Vitamin C (Ascorbic Acid) and Alpha Arbutin. This dual-action powerhouse visibly brightens the skin tone, fades dark spots and post-blemish marks, and provides intense antioxidant protection against environmental stressors, resulting in a flawless glow.',
    benefits: ['Brightens Complexion', 'Fades Dark Spots', 'Antioxidant Support'],
    howToUse: 'Apply a few drops to face in the AM and PM as part of your skincare regimen. Avoid use around eyes.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-azelaic-10-30',
    name: 'Azelaic Acid Suspension 10% (30ml)', price: 7200, cat: 'ordinary', filter: 'acids', 
    images: ['the ordinary/Azelaic Acid Suspension 10%25 (30ml)  Rs.7200.png'], img: 'the ordinary/Azelaic Acid Suspension 10%25 (30ml)  Rs.7200.png',
    desc: 'Powered by highly purified Azelaic Acid, this multi-functional, lightweight cream-gel suspension brightens skin tone while radically improving the uniformity of skin texture. Known for its remarkable ability to reduce redness and target blemishes, it acts as an effective antioxidant that guards against skin deterioration, making it perfect for sensitive or rosacea-prone skin.',
    benefits: ['Brightens skin tone', 'Improves texture', 'Reduces redness'],
    howToUse: 'Apply to face AM and/or PM to improve visible brightness and the appearance of skin texture.',
    authenticity: 'DECIEM Canada Original.'
  },

  { 
    id: 'ord-glycolic-240',
    name: 'Glycolic Acid 7% Toning Solution (240ml)', price: 4800, cat: 'ordinary', filter: 'acids', 
    images: ['the ordinary/Glycolic Acid Toning Solution (240ml)  Rs.4800.png'], img: 'the ordinary/Glycolic Acid Toning Solution (240ml)  Rs.4800.png',
    desc: 'A daily exfoliating toner that offers mild, skin-resurfacing exfoliation with 7% Glycolic Acid to vastly improve skin radiance and visible clarity. The formula is soothingly enhanced with Tasmanian Pepperberry derivative to help reduce irritation associated with acid use, alongside Aloe Vera and Ginseng root to soothe and re-energize the skin structure.',
    benefits: ['Mild exfoliation', 'Improves skin radiance', 'Visible clarity'],
    howToUse: 'Use ideally in the PM, no more frequently than once per day. Saturate a cotton pad and sweep across face and neck.',
    authenticity: 'DECIEM Canada Original.'
  },

  { 
    id: 'ord-ha-30',
    name: 'Hyaluronic Acid 2% + B5 (30ml)', price: 4800, cat: 'ordinary', filter: 'serums', 
    images: ['the ordinary/Hyaluronic Acid (30ml) Rs.4800.png'], img: 'the ordinary/Hyaluronic Acid (30ml) Rs.4800.png',
    desc: 'An ultra-pure hydrating serum that intricately combines low, medium, and high-molecular-weight Hyaluronic Acid, alongside a next-generation HA crosspolymer at a collective 2% concentration. This exceptional system delivers intense, multi-depth hydration that plumps the skin instantly while Vitamin B5 enhances surface hydration and skin barrier restoration.',
    benefits: ['Deep multi-depth Hydration', 'Plumps skin', 'Enriched with Vitamin B5'],
    howToUse: 'Apply a few drops to face AM and PM before creams.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-lactic-30',
    name: 'Lactic Acid 10% + HA (30ml)', price: 4700, cat: 'ordinary', filter: 'acids', 
    images: ['the ordinary/Lactic acid (30ml)  Rs.4700.png'], img: 'the ordinary/Lactic acid (30ml)  Rs.4700.png',
    desc: 'A highly effective but gentle surface peeling formulation that utilizes a 10% high-strength Lactic Acid to dissolve dead skin cells. The addition of purified Tasmanian Pepperberry brilliantly mitigates the signs of inflammation and sensitivity that often occur with exfoliation, resulting in noticeably brighter, smoother, and healthier-looking skin.',
    benefits: ['Gentle Exfoliation', 'Promotes brighter skin', 'Reduces inflammation'],
    howToUse: 'Apply once per day, ideally in the PM. Can be diluted with other treatments until skin tolerance develops.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-multi-peptide-copper-30',
    name: 'Multi-Peptide + Copper Peptides 1% (30ml)', price: 7800, cat: 'ordinary', filter: 'serums', 
    images: ['the ordinary/Multi-Peptide + Copper Peptides 1% Serum (30ml)  Rs.7800.png'], img: 'the ordinary/Multi-Peptide + Copper Peptides 1% Serum (30ml)  Rs.7800.png',
    desc: 'A universal "buffet" serum built to simultaneously address maximum signs of aging. It incorporates a sophisticated array of peptide complexes alongside direct Copper Peptides (1%), all dissolved in a base of 11 skin-friendly amino acids and multiple hyaluronic acid complexes. It intensely boosts collagen, repairs skin damage, and significantly improves facial firmness.',
    benefits: ['Reduces fine lines', 'Promotes facial firmness', 'Supports overall skin health'],
    howToUse: 'Apply to the entire face in the AM and PM after cleaning.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-lash-brow-5',
    name: 'Multi-Peptide Lash And Brow Serum (5ml)', price: 4800, cat: 'ordinary', filter: 'targeted', 
    images: ['the ordinary/Multi-Peptide Lash And Brow Serum 5ml  rs 4800.png'], img: 'the ordinary/Multi-Peptide Lash And Brow Serum 5ml  rs 4800.png',
    desc: 'A specialized, non-greasy conditioning serum highly engineered to nourish and strengthen your natural lashes and brows. Formulated with four potent peptide complexes, botanical extracts, and active ingredients, it fortifies hair density, thickness, and overall health to give you noticeably fuller, voluminous, and lush lashes and brows in just a few weeks.',
    benefits: ['Enhances lash density', 'Thickens brows', 'Nourishing peptides'],
    howToUse: 'After cleansing, apply a thin layer along the lash line and eyebrows in the morning and evening.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-hair-density-30',
    name: 'Multi-Peptide Serum for Hair Density (30ml)', price: 3600, cat: 'ordinary', filter: 'targeted', 
    images: ['the ordinary/Multi-peptide serum for hair density (30ml)  Rs.3600.png'], img: 'the ordinary/Multi-peptide serum for hair density (30ml)  Rs.3600.png',
    desc: 'A revolutionary, ultra-lightweight hair care serum densely packed with revitalizing technologies including REDENSYL complex, Procapil peptide complex, and BAICAPIL in an ultra-penetrating emollient base. It explicitly supports blood circulation in the scalp, drastically reduces hair loss, and fosters incredibly thicker, denser, and healthier-looking hair.',
    benefits: ['Supports hair density', 'Promotes thicker hair', 'Nourishes scalp'],
    howToUse: 'Massage a few drops thoroughly into clean, dry scalp once daily, ideally at bedtime.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-hair-density-60',
    name: 'Multi-Peptide Serum for Hair Density (60ml)', price: 5800, cat: 'ordinary', filter: 'targeted', 
    images: ['the ordinary/Multi-peptide serum for hair density (60ml)  Rs.5800.png'], img: 'the ordinary/Multi-peptide serum for hair density (60ml)  Rs.5800.png',
    desc: 'The fantastic, high-capacity 60ml version of the beloved hair density serum. This lightweight formula utilizes highly advanced peptide complexes, caffeine, and exclusive botanical extracts in an alcohol-free base to deeply stimulate the hair follicles. By promoting a flourishing scalp environment, it efficiently builds visible, lasting hair thickness and fullness.',
    benefits: ['Supports hair density', 'Promotes thicker hair', 'Value size (60ml)'],
    howToUse: 'Massage a few drops thoroughly into clean, dry scalp once daily, ideally at bedtime.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-nmf-ha-30',
    name: 'Natural Moisturizing Factors + HA (30ml)', price: 8000, cat: 'ordinary', filter: 'dry', 
    images: ['the ordinary/Natural moisturizing factors %2B ha (30ml) Rs.8000.png'], img: 'the ordinary/Natural moisturizing factors %2B ha (30ml) Rs.8000.png',
    desc: 'An essential, non-greasy surface hydrator packed with elements naturally present in the skin—amino acids, dermal lipids, and hyaluronic acid. Designed as a universal protective outer shield, it supplements the skin\'s impaired Natural Moisturizing Factors (NMF) to provide immediate, prolonged soothing hydration and dramatically improve barrier strength without a heavy feel.',
    benefits: ['Immediate Hydration', 'Barrier Support', 'Non-greasy formula'],
    howToUse: 'Apply after serums as needed for effective surface hydration.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-niacinamide-30',
    name: 'Niacinamide 10% + Zinc 1% (30ml)', price: 3800, cat: 'ordinary', filter: 'serums', 
    images: ['the ordinary/Niacinamide (30ml) Rs.3800.png'], img: 'the ordinary/Niacinamide (30ml) Rs.3800.png',
    desc: 'A staple in any skincare routine, this high-strength vitamin (B3) and mineral (Zinc PCA) blemish-fighting fluid dynamically regulates surface sebum production to eliminate excess oiliness. By rapidly minimizing the appearance of enlarged pores, persistent blemishes, and uneven skin texture, it significantly promotes a refined, beautifully clear, and balanced complexion.',
    benefits: ['Regulates Sebum', 'Minimizes pores', 'Reduces blemishes'],
    howToUse: 'Apply to entire face morning and evening before heavier creams.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-niacinamide-60',
    name: 'Niacinamide 10% + Zinc 1% (60ml)', price: 5500, cat: 'ordinary', filter: 'serums', 
    images: ['the ordinary/Niacinamide (60ml) Rs.5500.png'], img: 'the ordinary/Niacinamide (60ml) Rs.5500.png',
    desc: 'The highly requested 60ml ultra-value variant of the globally top-selling Niacinamide formula. By maintaining steady delivery of continuous Vitamin B3 and Zinc PCA into the skin day and night, this serum remains the ultimate defense mechanism against acne congestion, enlarged pores, and oil imbalance while building long-lasting visible skin clarity.',
    benefits: ['Regulates Sebum', 'Minimizes pores', 'Value Size (60ml)'],
    howToUse: 'Apply to entire face morning and evening before heavier creams.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-pha-lip-serum-15',
    name: 'PHA 5% Exfoliating Lip Serum (15ml)', price: 4600, cat: 'ordinary', filter: 'lip', 
    images: ['the ordinary/PHA 5%25 Exfoliating Lip Serum (15ml)  Rs.4600.png'], img: 'the ordinary/PHA 5%25 Exfoliating Lip Serum (15ml)  Rs.4600.png',
    desc: 'A groundbreaking treatment curated specifically for the sensitive lips utilizing a gentle 5% Polyhydroxy Acid (PHA) concentration. It expertly lifts and buffs away dead skin cells and dryness while intensely infusing hydrating components to leave behind plush, smooth, and naturally plump-looking lips ready for perfect makeup application.',
    benefits: ['Gentle Exfoliation', 'Softens Lips', 'Improves lip texture'],
    howToUse: 'Apply a small amount to lips as needed. Do not rinse off.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-retinol-02-30',
    name: 'Retinol 0.2% in Squalane (30ml)', price: 5200, cat: 'ordinary', filter: 'retinoids', 
    images: ['the ordinary/Retinol 0.2 in squalane (30ml)  Rs.5200.png'], img: 'the ordinary/Retinol 0.2 in squalane (30ml)  Rs.5200.png',
    desc: 'A meticulously crafted introductory formulation offering 0.2% pure Retinol seamlessly suspended in a lightweight layer of deeply moisturizing Squalane oil. Absolutely ideal for retinoid novices, this low-strength formula gently fades the look of preliminary fine lines, photoaging, and spots, while squalane ensures the skin remains calm and hydrated during the transition.',
    benefits: ['Targets fine lines', 'Improves skin tone', 'Hydrating squalane base'],
    howToUse: 'Apply a small amount to face in the PM, after water-based serums but before heavier treatments.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-retinol-05-30',
    name: 'Retinol 0.5% in Squalane (30ml)', price: 5500, cat: 'ordinary', filter: 'retinoids', 
    images: ['the ordinary/Retinol 0.5 in squalane (30ml)  Rs.5500.png'], img: 'the ordinary/Retinol 0.5 in squalane (30ml)  Rs.5500.png',
    desc: 'A moderate strength anti-aging marvel containing 0.5% pure Retinol designed for skin that has successfully adapted to introductory formulas. Delivering powerful results against deep-set fine lines, elasticity loss, and stubborn hyperpigmentation marks, its replenishing Squalane infusion protects against dehydration for a wonderfully transformed youthful skin surface.',
    benefits: ['Moderate anti-aging', 'Refines skin texture', 'Nourishing squalane'],
    howToUse: 'Apply a small amount to face in the PM. Build tolerance gradually.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-retinol-1-30',
    name: 'Retinol 1% in Squalane (30ml)', price: 6200, cat: 'ordinary', filter: 'retinoids', 
    images: ['the ordinary/Retinol 1 in squalane (30ml)  Rs.6200.png'], img: 'the ordinary/Retinol 1 in squalane (30ml)  Rs.6200.png',
    desc: 'An expert-level, highly potent formulation containing 1% pure Retinol for experienced retinoid users. This high-strength treatment pushes cellular turnover into high gear, dramatically eradicating prevalent signs of aging, deep wrinkles, major textural deterioration, and visible sun damage. Squalane enhances delivery and maintains essential moisture barrier equilibrium.',
    benefits: ['High-strength anti-aging', 'Visibly smoother skin', 'Boosts cellular turnover'],
    howToUse: 'Apply a small amount to face in the PM. Only use if skin has built tolerance to lower strength retinols.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-salicylic-30',
    name: 'Salicylic Acid 2% Solution (30ml)', price: 4800, cat: 'ordinary', filter: 'acids', 
    images: ['the ordinary/Salicylic acid (30ml)  Rs.4800.png'], img: 'the ordinary/Salicylic acid (30ml)  Rs.4800.png',
    desc: 'An iconic targeted BHA serum that actively penetrates the lipid layers to exfoliate the interior walls of pores. By effectively dislodging trapped dirt, oil, and dead skin cells, it drastically minimizes the frequency of acne breakouts, dissolves blackheads, refines pores, and ultimately restores continuous, visible skin clarity and radiance.',
    benefits: ['Cleanses deep pores', 'Fights blemishes', 'Improves skin clarity'],
    howToUse: 'Apply a small dot directly onto spots for visible improvement or apply a small amount over the face to maintain visible clarity.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-soothing-barrier-30',
    name: 'Soothing & Barrier Support Serum (30ml)', price: 5200, cat: 'ordinary', filter: 'serums', 
    images: ['the ordinary/Soothing and barrier support serum (30ml)  Rs.5200.png'], img: 'the ordinary/Soothing and barrier support serum (30ml)  Rs.5200.png',
    desc: 'An intensive, multi-active recovery concentrate specially tailored to repair compromised skin barriers and immediately mitigate tightness, stinging, and visible redness. Built with a powerhouse complex of Vitamin B12, Gallic Acid derivatives, Centella Asiatica, and crucial Ceramides, this calming pink serum quickly restores complete dermal hydration, elasticity, and comfort.',
    benefits: ['Soothes irritation', 'Repairs skin barrier', 'Reduces redness'],
    howToUse: 'Apply a few drops to the face in the morning and evening.',
    authenticity: 'DECIEM Canada Original.'
  },
  { 
    id: 'ord-squalane-lip-15',
    name: 'Squalane + Amino Acid Lip Balm (15ml)', price: 3900, cat: 'ordinary', filter: 'lip', 
    images: ['the ordinary/lip burm.png'], img: 'the ordinary/lip burm.png',
    desc: 'An innovative, deeply conditioning balm utilizing exceptional plant-derived Squalane and fundamental Amino Acids precisely targeted to lock in moisture on the lip barrier. It intensely protects drying, cracking, and peeling lips against harsh temperature changes, delivering instantaneous softness, deep hydration, and sustained smooth protection throughout the entire day.',
    benefits: ['Intense Lip Hydration', 'Locks in moisture', 'Nourishing Amino Acids'],
    howToUse: 'Apply to lips as needed throughout the day for continuous hydration.',
    authenticity: 'DECIEM Canada Original.'
  }
];

// Global products data used by the UI
window.productsData = [...defaultProducts];

// Fetch from Database
async function fetchDatabaseProducts() {
    window.fetchDatabaseProducts = fetchDatabaseProducts;
    if (window.DB_FETCH_RUNNING) return; 
    window.DB_FETCH_RUNNING = true;

    // Use current Global URL definition
    const API_URL = `${window.BASE_URL || 'http://localhost:5000/api'}/products`;

    try {
        console.log("Fetching from:", API_URL);
        
        // Add 5-second timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(API_URL, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('API unreachable: ' + response.status);
        const dbProducts = await response.json();

        if (Array.isArray(dbProducts) && dbProducts.length > 0) {
            console.log(`✅ Loaded ${dbProducts.length} products from Database.`);
            
            // Re-map the variable names slightly if they differ between DB and Frontend
            const mappedDbProducts = dbProducts.map(p => {
                const formatImg = (str) => {
                    if (!str) return 'images/placeholder.png';
                    if (str.startsWith('data:image') || str.startsWith('http')) return str;
                    // Fix common encoding issues and handle spaces
                    let path = str.replace(/%25/g, '%').replace(/%2B/g, '+');
                    // Ensure spaces are URL-safe
                    return path.split('/').map(part => encodeURIComponent(part)).join('/');
                };

                return {
                    ...p,
                    id: p.id || p._id,
                    img: formatImg(p.img),
                    images: Array.isArray(p.images) ? p.images.map(img => formatImg(img)) : [formatImg(p.img)]
                };
            });

            // MERGE: Keep default products, but override them if DB has updated versions, and add NEW ones from DB
            const updatedProductsData = [...defaultProducts];
            mappedDbProducts.forEach(dbProd => {
                // HOTFIX: If the DB returns the old 'cleansers' category for these bodycare items, force them to 'body'
                if ((dbProd.id === 'cer-hydrating-oil' || dbProd.id === 'cer-psoriasis') && dbProd.filter === 'cleansers') {
                    dbProd.filter = 'body';
                }

                const index = updatedProductsData.findIndex(p => (p.id && (p.id === dbProd.id)) || p.name === dbProd.name);
                if (index !== -1) {
                    updatedProductsData[index] = dbProd; // Override existing
                } else {
                    updatedProductsData.unshift(dbProd); // Add as new at the top
                }
            });

            window.productsData = updatedProductsData;
        } else {
            console.log("ℹ️ No new products in database, using defaults.");
        }

        // --- FINAL RENDERING (ALWAYS DO THIS) ---
        window.DB_FETCH_COMPLETED = true;
        const renderFuncs = [
            'renderInventory', 'renderRoundCategories', 'renderLatestArrivals', 'renderFeaturedProducts',
            'renderCategoryProducts', 'renderProduct', 'renderProducts', 
            'renderAvuruduSale', 'renderAvuruduBannerUI', 'updateRightSidebar', 'renderHomeAllProducts',
            'updateMobileNavCategories'
        ];
        
        renderFuncs.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                try { window[funcName](window.productsData); } catch(e) { console.error(`Render Error (${funcName}):`, e); }
            } else if (typeof window.opener !== 'undefined' && typeof window[funcName] === 'function') {
                 // Fallback for some older scripts
                 try { window[funcName](); } catch(e) {}
            }
        });

    } catch (error) {
        console.warn("⚠️ Using hardcoded products fallback.", error.message);
        
        window.DB_FETCH_COMPLETED = true;
        // Trigger renders even on failure to ensure UI balance
        const renderFuncs = [
            'renderInventory', 'renderRoundCategories', 'renderLatestArrivals', 'renderFeaturedProducts',
            'renderCategoryProducts', 'renderProduct', 'renderProducts', 
            'renderAvuruduSale', 'renderAvuruduBannerUI', 'updateRightSidebar', 'renderHomeAllProducts',
            'updateMobileNavCategories'
        ];
        renderFuncs.forEach(fn => {
            if (typeof window[fn] === 'function') {
                try { window[fn](window.productsData); } catch(e) {}
            }
        });
    } finally {
        window.DB_FETCH_RUNNING = false;
    }
}

// Automatically fetch latest data when the page loads
fetchDatabaseProducts();

// Visitor Tracking
async function logVisit() {
    try {
        const url = (window.BASE_URL || (typeof BASE_URL !== 'undefined' ? BASE_URL : null));
        if (!url) return;
        
        fetch(url + '/stats/visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: window.location.pathname.split('/').pop() || 'index.html' })
        });
    } catch (e) {
        console.warn("LogVisit failed (likely offline or missing BASE_URL):", e);
    }
}
logVisit();

// --- SHOPPING CART LOGIC ---
// --- AVURUDU BANNER (FOR OTHER PAGES OR DYNAMIC INJECTION) ---
function renderAvuruduBannerUI() {
    const container = document.getElementById('avurudu-sale-container');
    if (!container) return; // Only run if the element exists

    // Filter products for the sale (example: first 4 Ordinary products with a discount > 0)
    const saleProducts = window.productsData.filter(p => (p.cat === 'ordinary' || p.cat === 'cerave') && p.discount > 0).slice(0, 4);
    
    // If no discounted products found yet, just take some from Ordinary
    const finalSale = saleProducts.length > 0 ? saleProducts : window.productsData.filter(p => p.cat === 'ordinary').slice(0, 4);

    container.innerHTML = `
    <div class="container overflow-hidden">
      <div class="avurudu-sale-card" style="background-image: url('new year/Happy Sinhala and Tamil New Year Wishes Instagram Post.png'); border-radius: 40px; overflow: hidden; padding: 60px 40px; position: relative;">
        <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.15); pointer-events:none;"></div>
        
        <div class="row align-items-center" style="position: relative; z-index: 2;">
          <div class="col-lg-5 mb-5 mb-lg-0 text-center text-lg-start">
            <span class="sale-badge" style="background:#d32f2f; color:#fff; padding: 10px 20px; border-radius: 50px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; display: inline-block; margin-bottom: 20px; box-shadow: 0 10px 20px rgba(211,47,47,0.3);">Avurudu Mega Sale</span>
            <h2 style="font-family: var(--font-fancy); font-size: clamp(3rem, 6vw, 4.5rem); color: #fff; line-height: 1.1; margin-bottom: 25px; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Sinhala & Tamil <br> New Year Offer</h2>
            <p style="color: rgba(255,255,255,0.9); font-size: 1.1rem; margin-bottom: 35px; max-width: 450px;">Celebrate the season with festive glow! Exclusive 5% discount on all your skincare essentials. Limited time only.</p>
            
            <div class="offer-timer d-flex gap-3 mb-4 justify-content-center justify-content-lg-start">
              <div style="background:#fff; width:70px; height:70px; border-radius:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 15px 35px rgba(0,0,0,0.2);">
                <span style="font-size:24px; font-weight:800; color:#d32f2f; line-height:1;">12</span>
                <span style="font-size:10px; text-transform:uppercase; font-weight:700; color:#777; margin-top:2px;">Days</span>
              </div>
              <div style="background:#fff; width:70px; height:70px; border-radius:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 15px 35px rgba(0,0,0,0.2);">
                <span style="font-size:24px; font-weight:800; color:#d32f2f; line-height:1;">08</span>
                <span style="font-size:10px; text-transform:uppercase; font-weight:700; color:#777; margin-top:2px;">Hours</span>
              </div>
              <div style="background:#fff; width:70px; height:70px; border-radius:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 15px 35px rgba(0,0,0,0.2);">
                <span style="font-size:24px; font-weight:800; color:#d32f2f; line-height:1;">45</span>
                <span style="font-size:10px; text-transform:uppercase; font-weight:700; color:#777; margin-top:2px;">Mins</span>
              </div>
            </div>
          </div>
          
          <div class="col-lg-7">
            <div class="row g-3">
              ${finalSale.map(prod => `
                <div class="col-6 col-md-3">
                  <div class="sale-prod-mini" style="background:#fff; border-radius:25px; padding:15px; text-align:center; height:100%; transition:0.4s; position:relative; box-shadow:0 15px 35px rgba(0,0,0,0.1);">
                    <div style="position:absolute; top:12px; right:12px; background:#d32f2f; color:#fff; font-size:10px; font-weight:800; padding:4px 8px; border-radius:8px; z-index:5; box-shadow: 0 5px 10px rgba(211,47,47,0.2);">5% OFF</div>
                    <div style="width:100%; height:120px; margin-bottom:15px; cursor:pointer;" onclick="location.href='product.html?id=${prod.id}'">
                      <img src="${prod.img}" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    <div style="font-size:12px; font-weight:800; color:#333; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.3; height:32px;">${prod.name}</div>
                    <div style="font-size:14px; font-weight:800; color:#d32f2f; margin-bottom:12px;">Rs. ${prod.price.toLocaleString()}</div>
                    <button onclick="addToCart('${prod.id}')" style="background:var(--dark); color:#fff; border:none; width:100%; padding:10px; border-radius:12px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; cursor:pointer; transition:0.3s; margin:0;" 
                            onmouseover="this.style.background='var(--gold)', this.style.color='#000'" onmouseout="this.style.background='var(--dark)', this.style.color='#fff'">Buy Now</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
}

let shoppingCart = JSON.parse(localStorage.getItem('bib_cart')) || [];

function saveCart() {
    localStorage.setItem('bib_cart', JSON.stringify(shoppingCart));
    renderCart();
}

function addToCart(prodId, qty = 1) {
    const product = window.productsData.find(p => p.id === prodId || p.name === prodId);
    if (!product) {
       console.error("Product not found to add:", prodId);
       return;
    }
    
    const qtyInt = parseInt(qty);
    const existing = shoppingCart.find(item => item.id === product.id);
    
    if (existing) {
        existing.qty += qtyInt;
    } else {
        shoppingCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            qty: qtyInt
        });
    }
    
    saveCart();
    
    // Open the side drawer if on a page that supports it
    const cartDrawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');
    
    if (cartDrawer && overlay) {
        cartDrawer.classList.add('open'); // Fixed: CSS uses .open
        overlay.classList.add('show');    // Fixed: CSS uses .show
    } else {
        alert(product.name + ' added to your bag!');
    }
}

// Attach generic window access to addToCart for inline HTML onclicks 
window.addToCart = addToCart;

function removeFromCart(prodId) {
    shoppingCart = shoppingCart.filter(item => item.id !== prodId);
    saveCart();
}
window.removeFromCart = removeFromCart;

function updateCartQty(prodId, newQty) {
    const item = shoppingCart.find(i => i.id === prodId);
    if (item) {
        item.qty = parseInt(newQty);
        if (item.qty <= 0) removeFromCart(prodId);
    }
    saveCart();
}
window.updateCartQty = updateCartQty;

function getCartTotal() {
    return shoppingCart.reduce((total, item) => total + (item.price * item.qty), 0);
}
window.getCartTotal = getCartTotal;

function renderCart() {
    // Update all cart badges across the nav bar
    const badges = document.querySelectorAll('.cart-badge');
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.qty, 0);
    badges.forEach(b => b.textContent = totalItems);
    
    // Render Sidebar Cart Drawer if it exists
    const cartDrawer = document.getElementById('cart-drawer');
    if (!cartDrawer) return; 

    // Force drawer to be a flex column
    cartDrawer.style.display = 'flex';
    cartDrawer.style.flexDirection = 'column';
    
    const cartHead = cartDrawer.querySelector('.cart-head h3');
    if (cartHead) cartHead.textContent = `Cart (${totalItems})`;
    
    let itemsContainer = document.getElementById('cart-items-container');
    if (!itemsContainer) {
        // Strip the placeholder empty UI
        const emptyState = cartDrawer.querySelector('.cart-empty');
        if (emptyState) emptyState.remove();
        
        itemsContainer = document.createElement('div');
        itemsContainer.id = 'cart-items-container';
        cartDrawer.insertBefore(itemsContainer, cartDrawer.children[1]);
    }
    // Always apply these styles to itemsContainer
    itemsContainer.style.padding = '20px';
    itemsContainer.style.flex = '1';
    itemsContainer.style.overflowY = 'auto';
    itemsContainer.style.overflowX = 'hidden';
    
    let footerBox = document.getElementById('cart-footer-box');
    if (!footerBox) {
        footerBox = document.createElement('div');
        footerBox.id = 'cart-footer-box';
        footerBox.style.padding = '20px';
        footerBox.style.borderTop = '1px solid #eee';
        footerBox.style.background = 'var(--beige-light)';
        footerBox.style.flexShrink = '0';
        footerBox.style.width = '100%';
        footerBox.style.boxSizing = 'border-box';
        cartDrawer.appendChild(footerBox);
    }
    
    // footerBox is already declared and initialized above
    
    if (shoppingCart.length === 0) {
        itemsContainer.innerHTML = '<div style="text-align:center; padding: 40px 0; color:#777;">Your cart is empty.</div>';
        if (footerBox) footerBox.style.display = 'none';
        return;
    }
    
    if (footerBox) footerBox.style.display = 'block';
    
    // Draw items
    itemsContainer.innerHTML = shoppingCart.map(item => `
        <div style="display:flex; gap:15px; margin-bottom:20px; align-items:center;">
            <img src="${item.img}" style="width:70px; height:70px; object-fit:contain; background:#f9f9f9; border-radius:8px; border: 1px solid #eee;">
            <div style="flex-grow:1;">
                <div style="font-size:14px; font-weight:600; font-family:var(--font-sans); color:var(--dark);">${item.name}</div>
                <div style="color:var(--gold); font-size:13px; font-weight:700; margin-top:5px;">Rs. ${(item.price * item.qty).toLocaleString()}</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                <button onclick="updateCartQty('${item.id}', ${item.qty + 1})" style="border:none; background:#eee; color:#333; cursor:pointer; width:24px; height:24px; border-radius:4px;">+</button>
                <span style="font-size:13px; font-weight:600;">${item.qty}</span>
                <button onclick="updateCartQty('${item.id}', ${item.qty - 1})" style="border:none; background:#eee; color:#333; cursor:pointer; width:24px; height:24px; border-radius:4px;">-</button>
            </div>
        </div>
    `).join('');
    
    const subtotal = getCartTotal();
    const shipping = window._shippingFee !== undefined ? window._shippingFee : 450; 
    
    footerBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:14px; font-family:var(--font-sans);">
            <span style="color:#666;">Subtotal</span>
            <span style="font-weight:600; color:var(--dark);">Rs. ${subtotal.toLocaleString()}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:14px; font-family:var(--font-sans);">
            <span style="color:#666;">Shipping</span>
            <span style="font-weight:600; color:var(--brown);">Rs. ${shipping.toLocaleString()}</span>
        </div>
        <a href="checkout.html" style="display:block; text-align:center; background:var(--brown); color:#fff; padding:15px; border-radius:8px; text-decoration:none; font-family:var(--font-sans); font-weight:600; letter-spacing:0.05em; transition:0.3s;" onmouseover="this.style.background='var(--gold)'" onmouseout="this.style.background='var(--brown)'">SECURE CHECKOUT &rarr;</a>
    `;

    // Also render on Standalone Cart Page if it exists
    const standaloneItems = document.getElementById('cart-items-list');
    const standaloneSummary = document.getElementById('summary-details');

    if (standaloneItems && standaloneSummary) {
        if (shoppingCart.length === 0) {
            standaloneItems.innerHTML = '<div style="text-align:center; padding: 100px 0;"><h3>Your bag is empty</h3><a href="shop.html" style="color:var(--gold); text-decoration:underline;">Continue Shopping</a></div>';
            standaloneSummary.innerHTML = '';
        } else {
            standaloneItems.innerHTML = shoppingCart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-img"><img src="${item.img}"></div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
                        <div class="cart-item-qty">
                            <span class="cart-item-qty-btn" onclick="updateCartQty('${item.id}', ${item.qty - 1})">-</span>
                            <span>${item.qty}</span>
                            <span class="cart-item-qty-btn" onclick="updateCartQty('${item.id}', ${item.qty + 1})">+</span>
                        </div>
                    </div>
                </div>
            `).join('');

            const shipping = window._shippingFee !== undefined ? window._shippingFee : 450;
            standaloneSummary.innerHTML = `
                <div class="summary-row"><span>Subtotal</span><span>Rs. ${subtotal.toLocaleString()}</span></div>
                <div class="summary-row"><span>Delivery</span><span>Rs. ${shipping.toLocaleString()}</span></div>
                <div class="summary-row total" style="font-weight:800; border-top:1px solid #eee; padding-top:15px; margin-top:15px;"><span>Total</span><span>Rs. ${(subtotal + shipping).toLocaleString()}</span></div>
            `;
        }
    }
}
window.renderCart = renderCart;

// Fetch Global Settings (Shipping Fee)
async function loadGlobalSettings() {
    try {
        const BASE = window.BASE_URL || '/api';
        const res = await fetch(`${BASE}/settings/shippingFee?cb=${Date.now()}`);
        if (res.ok) {
            const data = await res.json();
            if (data.value !== undefined) {
                window._shippingFee = Number(data.value);
                console.log("Global shipping fee loaded:", window._shippingFee);
                // Re-render cart if it was already rendered with default
                if (typeof renderCart === 'function') renderCart();
            }
        }
    } catch (e) {
        console.warn("Failed to load global settings:", e);
    }
}

// Call initially
document.addEventListener('DOMContentLoaded', () => {
    loadGlobalSettings();
    setTimeout(renderCart, 200);
});

// --- HOME ALL PRODUCTS GRID ---
window.renderHomeAllProducts = function() {
    const grid = document.getElementById('hap-grid');
    if (!grid) return;

    // If database fetch is not completed yet, show skeletons
    if (!window.DB_FETCH_COMPLETED) {
        grid.innerHTML = Array(8).fill(0).map(() => `
          <div class="skeleton-card">
            <div class="skeleton-element skeleton-img"></div>
            <div class="skeleton-element skeleton-brand" style="width: 50%; margin: 8px auto 0;"></div>
            <div class="skeleton-element skeleton-title" style="margin-top: 10px;"></div>
            <div class="skeleton-element skeleton-price" style="width: 40%; margin: 8px auto 0;"></div>
          </div>
        `).join('');
        return;
    }

    // Dynamically generate tabs
    const tabsWrapper = document.querySelector('.hap-tabs');
    if (tabsWrapper && window.productsData && window.productsData.length > 0) {
        const activeTab = document.querySelector('.hap-tab.active');
        let currentFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';

        const categories = [...new Set(window.productsData.map(p => (p.cat || 'others').toLowerCase()))];
        
        let tabsHTML = `<button class="hap-tab ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>`;
        
        categories.forEach(cat => {
            let displayName = cat === 'ordinary' ? 'The Ordinary' : (cat === 'cerave' ? 'CeraVe' : cat.toUpperCase());
            tabsHTML += `<button class="hap-tab ${currentFilter === cat ? 'active' : ''}" data-filter="${cat}">${displayName}</button>`;
        });

        tabsWrapper.innerHTML = tabsHTML;
    }

    // Get up to 28 products
    const displayProducts = (category) => {
        let filtered = window.productsData;
        if (category && category !== 'all') {
            filtered = filtered.filter(p => (p.cat || 'others').toLowerCase() === category);
        }
        
        // Take up to 28 items (7 rows of 4)
        const productsToShow = filtered.slice(0, 28);
        
        grid.innerHTML = productsToShow.map(prod => {
            const catLower = (prod.cat || 'others').toLowerCase();
            const brandDisplay = catLower === 'cerave' ? 'CeraVe' : (catLower === 'ordinary' ? 'The Ordinary' : catLower.toUpperCase());
            return `
            <a href="product.html?id=${prod.id}" class="hap-card">
                <div class="hap-card-img">
                    <img src="${prod.img || 'images/placeholder.png'}" alt="${prod.name}">
                    <div class="hap-card-actions">
                        <span class="h-icon" onclick="event.preventDefault(); addToCart('${prod.id}')" aria-label="Add to Cart">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        </span>
                        <span class="h-icon" onclick="event.preventDefault(); shareProduct('${prod.id}')" aria-label="Share">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        </span>
                    </div>
                </div>
                <div class="hap-card-brand">${brandDisplay}</div>
                <div class="hap-card-title">${prod.name}</div>
                <div class="hap-card-price">Rs. ${(prod.price || 0).toLocaleString()}</div>
            </a>
            `;
        }).join('');
    };

    // Initial render
    const activeTabNow = document.querySelector('.hap-tab.active');
    displayProducts(activeTabNow ? activeTabNow.getAttribute('data-filter') : 'all');

    // Setup Tab Listeners
    const tabs = document.querySelectorAll('.hap-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            displayProducts(tab.getAttribute('data-filter'));
        });
    });
};

// ── DYNAMIC MOBILE NAVIGATION DRAWER CATEGORIES ──
window.updateMobileNavCategories = function(products) {
    if (!products || !products.length) return;
    
    // Find the Categories label in the mobile nav
    const labels = Array.from(document.querySelectorAll('.mobile-nav .nav-label, .drawer-content .nav-label'));
    const catLabel = labels.find(el => el.textContent.trim().toLowerCase() === 'categories');
    if (!catLabel) return;

    const parent = catLabel.parentNode;
    const siblings = Array.from(parent.children);
    const catIndex = siblings.indexOf(catLabel);
    
    // Find where the next section label starts so we know where to stop
    let nextLabelIndex = siblings.length;
    for (let i = catIndex + 1; i < siblings.length; i++) {
        if (siblings[i].classList.contains('nav-label')) {
            nextLabelIndex = i;
            break;
        }
    }

    // Remove the old hardcoded static items
    for (let i = nextLabelIndex - 1; i > catIndex; i--) {
        parent.removeChild(siblings[i]);
    }

    // Extract unique brands (cat) and categories (filter) from our active database products
    const brands = [...new Set(products.map(p => (p.cat || '').toLowerCase().trim()).filter(Boolean))];
    const filters = [...new Set(products.map(p => (p.filter || '').toLowerCase().trim()).filter(Boolean))];

    // Mappings for beautiful client-facing titles
    const brandTitles = {
        'ordinary': 'The Ordinary',
        'cerave': 'CeraVe'
    };

    const filterTitles = {
        'cleansers': 'Cleansers',
        'serums': 'Serums & Hydration',
        'moisturizers': 'Moisturizers',
        'sunscreen': 'Sun Protection',
        'acids': 'Acids & Exfoliants',
        'retinoids': 'Retinoids',
        'body': 'Body Care',
        'targeted': 'Targeted Care',
        'eye': 'Eye Care',
        'lip': 'Lip Care',
        'hair': 'Hair Care'
    };

    // Helper to insert item before the current next section label
    const insertMenuItem = (url, text) => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${url}">${text}</a>`;
        
        // Dynamically find the next nav-label to always insert right before it
        const currentNextLabel = Array.from(parent.querySelectorAll('.nav-label')).find(el => {
            return el.textContent.trim().toLowerCase() !== 'categories' && Array.from(parent.children).indexOf(el) > catIndex;
        });
        parent.insertBefore(li, currentNextLabel || null);
    };

    // 1. Add Brands
    brands.forEach(b => {
        const title = brandTitles[b] || (b.charAt(0).toUpperCase() + b.slice(1));
        insertMenuItem(`shop.html?cat=${b}`, title);
    });

    // 2. Add Filters
    filters.forEach(f => {
        const title = filterTitles[f] || (f.charAt(0).toUpperCase() + f.slice(1));
        insertMenuItem(`shop.html?filter=${f}`, title);
    });
};

// ── LIVE SEARCH DROPDOWN ──
function highlightMatch(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function buildSearchDropdown(inputEl, dropdownId) {
    // Remove existing dropdown
    const old = document.getElementById(dropdownId);
    if (old) old.remove();

    const query = (inputEl.value || '').trim().toLowerCase();
    if (query.length < 1) {
        closeAllSearchDropdowns();
        return;
    }

    document.body.classList.add('search-active');

    const products = window.productsData || defaultProducts;
    const matched = products.filter(p => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.cat || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const filterStr = (p.filter || '').toLowerCase();
        return name.includes(query) || cat.includes(query) || brand.includes(query) || filterStr.includes(query);
    });

    const dropdown = document.createElement('div');
    dropdown.className = 'search-results-dropdown';
    dropdown.id = dropdownId;

    if (matched.length === 0) {
        dropdown.innerHTML = `<div class="srd-empty">No products found for "<strong>${query}</strong>"</div>`;
    } else {
        const header = document.createElement('div');
        header.className = 'srd-header';
        header.textContent = `Results (${matched.length})`;
        dropdown.appendChild(header);

        matched.forEach(prod => {
            const item = document.createElement('a');
            item.className = 'srd-item';
            item.href = `product.html?id=${prod.id}`;

            const catName = (prod.cat || 'others').toLowerCase() === 'ordinary' ? 'The Ordinary'
                          : (prod.cat || 'others').toLowerCase() === 'cerave'   ? 'CeraVe'
                          : (prod.cat || '').toUpperCase();

            item.innerHTML = `
                <img class="srd-img" src="${prod.img || 'images/placeholder.png'}" alt="${prod.name}" onerror="this.src='images/placeholder.png'">
                <div class="srd-info">
                    <div class="srd-name">${highlightMatch(prod.name, query)}</div>
                    <div class="srd-meta">${catName}</div>
                </div>
                <div class="srd-price">Rs. ${(prod.price || 0).toLocaleString()}</div>
            `;
            dropdown.appendChild(item);
        });

        const viewAll = document.createElement('a');
        viewAll.className = 'srd-view-all';
        viewAll.href = `shop.html?q=${encodeURIComponent(query)}`;
        viewAll.textContent = `View all results →`;
        dropdown.appendChild(viewAll);
    }

    // Attach dropdown to BODY and position it absolutely based on the input's bounding rect
    // This avoids overflow:hidden clipping from any parent containers
    const rect = inputEl.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    
    if (window.innerWidth <= 768) {
        const mBar = inputEl.closest('.mobile-search-bar');
        const containerRect = mBar ? mBar.getBoundingClientRect() : rect;
        dropdown.style.top = (containerRect.bottom - 2) + 'px';
        
        const mobileWidth = Math.min(window.innerWidth * 0.9, 340);
        dropdown.style.width = mobileWidth + 'px';
        dropdown.style.left = ((window.innerWidth - mobileWidth) / 2) + 'px';
    } else {
        dropdown.style.top = (rect.bottom + 6) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = Math.max(rect.width, 320) + 'px';
    }
    
    dropdown.style.zIndex = '999999';
    document.body.appendChild(dropdown);

    // Reposition on scroll/resize
    const reposition = () => {
        const r = inputEl.getBoundingClientRect();
        if (window.innerWidth <= 768) {
            const mBar = inputEl.closest('.mobile-search-bar');
            const containerRect = mBar ? mBar.getBoundingClientRect() : r;
            dropdown.style.top = (containerRect.bottom - 2) + 'px';
            
            const mobileWidth = Math.min(window.innerWidth * 0.9, 340);
            dropdown.style.width = mobileWidth + 'px';
            dropdown.style.left = ((window.innerWidth - mobileWidth) / 2) + 'px';
        } else {
            dropdown.style.top = (r.bottom + 6) + 'px';
            dropdown.style.left = r.left + 'px';
            dropdown.style.width = Math.max(r.width, 320) + 'px';
        }
    };
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition, { passive: true });
    dropdown._cleanup = () => {
        window.removeEventListener('scroll', reposition);
        window.removeEventListener('resize', reposition);
    };
}

function closeAllSearchDropdowns() {
    document.querySelectorAll('.search-results-dropdown').forEach(d => {
        if (typeof d._cleanup === 'function') d._cleanup();
        d.remove();
    });
    document.body.classList.remove('search-active');
}

window.setupGlobalSearch = function() {
    const isShopPage = window.location.pathname.includes('shop.html');

    if (isShopPage) {
        // Sync URL search query to the input fields on the shop page on load
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q');
        if (q) {
            const searchInp = document.getElementById('search-inp');
            const mSearchInp = document.getElementById('m-search-inp-top');
            if (searchInp) searchInp.value = q;
            if (mSearchInp) mSearchInp.value = q;
        }
        // No dropdown needed on shop page — it has its own filter
        return;
    }

    // ── DESKTOP SEARCH BAR ──
    const searchInp = document.getElementById('search-inp');
    if (searchInp) {
        searchInp.addEventListener('input', () => {
            buildSearchDropdown(searchInp, 'srd-desktop');
        });
        searchInp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const q = searchInp.value.trim();
                if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
            }
            if (e.key === 'Escape') closeAllSearchDropdowns();
        });
        searchInp.addEventListener('focus', () => {
            if (searchInp.value.trim().length > 0) {
                buildSearchDropdown(searchInp, 'srd-desktop');
            }
        });
    }

    // ── MOBILE SEARCH BAR ──
    const mSearchInp = document.getElementById('m-search-inp-top');
    if (mSearchInp) {
        mSearchInp.addEventListener('input', () => {
            buildSearchDropdown(mSearchInp, 'srd-mobile');
        });
        mSearchInp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const q = mSearchInp.value.trim();
                if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
            }
            if (e.key === 'Escape') closeAllSearchDropdowns();
        });
        mSearchInp.addEventListener('focus', () => {
            if (mSearchInp.value.trim().length > 0) {
                buildSearchDropdown(mSearchInp, 'srd-mobile');
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-results-dropdown') &&
            !e.target.closest('#search-inp') &&
            !e.target.closest('#m-search-inp-top')) {
            closeAllSearchDropdowns();
        }
    });
};

// ── DOM LOAD INITIALIZATION ──
if (typeof document !== 'undefined') {
    const runInitialization = () => {
        // Run mobile nav categories instantly with existing defaultProducts so there's no layout jump
        if (window.productsData) {
            window.updateMobileNavCategories(window.productsData);
        }
        // Bind search setup
        window.setupGlobalSearch();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInitialization);
    } else {
        runInitialization();
    }
}
