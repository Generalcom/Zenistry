export interface Product {
  id: string
  slug: string
  name: string
  category: string
  price: number
  originalPrice?: number
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
    price: 280,
    originalPrice: 350,
    rating: 4.9,
    reviews: 127,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0018-4CMssr6L5guBainW035jzrdsi1wsZf.jpg',
    badge: 'Bestseller',
    description: 'Adaptogenic honey blend for stress relief and immunity',
    longDescription:
      'Our Ashwagandha & Black Seed Oil Infused Honey is a powerhouse wellness blend combining two of nature\'s most revered healing ingredients. Ashwagandha is an ancient adaptogen known to help the body manage stress and restore balance, while black seed oil has been used for centuries for its potent anti-inflammatory and immune-boosting properties. Each jar is handcrafted by Angela with pure raw honey sourced locally in South Africa.',
    benefits: [
      'Reduces stress and anxiety naturally',
      'Supports and strengthens the immune system',
      'Improves sustained energy levels',
      'Powerful anti-inflammatory properties',
    ],
    howToUse:
      'Take 1 teaspoon daily — in the morning on an empty stomach, stirred into warm tea, or straight from the spoon. Best taken consistently for optimal results. Not suitable for children under 1 year.',
  },
  {
    id: '2',
    slug: 'black-seed-oil-honey',
    name: 'Black Seed Oil Infused Honey',
    category: 'Wellness Honey',
    price: 250,
    rating: 4.8,
    reviews: 89,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0014-Ck81Pa4PLuMGrGjcuLDUSHMdRPfA3F.jpg',
    description: 'Pure honey infused with black seed oil for daily wellness support.',
    longDescription:
      'Pure raw honey carefully infused with cold-pressed black seed oil (Nigella sativa). Black seed oil has been treasured for thousands of years across many cultures for its remarkable healing properties — from supporting respiratory health to boosting immunity. Paired with the natural goodness of raw South African honey, this blend is both delicious and deeply nourishing for your body.',
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
    price: 320,
    rating: 4.9,
    reviews: 67,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0015-umyaVKdF9wtazQGpic6PevVDsNbBJT.jpg',
    badge: 'Premium',
    description: 'Ancient shilajit combined with healing honey for energy and vitality.',
    longDescription:
      'Shilajit is one of the most powerful substances in Ayurvedic medicine — a mineral-rich resin formed over centuries in Himalayan rock. Known as "the destroyer of weakness," shilajit is revered for restoring vitality, improving cognitive function, and supporting deep cellular energy. Carefully blended with pure raw honey by Angela for a truly premium wellness ritual.',
    benefits: [
      'Deep energy restoration at a cellular level',
      'Enhanced cognitive clarity and focus',
      'Over 85 trace minerals and fulvic acid',
      'Anti-aging and longevity support',
    ],
    howToUse:
      'Take 1 teaspoon daily with warm water or tea. Do not heat above 40°C to preserve the active compounds. Best taken in the morning for an energizing start to your day.',
  },
  {
    id: '4',
    slug: 'hydrating-face-oil',
    name: 'Hydrating Face Oil',
    category: 'Skincare',
    price: 350,
    rating: 5.0,
    reviews: 156,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0021-Y257qdrVojSAHkr0VCrhGIt0ZvrPoP.jpg',
    badge: 'New',
    description: 'Luxurious face oil for deep hydration and radiant glow.',
    longDescription:
      'A luxurious, lightweight face oil formulated to deliver deep hydration while leaving your skin visibly radiant and nourished. Crafted from a carefully selected blend of cold-pressed botanical oils rich in essential fatty acids and antioxidants. Despite its richness, the formula absorbs quickly and beautifully, making it suitable for all skin types — including oily and combination skin.',
    benefits: [
      'Deeply hydrates without heaviness or greasiness',
      'Visibly enhances your natural glow',
      'Helps soften the appearance of fine lines',
      'Suitable for all skin types including oily skin',
    ],
    howToUse:
      'Apply 3–5 drops to clean skin, morning and/or evening. Gently press into skin with your fingertips — never rub. Can be layered under your moisturiser or mixed into it for an extra boost.',
  },
  {
    id: '5',
    slug: 'two-phase-glow-serum',
    name: 'Two-Phase Glow Serum',
    category: 'Skincare',
    price: 420,
    rating: 4.9,
    reviews: 98,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0007-yUMsZ36ZVH1JvAzljQegV0ybRFpBHI.jpg',
    description: 'Dual-action serum for radiant, youthful skin with powerful antioxidants.',
    longDescription:
      'A sophisticated two-phase serum that combines the power of water-soluble active ingredients with nourishing botanical oils. Shake before each use to activate both phases — the water phase delivers brightening vitamins and actives, while the oil phase seals in moisture and glow. This is a transformative ritual for anyone seeking luminous, youthful-looking skin.',
    benefits: [
      'Dual-phase brightening technology',
      'Visible glow improvement within 7 days',
      'Powerful botanical antioxidant complex',
      'Deep moisture lock that lasts all day',
    ],
    howToUse:
      'Shake well before each use to blend the two phases. Apply 4–6 drops after cleansing and toning. Gently press into your face and neck. Follow with your moisturiser. Use morning and evening.',
  },
  {
    id: '6',
    slug: 'white-tea-bodywash',
    name: 'White Tea Bodywash',
    category: 'Body Care',
    price: 180,
    rating: 4.7,
    reviews: 203,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0022-H7TeEV7MkcozQwvxc3HUECypz6NO0k.jpg',
    badge: 'Popular',
    description: 'Gentle cleansing with white tea antioxidants. Perfect for daily use.',
    longDescription:
      'A silky, lather-rich body wash infused with white tea extract — one of the most antioxidant-rich botanicals in the world. White tea is minimally processed, preserving its potent polyphenols that protect skin from environmental stress while cleansing deeply. Every shower with this formula becomes a calming, sensory ritual. Gentle enough for sensitive skin, yet effective for daily use.',
    benefits: [
      'Antioxidant-rich deep cleansing',
      'Gentle and safe for sensitive skin',
      'Subtle, long-lasting natural fragrance',
      'Leaves skin feeling incredibly soft and smooth',
    ],
    howToUse:
      'Apply a generous amount to wet skin. Lather and massage in gentle circular motions. Rinse thoroughly with warm water. Safe for daily use.',
  },
  {
    id: '7',
    slug: 'white-tea-body-creme',
    name: 'White Tea Body Crème',
    category: 'Body Care',
    price: 220,
    rating: 4.8,
    reviews: 167,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0019-tLJDJgDcqWFVdZPDZ8Qp8WiNfXQ9a5.jpg',
    description: 'Rich moisturizing cream for silky smooth skin. Luxurious and nourishing.',
    longDescription:
      'A rich, velvety body cream formulated to deliver long-lasting moisture and restore your skin\'s natural softness and suppleness. Infused with white tea extract and nourishing botanical butters, this crème absorbs beautifully into skin without leaving a greasy residue. The perfect companion to the White Tea Bodywash — together they create the ultimate body care ritual.',
    benefits: [
      '24-hour deep moisture retention',
      'Non-greasy, fast-absorbing formula',
      'Visibly restores skin softness and elasticity',
      'White tea antioxidant protection',
    ],
    howToUse:
      'Apply generously to clean, dry skin after bathing or showering. Massage in gentle upward strokes until fully absorbed. Use morning and evening for best results. Pay extra attention to dry areas like elbows and knees.',
  },
  {
    id: '8',
    slug: 'essence-dreams-diffuser',
    name: 'Essence & Dreams Diffuser Blend',
    category: 'Aromatherapy',
    price: 190,
    rating: 4.8,
    reviews: 112,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0003-AiSVHyLDXwJeBGbzTFkZ7nTHAhydsW.jpg',
    description: 'Calming aromatherapy blend with essential oils for mental wellness.',
    longDescription:
      'A carefully curated blend of pure essential oils designed to create a sanctuary of calm wherever you are. Inspired by the Zenestry philosophy of mindful, intentional living, this diffuser blend combines grounding, uplifting, and calming aromatic notes to support mental wellness, deep focus, and restful sleep. A beautiful way to close your day or prepare for meditation.',
    benefits: [
      'Naturally reduces mental stress and tension',
      'Improves sleep quality and depth',
      'Uplifts mood and relieves anxiety',
      'Creates a peaceful, calming atmosphere',
    ],
    howToUse:
      'Add 5–10 drops to your diffuser with water. Diffuse for 30–60 minutes at a time. Can also be diluted with a carrier oil for a calming body massage or used as a pillow mist.',
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
  { label: 'Aromatherapy', slug: 'Aromatherapy' },
]
