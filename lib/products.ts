export interface Product {
  id: string
  slug: string
  name: string
  category: string
  rating: number
  reviews: number
  image: string
  badge?: string
  description: string
  longDescription: string
  benefits: string[]
  howToUse: string
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'ashwagandha-black-seed-honey',
    name: 'Ashwagandha & Black Seed Oil Infused Honey',
    category: 'Wellness Honey',
    rating: 4.9,
    reviews: 127,
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0018-4CMssr6L5guBainW035jzrdsi1wsZf.jpg',
    badge: 'Bestseller',
    description: 'Adaptogenic honey blend for stress relief and immunity',
    longDescription:
      "Our Ashwagandha & Black Seed Oil Infused Honey is a powerhouse wellness blend combining two of nature's most revered healing ingredients. Ashwagandha is an ancient adaptogen known for easing stress, promoting rest, and balancing mood — best enjoyed in the evening for relaxation and deep sleep. Paired with black seed oil, used for centuries for its potent anti-inflammatory and immune-boosting properties. Each jar is handcrafted with pure raw honey.",
    benefits: [
      'Eases stress and promotes restful sleep',
      'Supports and strengthens the immune system',
      'Balances mood and promotes a sense of calm',
      'Powerful anti-inflammatory properties',
    ],
    howToUse:
      'Take 1 teaspoon daily — best enjoyed in the evening for relaxation and deep sleep. Stir into warm tea or take straight from the spoon. Not suitable for children under 1 year.',
  },
  {
    id: '2',
    slug: 'black-seed-oil-honey',
    name: 'Black Seed Oil Infused Honey',
    category: 'Wellness Honey',
    rating: 4.8,
    reviews: 89,
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0014-Ck81Pa4PLuMGrGjcuLDUSHMdRPfA3F.jpg',
    description: 'Pure honey infused with black seed oil for daily wellness support.',
    longDescription:
      'Pure raw honey carefully infused with cold-pressed black seed oil (Nigella sativa). Black seed oil has been treasured for thousands of years across many cultures for its remarkable healing properties — from supporting respiratory health to boosting immunity. Paired with the natural goodness of raw honey, this blend is both delicious and deeply nourishing for your body.',
    benefits: [
      'Immune system support',
      'Promotes respiratory health',
      'Rich in antioxidants',
      'Natural daily energy boost',
    ],
    howToUse:
      'Take 1 teaspoon daily. Mix into warm lemon water, herbal tea, or enjoy straight from the spoon. Safe for daily use by adults and children over 1 year.',
  },
  {
    id: '3',
    slug: 'shilajit-honey',
    name: 'Shilajit Infused Honey',
    category: 'Wellness Honey',
    rating: 4.9,
    reviews: 67,
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0015-umyaVKdF9wtazQGpic6PevVDsNbBJT.jpg',
    badge: 'Premium',
    description: 'A mineral-rich vitality booster for natural energy and stamina.',
    longDescription:
      'This raw honey infusion with shilajit delivers natural energy, supports stamina, and enhances resilience. Shilajit is one of the most powerful substances in Ayurvedic medicine — a mineral-rich resin formed over centuries in Himalayan rock. Known as "the destroyer of weakness," it is revered for restoring vitality and supporting deep cellular energy. Perfect as a morning spoonful or stirred into warm tea.',
    benefits: [
      'Delivers natural energy and supports stamina',
      'Enhances resilience and vitality',
      'Over 85 trace minerals and fulvic acid',
      'Anti-aging and longevity support',
    ],
    howToUse:
      'Take 1 teaspoon daily. Perfect as a morning spoonful or stirred into warm tea. Do not heat above 40°C to preserve active compounds.',
  },
  {
    id: '4',
    slug: 'hydrating-face-oil',
    name: 'Hydrating Face Oil',
    category: 'Skincare',
    rating: 5.0,
    reviews: 156,
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0021-Y257qdrVojSAHkr0VCrhGIt0ZvrPoP.jpg',
    badge: 'New',
    description:
      'A lightweight nourishing oil to deeply hydrate and support radiant, mature skin.',
    longDescription:
      'A lightweight yet nourishing oil blend to deeply hydrate, soften, and support radiant, mature skin — especially during winter. Crafted from a carefully selected blend of cold-pressed botanical oils rich in essential fatty acids, including Castor Oil, Jojoba, and Frankincense. Despite its richness, the formula absorbs quickly and beautifully, making it suitable for all skin types.',
    benefits: [
      'Deeply hydrates and softens skin',
      'Supports radiant, luminous glow',
      'Especially nourishing for mature and winter skin',
      'Lightweight and fast-absorbing',
    ],
    howToUse:
      'Apply 2–3 drops to clean, slightly damp skin. Massage gently into face and neck in upwards, circular motions. Use morning and night for a luminous glow.',
  },
  {
    id: '5',
    slug: 'radiance-glow-serum',
    name: 'Radiance Glow Serum',
    category: 'Skincare',
    rating: 4.9,
    reviews: 98,
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0007-yUMsZ36ZVH1JvAzljQegV0ybRFpBHI.jpg',
    description:
      'A bi-phase serum that hydrates, tones and illuminates for a nourishing glow.',
    longDescription:
      'This bi-phase serum blends natural oils and floral waters to hydrate, tone, and illuminate. Perfect for skin in need of a nourishing boost and radiant glow. The water phase delivers brightening actives including Aloe and Rose Water, while the oil phase with Squalane seals in lasting moisture. Separation may occur — shake gently before use to activate both phases.',
    benefits: [
      'Hydrates, tones and illuminates skin',
      'Aloe and Rose Water for a brightening boost',
      'Squalane for deep, lasting moisture',
      'Suitable for skin needing a nourishing restoration',
    ],
    howToUse:
      'Shake gently before use. Apply 2–3 drops to clean, slightly damp skin. Massage gently into face and neck. Follow with your moisturiser. Use morning and evening.',
  },
  {
    id: '6',
    slug: 'white-tea-bodywash',
    name: 'White Tea Bodywash',
    category: 'Body Care',
    rating: 4.7,
    reviews: 203,
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0022-H7TeEV7MkcozQwvxc3HUECypz6NO0k.jpg',
    badge: 'Popular',
    description:
      'A gentle, pH-balanced bodywash with uplifting citrus and soft florals.',
    longDescription:
      'A gentle, pH-balanced Bodywash infused with our signature White Tea blend — uplifting citrus, soft florals, and grounding botanicals. Leaves skin refreshed, lightly fragranced, and pampered like a spa ritual. Every shower becomes a calming, sensory experience. Gentle enough for sensitive skin, yet effective for daily use. Available in 500ml.',
    benefits: [
      'Gentle, pH-balanced formula',
      'Uplifting citrus and soft floral signature scent',
      'Leaves skin refreshed and lightly fragranced',
      'Spa-like ritual for daily use',
    ],
    howToUse:
      'Apply a generous amount to wet skin. Lather and massage in gentle circular motions. Rinse thoroughly with warm water. Safe for daily use.',
  },
  {
    id: '7',
    slug: 'nourishing-body-butter',
    name: 'Nourishing Body Butter',
    category: 'Body Care',
    rating: 4.8,
    reviews: 167,
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0019-tLJDJgDcqWFVdZPDZ8Qp8WiNfXQ9a5.jpg',
    description: "Rich, whipped hydration — winter skin's best friend.",
    longDescription:
      'Rich, whipped hydration crafted with Shea, Aloe, and botanical oils to deeply nourish and restore dry, sensitive skin. Melts into the skin for lasting moisture and a smooth, velvety finish. The perfect companion to the White Tea Bodywash — together they create the ultimate body care ritual. Available in Cashmere, Satin, and Silk scent variants.',
    benefits: [
      'Deep nourishment for dry and sensitive skin',
      'Rich in Shea Butter, Aloe, and botanical oils',
      'Melts into skin for a smooth, velvety finish',
      'Long-lasting moisture without greasiness',
    ],
    howToUse:
      'Apply generously to clean, dry skin after bathing or showering. Massage in gentle upward strokes until fully absorbed. Use morning and evening for best results.',
  },
  {
    id: '8',
    slug: 'essence-dreams-diffuser',
    name: 'Essence & Dreams Diffuser Blend',
    category: 'Aromatherapy',
    rating: 4.8,
    reviews: 112,
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0003-AiSVHyLDXwJeBGbzTFkZ7nTHAhydsW.jpg',
    description: 'Calming aromatherapy blend with essential oils for mental wellness.',
    longDescription:
      'A carefully curated blend of pure essential oils designed to create a sanctuary of calm wherever you are. Inspired by the ZENistry philosophy of mindful, intentional living, this diffuser blend combines grounding, uplifting, and calming aromatic notes to support mental wellness, deep focus, and restful sleep. A beautiful way to close your day or prepare for a moment of stillness.',
    benefits: [
      'Naturally reduces mental stress and tension',
      'Improves sleep quality and depth',
      'Uplifts mood and relieves anxiety',
      'Creates a peaceful, calming atmosphere',
    ],
    howToUse:
      'Add 5–10 drops to your diffuser with water. Diffuse for 30–60 minutes at a time. Can also be diluted with a carrier oil for a calming body massage or used as a pillow mist.',
  },
  {
    id: '9',
    slug: 'deep-tissue-pain-relief-blend',
    name: 'Deep Tissue Pain Relief Blend',
    category: 'Pain Relief',
    rating: 4.8,
    reviews: 0,
    image: '/placeholder.jpg',
    badge: 'New',
    description:
      'Targeted natural pain relief — powerful, non-toxic, fast-absorbing.',
    longDescription:
      'A powerful blend of high quality natural oils for targeted pain relief. Natural, non-toxic, and fast-absorbing. Key ingredients including Arnica Oil, Black Seed Oil, Ginger Oil, Mustard Oil, and Clove Oil work together to ease deep muscle and joint discomfort naturally. Available in 50ml.',
    benefits: [
      'Targeted relief for muscles and joints',
      'Natural, non-toxic and fast-absorbing formula',
      'Arnica and Ginger for deep tissue relief',
      'Clove and Mustard Oil for warming comfort',
    ],
    howToUse:
      'Apply onto affected areas as required. Massage gently into the skin until absorbed.',
  },
  {
    id: '10',
    slug: 'isintu-herbal-spray',
    name: 'Isintu Herbal Spray',
    category: 'Pain Relief',
    rating: 4.7,
    reviews: 0,
<<<<<<< HEAD
    image: '/IMG-20260331-WA0007.jpg',
    description: 'A natural African herbal spray for vitality and overall well-being.',
=======
    image: '/placeholder.jpg',
    description:
      'A natural African herbal spray for vitality and overall well-being.',
>>>>>>> b5715c2c817f3471087963f4dedcba118ecd89fd
    longDescription:
      "A natural blend of African herbs traditionally valued for supporting vitality and overall well-being. Wellness, Nature's Way. Formulated with African Wormwood, Helichrysum, and Sutherlandia — herbs rooted in African traditional medicine and revered for their restorative properties. Available in 100ml.",
    benefits: [
      'Supports vitality and overall wellness',
      'Rooted in African traditional herbal medicine',
      'Helichrysum for soothing and recovery',
      'Sutherlandia for resilience and strength',
    ],
    howToUse: 'Apply onto affected areas as required.',
  },
  {
    id: '11',
    slug: 'isintu-herbal-cream',
    name: 'Isintu Herbal Cream',
    category: 'Pain Relief',
    rating: 4.7,
    reviews: 0,
    image: '/placeholder.jpg',
    description:
      'African herbal cream for vitality and natural well-being support.',
    longDescription:
      "A natural cream blend of African herbs traditionally valued for supporting vitality and overall well-being. Wellness, Nature's Way. Formulated with African Wormwood, Helichrysum, and Sutherlandia — herbs rooted in African traditional medicine. A rich, easy-to-apply cream form of our beloved Isintu herbal formula. Available in 125g.",
    benefits: [
      'Supports vitality and overall wellness',
      'Rich cream for easy and effective application',
      'African Wormwood for natural relief',
      'Helichrysum and Sutherlandia for restoration',
    ],
    howToUse:
      'Apply onto affected areas as required. Massage gently into the skin.',
  },
  {
    id: '12',
    slug: 'magnesium-recovery-spray',
    name: 'Magnesium Recovery Spray',
    category: 'Pain Relief',
    rating: 4.9,
    reviews: 0,
    image: '/placeholder.jpg',
    badge: 'New',
    description:
      'Relieve, Restore, Recharge — eases muscles, cramps, and promotes restful sleep.',
    longDescription:
      'A magnesium-enriched spray infused with essential oils to ease stiff muscles, cramps, and promote relaxation and support restful sleep. Relieve, Restore, Recharge. Magnesium is an essential mineral that many people are deficient in — transdermal application through the skin is one of the most effective ways to replenish levels. Available in 100ml.',
    benefits: [
      'Eases stiff muscles and cramps naturally',
      'Promotes relaxation and restful sleep',
      'Transdermal magnesium for effective absorption',
      'Infused with calming essential oils',
    ],
    howToUse:
      'Apply onto affected areas as required. Spray directly onto skin and massage in gently. Ideal for use before bed.',
  },
  {
    id: '13',
    slug: 'natural-anti-perspirant',
    name: 'Natural Anti-Perspirant',
    category: 'Body Care',
    rating: 4.6,
    reviews: 0,
    image: '/placeholder.jpg',
    description: 'Pure protection, naturally — without synthetic chemicals.',
    longDescription:
      'Crafted with all natural ingredients to neutralize odour and keep you fresh — without synthetic chemicals. Lightly scented with essential oils for a clean, natural finish. Made with Shea Butter, Coconut Oil, and Bicarbonate of Soda to gently protect and nourish your underarms at the same time. A conscious switch for everyday freshness.',
    benefits: [
      'Free from synthetic chemicals and aluminium',
      'Neutralises odour naturally and effectively',
      'Shea Butter and Coconut Oil nourish skin',
      'Lightly scented with essential oils',
    ],
    howToUse:
      'Apply a small amount to clean, dry underarms. Allow to absorb before dressing. Use daily as needed.',
  },
  {
    id: '14',
    slug: 'zenistry-beard-cream',
    name: 'ZENistry Beard Cream',
    category: "Men's Grooming",
    rating: 4.8,
    reviews: 0,
    image: '/IMG-20260331-WA0008.jpg',
    badge: 'New',
    description:
      'Nourish. Style. Refine — a lightweight conditioning cream for every beard.',
    longDescription:
      'A lightweight, conditioning cream crafted with Shea Butter, Jojoba, Lanolin, and Squalane to soften and strengthen your beard without greasiness. Infused with our signature essential oil blend including Cedarwood and Bergamot for a warm, grounding scent with a fresh lift. Nourish. Style. Refine — the complete grooming ritual for the intentional man.',
    benefits: [
      'Softens and strengthens beard hair',
      'Lightweight, non-greasy conditioning formula',
      'Jojoba and Squalane for deep nourishment',
      'Warm Cedarwood and Bergamot signature scent',
    ],
    howToUse:
      'Apply a small amount to clean, dry or slightly damp beard. Work through the beard with your fingers from root to tip. Style as desired.',
  },
  {
    id: '15',
    slug: 'ashwagandha-infused-honey',
    name: 'Ashwagandha Infused Honey',
    category: 'Wellness Honey',
    rating: 4.8,
    reviews: 0,
<<<<<<< HEAD
    image: '/IMG-20260331-WA0010.jpg',
    description: 'A calming adaptogen blend for stress relief, rest, and mood balance.',
=======
    image: '/placeholder.jpg',
    description:
      'A calming adaptogen blend for stress relief, rest, and mood balance.',
>>>>>>> b5715c2c817f3471087963f4dedcba118ecd89fd
    longDescription:
      'Known for easing stress, promoting rest, and balancing mood. This raw honey infusion with Ashwagandha — a celebrated Ayurvedic adaptogen — is best enjoyed in the evening for relaxation and deep sleep. Simple, intentional, and deeply restorative. Available in approx 180g.',
    benefits: [
      'Eases stress and calms the nervous system',
      'Promotes restful, deep sleep',
      'Balances mood and supports emotional wellbeing',
      'Ashwagandha is a clinically studied adaptogen',
    ],
    howToUse:
      'Take 1 teaspoon in the evening. Best enjoyed stirred into warm herbal tea or taken straight from the spoon before bed. Not suitable for children under 1 year.',
  },
]

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category)
}

export const categories = [
  { label: 'Wellness Honey', slug: 'Wellness+Honey' },
  { label: 'Skincare', slug: 'Skincare' },
  { label: 'Body Care', slug: 'Body+Care' },
  { label: 'Pain Relief', slug: 'Pain+Relief' },
  { label: "Men's Grooming", slug: "Men%27s+Grooming" },
  { label: 'Aromatherapy', slug: 'Aromatherapy' },
]
