const categories = {
    'cleansers': {
        title: 'The Art of Cleansing',
        subtitle: 'Cleansers',
        description: 'Every great skin routine starts here. Cleansing is essential for removing cumulative dirt, sebum, and sweat without stripping the natural barrier. Our curated selection of CeraVe and The Ordinary cleansers are designed for every skin type, from ultra-dry to oil-prone.',
        benefits: [
            { title: 'Removes Impurities', desc: 'Lifts away urban pollutants and microscopic dust that lead to breakouts.' },
            { title: 'Preps for Serums', desc: 'A clean canvas allows active treatments like Niacinamide to penetrate deeper.' },
            { title: 'Maintains Ph Balance', desc: 'Our pH-balanced formulas protect your acid mantle from disruption.' }
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
        description: 'Think of serums as the "heavy lifters" of your skincare. High-potency ingredients like Hyaluronic Acid and Niacinamide target specific concerns directly at the cellular level, delivering instant hydration and long-term repair.',
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
        description: 'Chemical exfoliation is the secret to a radiant complexion. Acids like Glycolic and Lactic gently dissolve the "glue" holding dead skin cells together, revealing the fresh, glowing skin underneath while treating acne and scarring.',
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
        subtitle: 'Retinoids & Anti-Aging',
        description: 'Retinoids are the most proven ingredient for reversing the signs of aging. They accelerate cell turnover, stimulate collagen production, and treat everything from fine lines to hormonal acne.',
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
    'moisturizers': {
        title: 'Total Barrier Protection',
        subtitle: 'Moisturizers',
        description: 'A moisturizer is like a protective shield for your skin. It seals in all your active serums and creates a barrier against environmental stressors while keeping the skin soft, supple, and healthy.',
        benefits: [
            { title: 'Seal in Actives', desc: 'Ensures your serums stay where they belong and work effectively.' },
            { title: 'Prevent TEWL', desc: 'Stops Trans-Epidermal Water Loss to keep skin from drying out.' },
            { title: 'Ceramide Repair', desc: 'CeraVe formulas restore the natural skin barrier for long-term health.' }
        ],
        usage: [
            { step: 'Timing', desc: 'Apply within 3 minutes of finishing your serums.' },
            { step: 'Coverage', desc: 'Don\'t forget your neck and décolletage.' },
            { step: 'Layering', desc: 'Use a lighter gel in the AM and a richer cream in the PM.' }
        ]
    },
    'face-oils': {
        title: 'Luxurious Face Oils',
        subtitle: 'Face Oils',
        description: 'Rich in antioxidants and essential fatty acids, face oils like Rose Hip and Squalane are the ultimate treat for dry or tired skin. They provide an intense glow and deep nourishment while strengthening the lipid barrier.',
        benefits: [
            { title: 'Intense Nourishment', desc: 'Instantly calms dry patches and irritations.' },
            { title: 'Glow from Within', desc: 'Provides that sought-after "dewy" look without being greasy.' },
            { title: 'Antioxidant Rich', desc: 'Protects against premature aging caused by free radicals.' }
        ],
        usage: [
            { step: 'Less is More', desc: 'Only 2-3 drops are needed for the entire face.' },
            { step: 'Final Step', desc: 'Apply as the absolute last step to lock everything in.' },
            { step: 'Mix It Up', desc: 'Can be mixed into your moisturizer for a richer texture.' }
        ]
    },
    'eye-care': {
        title: 'Specialized Eye Care',
        subtitle: 'Eye Care',
        description: 'The skin around your eyes is 10x thinner than the rest of your face. It needs specialized care that targets puffiness, dark circles, and "crow\'s feet" without causing irritation to the delicate ocular area.',
        benefits: [
            { title: 'Reduce Puffiness', desc: 'Caffeine-rich formulas instantly drain fluid retention.' },
            { title: 'Brightness', desc: 'Targets vascular congestion to lift dark shadows.' },
            { title: 'Fine Line Defense', desc: 'Peptides tighten the delicate skin to prevent sagging.' }
        ],
        usage: [
            { step: 'The Finger', desc: 'Always use your ring finger—it has the lightest touch.' },
            { step: 'Orbital Bone', desc: 'Tap along the bone, avoids getting product inside the eye.' },
            { step: 'Frequency', desc: 'Use morning and night for persistent dark circle treatment.' }
        ]
    },
    'targeted': {
        title: 'Targeted Specialty Care',
        subtitle: 'Targeted Care',
        description: 'From lash growth to hair density and lip treatments, our Targeted Care collection focuses on specific niche concerns that standard routines might miss. These are the tools for perfection.',
        benefits: [
            { title: 'Specific Solutions', desc: 'Engineered for high-performing results in small areas.' },
            { title: 'Lash Density', desc: 'Peptide serums that deliver longer, thicker-looking lashes in weeks.' },
            { title: 'Scalp Health', desc: 'Targeted hair serums that support follicular health' }
        ],
        usage: [
            { step: 'Precision', desc: 'Follow the specific instructions for each targeted tool.' },
            { step: 'Consistency', desc: 'Targeted treatments often require 4-6 weeks of daily use for results.' },
            { step: 'Focus', desc: 'Use only on the specific area of concern.' }
        ]
    },
    'bodycare': {
        title: 'Island-Wide Body Radiance',
        subtitle: 'Body Care',
        description: 'Skincare doesn\'t stop at the neck. Our body care collection uses the same high-quality ingredients as our face products to treat dryness, rough patches, and uneven body tone across your entire frame.',
        benefits: [
            { title: 'Total Body Health', desc: 'Clears back-acne and dry elbows with ease.' },
            { title: 'Continuous Hydration', desc: 'CeraVe\'s MVE technology releases hydration over 24 hours.' },
            { title: 'Smooth Texture', desc: 'Regular body moisturizing leads to noticeably softer skin.' }
        ],
        usage: [
            { step: 'Shower Time', desc: 'Apply immediately after toweling off while skin is still damp.' },
            { step: 'Trough Areas', desc: 'Be extra generous on knees, elbows, and heels.' },
            { step: 'Sun Protection', desc: 'Use SPF on exposed body parts to prevent sun spots.' }
        ]
    },
    'sunscreen': {
        title: 'The Ultimate Anti-Aging: Sunscreen',
        subtitle: 'Sun Protection (SPF)',
        description: 'Sunscreen is the non-negotiable step. 90% of skin aging is caused by UV damage. Protecting your skin from the intense Sri Lankan sun is essential not just for beauty, but for health.',
        benefits: [
            { title: 'Prevent DNA Damage', desc: 'Stops UV rays from breaking down your skin\'s genetic structure.' },
            { title: 'Stop Hyper-pigmentation', desc: 'Prevents dark spots from getting darker in the sun.' },
            { title: 'Anti-Aging', desc: 'The #1 way to prevent premature wrinkles and sagging.' }
        ],
        usage: [
            { step: 'Quantity', desc: 'Use the "two-finger rule" for just the face.' },
            { step: 'Reapply', desc: 'Reapply every 2 hours if you are outdoors.' },
            { step: 'Layering', desc: 'Last step of skincare, first step of makeup.' }
        ]
    }
};
