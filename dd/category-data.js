const categories = {
    'cleansers': {
        title: 'The Art of Cleansing',
        subtitle: 'Cleansers',
        description: 'Every great skin routine starts here. Cleansing is essential for removing cumulative dirt, sebum, and sweat without stripping the natural barrier. Our curated selection of CeraVe and The Ordinary cleansers are designed for every skin type.',
        benefits: [
            { title: 'Removes Impurities', desc: 'Lifts away urban pollutants and microscopic dust that lead to breakouts.' },
            { title: 'Preps for Serums', desc: 'A clean canvas allows active treatments like Niacinamide to penetrate deeper.' },
            { title: 'Maintains pH Balance', desc: 'Our pH-balanced formulas protect your acid mantle from disruption.' }
        ],
        usage: [
            { step: 'Quantity', desc: 'Dispense a pea-sized amount onto damp palms.' },
            { step: 'Massage', desc: 'Gently massage in circular motions for 60 seconds.' },
            { step: 'Rinse', desc: 'Use lukewarm water to rinse thoroughly. Pat dry with a clean towel.' }
        ]
    },
    'serums': {
        title: 'Precision Serums & Hydration',
        subtitle: 'Serums & Hydration',
        description: 'Think of serums as the "heavy lifters" of your skincare. High-potency ingredients like Hyaluronic Acid and Niacinamide target specific concerns directly at the cellular level.',
        benefits: [
            { title: 'Deep Hydration', desc: 'Hyaluronic Acid molecules attract 1000x their weight in water to plump skin.' },
            { title: 'Texture Refinement', desc: 'Niacinamide works to minimize pore size and smooth out uneven surfaces.' },
            { title: 'Oil Regulation', desc: 'Highly effective at balancing sebum production for a matte, healthy finish.' }
        ],
        usage: [
            { step: 'Order', desc: 'Apply after cleansing but before moisturizing.' },
            { step: 'Damp Skin', desc: 'Apply water-based serums to slightly damp skin for max absorption.' },
            { step: 'Pat, Don\'t Rub', desc: 'Press into the skin gently with palms.' }
        ]
    },
    'acids': {
        title: 'The Glow Factor: Exfoliating Acids',
        subtitle: 'Exfoliating Acids',
        description: 'Chemical exfoliation is the secret to a radiant complexion. Acids like Glycolic and Lactic gently dissolve the "glue" holding dead skin cells together.',
        benefits: [
            { title: 'Instant Brightening', desc: 'Results in a noticeably more radiant skin tone after just one use.' },
            { title: 'Unclogs Pores', desc: 'Salicylic Acid (BHA) dives deep into pores to clear out congestion.' },
            { title: 'Fade Scars', desc: 'Regular exfoliation helps fade dark spots and acne marks over time.' }
        ],
        usage: [
            { step: 'Frequency', desc: 'Start with 2-3 times per week to avoid over-exfoliation.' },
            { step: 'Sensitivity', desc: 'Expect a slight tingling sensation; this is the active acid working.' },
            { step: 'SPF is Key', desc: 'Always use sunscreen the next day as acids increase sun sensitivity.' }
        ]
    },
    'retinoids': {
        title: 'Gold Standard Anti-Aging',
        subtitle: 'Retinoids',
        description: 'Retinoids are the most proven ingredient for reversing the signs of aging. They accelerate cell turnover and stimulate collagen production.',
        benefits: [
            { title: 'Wrinkle Reduction', desc: 'Significant improvement in the appearance of fine lines within 12 weeks.' },
            { title: 'Collagen Boost', desc: 'Triggers the skin to produce its own firming structural proteins.' },
            { title: 'Complexion Clarity', desc: 'Refines the entire skin surface for a porcelain-like texture.' }
        ],
        usage: [
            { step: 'Patience', desc: 'Start slow (once or twice a week) and gradually increase frequency.' },
            { step: 'The Rule', desc: 'Only use at night. UV light deactivates Retinol.' },
            { step: 'Moisturize', desc: 'Always follow with a rich moisturizer to prevent dryness.' }
        ]
    },
    'sunscreen': {
        title: 'The Ultimate Protection',
        subtitle: 'Sun Protection',
        description: 'Sunscreen is the non-negotiable step. 90% of skin aging is caused by UV damage. Protecting your skin from the intense sun is essential.',
        benefits: [
            { title: 'Prevent DNA Damage', desc: 'Stops UV rays from breaking down your skin\'s genetic structure.' },
            { title: 'Stop Dark Spots', desc: 'Prevents hyperpigmentation from getting darker in the sun.' },
            { title: 'Anti-Aging', desc: 'The #1 way to prevent premature wrinkles and sagging.' }
        ],
        usage: [
            { step: 'Quantity', desc: 'Use the "two-finger rule" for proper coverage.' },
            { step: 'Reapply', desc: 'Reapply every 2 hours if you are outdoors.' },
            { step: 'Timing', desc: 'Apply 15 minutes before heading outside.' }
        ]
    },
    'makeup': {
        title: 'Editorial Glow: Makeup Essentials',
        subtitle: 'Makeup Essentials',
        description: 'Bridge the gap between skincare and glam. Our essentials focus on enhancing your natural beauty while being kind to your skin barrier.',
        benefits: [
            { title: 'Breathable Base', desc: 'Formulas that won\'t clog your pores or cause congestion.' },
            { title: 'Instant Uniformity', desc: 'Even out skin tone while maintaining a skin-like finish.' },
            { title: 'Skincare Infused', desc: 'Loaded with hydrating actives for all-day comfort.' }
        ],
        usage: [
            { step: 'Prep', desc: 'Always apply moisturizer and SPF before your base makeup.' },
            { step: 'Blending', desc: 'Use a damp sponge for a dewy, natural glow.' },
            { step: 'Removal', desc: 'Double cleanse at night to ensure every trace is gone.' }
        ]
    },
    'night': {
        title: 'Overnight Repair & Recovery',
        subtitle: 'Night Care',
        description: 'While you sleep, your skin works to repair damage. Our night care selection provides the nutrients and hydration needed for this critical cycle.',
        benefits: [
            { title: 'Deep Recovery', desc: 'Targets damage caused by environment during the day.' },
            { title: 'Intense Hydration', desc: 'Rich formulas prevent overnight moisture loss.' },
            { title: 'Enhanced Repair', desc: 'Peptides and Ceramides work harder while skin is at rest.' }
        ],
        usage: [
            { step: 'Order', desc: 'The final step of your evening ritual.' },
            { step: 'Massage', desc: 'Apply with upward strokes to promote lymphatic drainage.' },
            { step: 'Consistency', desc: 'Repetition is key for long-term cell regeneration.' }
        ]
    },
    'body': {
        title: 'Radiance Beyond the Face',
        subtitle: 'Body Care',
        description: 'Skincare doesn\'t stop at the neck. Our body care collection treats dryness, rough patches, and uneven tone across your entire frame.',
        benefits: [
            { title: 'Total Body Health', desc: 'Clears back-acne and dry elbows with clinical efficacy.' },
            { title: '24hr Hydration', desc: 'MVE technology releases hydration slowly throughout the day.' },
            { title: 'Velvet Texture', desc: 'Leaves your skin feeling noticeably softer and smoother.' }
        ],
        usage: [
            { step: 'Damp Skin', desc: 'Apply after showering while skin is still slightly damp.' },
            { step: 'Rough Spots', desc: 'Be extra generous on knees, elbows, and heels.' },
            { step: 'Frequency', desc: 'Apply daily for a consistent full-body glow.' }
        ]
    },
    'eye': {
        title: 'Precision Care for Delicate Eyes',
        subtitle: 'Eye Care',
        description: 'The eye area is 10x thinner than the rest of your face. It needs specialized ingredients that target puffiness and dark circles safely.',
        benefits: [
            { title: 'Reduce Puffiness', desc: 'Caffeine-rich formulas instantly drain fluid retention.' },
            { title: 'Brighten Shadows', desc: 'Targets vascular congestion to lift dark circles.' },
            { title: 'Plump Fine Lines', desc: 'Hyaluronic acid fills in "crow\'s feet" for a youthful look.' }
        ],
        usage: [
            { step: 'Ring Finger', desc: 'Always use your ring finger for the lightest touch.' },
            { step: 'Tapping', desc: 'Gently tap along the orbital bone; do not pull the skin.' },
            { step: 'Morning/Night', desc: 'Use twice daily for persistent results.' }
        ]
    },
    'lip': {
        title: 'Soft & Nourished Lips',
        subtitle: 'Lip Care',
        description: 'Lips lack oil glands and dry out quickly. Our lip care solutions protect and repair to keep them comfortable and plump.',
        benefits: [
            { title: 'Instant Relief', desc: 'Soothes cracked or dry lips within minutes.' },
            { title: 'Barrier Seal', desc: 'Prevents moisture loss in dry or windy conditions.' },
            { title: 'Smooth Canvas', desc: 'Perfect base for your favorite lip color.' }
        ],
        usage: [
            { step: 'Anytime', desc: 'Keep one in your bag for hydration throughout the day.' },
            { step: 'Bedtime', desc: 'Apply a thick layer at night as a repairing mask.' },
            { step: 'Exfoliate', desc: 'Gently brush lips once a week to remove dry skin.' }
        ]
    },
    'acne': {
        title: 'The Acne Clearing Solution',
        subtitle: 'Acne & Blemishes',
        description: 'Break the cycle of breakouts. Our clinical-grade solutions target acne-causing bacteria and clogged pores while soothing redness.',
        benefits: [
            { title: 'Clear Breakouts', desc: 'Salicylic acid dives deep to dissolve pore-clogging "glue".' },
            { title: 'Soothe Redness', desc: 'Niacinamide calms inflammation instantly.' },
            { title: 'Prevent Scarring', desc: 'Active repair stops blemishes from leaving permanent marks.' }
        ],
        usage: [
            { step: 'Targeted', desc: 'Use as a spot treatment or all over depending on the product.' },
            { step: 'Gentle', desc: 'Don\'t over-dry; balance with a light moisturizer.' },
            { step: 'Wait Time', desc: 'Allow treatment to dry before applying next steps.' }
        ]
    },
    'aging': {
        title: 'The Fountain of Youth Ritual',
        subtitle: 'Anti-Aging',
        description: 'Turn back the clock with science. Our anti-aging collection focuses on collagen restoration and cellular renewal for timeless skin.',
        benefits: [
            { title: 'Restore Elasticity', desc: 'Peptides and Retinoids firm up sagging skin structures.' },
            { title: 'Smooth Wrinkles', desc: 'Visible reduction in fine lines and deep expression marks.' },
            { title: 'Youthful Glow', desc: 'Increases cell turnover for a fresh, bright appearance.' }
        ],
        usage: [
            { step: 'Night Focus', desc: 'Most anti-aging actives are best used in the evening.' },
            { step: 'Uplift', desc: 'Apply in upward, outward motions against gravity.' },
            { step: 'Sun Prep', desc: 'SPF is mandatory when using anti-aging treatments.' }
        ]
    },
    'dry': {
        title: 'Deep Quench for Dry Skin',
        subtitle: 'Dry & Dehydrated',
        description: 'Banish tight, flaky skin forever. These formulas bridge the gap between moisture and long-term hydration for a plump, healthy look.',
        benefits: [
            { title: 'Moisture Surge', desc: 'Relieves tightness instantly with deep-acting hydrators.' },
            { title: 'Barrier Repair', desc: 'Ceramides stop water from escaping your skin.' },
            { title: 'Dewy Finish', desc: 'Transforms dull, dry texture into a radiant glow.' }
        ],
        usage: [
            { step: 'Layering', desc: 'Use a hydrating serum followed by a rich cream.' },
            { step: 'Frequency', desc: 'Apply morning and night without fail.' },
            { step: 'Seal', desc: 'Use a face oil as a final "seal" if skin is extremely dry.' }
        ]
    },
    'oil': {
        title: 'The Oil Control Masterclass',
        subtitle: 'Oil Control',
        description: 'Balance is key. Stop chasing matte skin and start teaching your skin to regulate itself with our professional oil-control range.',
        benefits: [
            { title: 'Balance Sebum', desc: 'Reduces excess shine without stripping essential moisture.' },
            { title: 'Minimize Pores', desc: 'Keeping pores clear prevents them from stretching and appearing larger.' },
            { title: 'Matte Radiance', desc: 'A clean, fresh finish that lasts all day.' }
        ],
        usage: [
            { step: 'Cleaning', desc: 'Don\'t over-wash; twice a day is enough.' },
            { step: 'Hydrate', desc: 'Oilier skin still needs water-based hydration to stay healthy.' },
            { step: 'Light Layers', desc: 'Stick to gels and light lotions.' }
        ]
    },
    'glow': {
        title: 'The Ultimate Natural Glow',
        subtitle: 'Natural Glow',
        description: 'Achieve that "lit from within" look. Focus on brightness, clarity, and uniform texture for skin that radiates health.',
        benefits: [
            { title: 'Luminous Tone', desc: 'Vitamin C and Niacinamide boost skin radiance.' },
            { title: 'Smooth Texture', desc: 'Uniform surface reflects light more beautifully.' },
            { title: 'Vibrant Health', desc: 'Removes signs of tiredness and dullness.' }
        ],
        usage: [
            { step: 'Vitamin C', desc: 'Best used in the morning for environmental protection.' },
            { step: 'Exfoliate', desc: 'Once a week to maintain that smooth, light-reflective surface.' },
            { step: 'Hydrate', desc: 'Plump skin glows better than dry skin.' }
        ]
    },
    'sensitive': {
        title: 'The Calm Skin Collection',
        subtitle: 'Sensitive Skin',
        description: 'Total peace for Reactive skin. Our sensitive-safe selection is fragrance-free, hypoallergenic, and designed to soothe on contact.',
        benefits: [
            { title: 'Hyper-Soothing', desc: 'Instantly reduces itching, burning, and redness.' },
            { title: 'Barrier Defense', desc: 'Strengthens weak skin to prevent future reactions.' },
            { title: 'Clean Formulas', desc: 'No harsh chemicals, alcohol, or synthetic scents.' }
        ],
        usage: [
            { step: 'Less is More', desc: 'Stick to a simple 3-step routine (Cleanse, Moisturize, Protect).' },
            { step: 'Patch Test', desc: 'Always test new products on your inner arm first.' },
            { step: 'Cool Water', desc: 'Avoid hot water which can trigger sensitivity.' }
        ]
    }
};
