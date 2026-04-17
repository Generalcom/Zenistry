const pillars = [
  { icon: '✦', text: 'Pure Ingredients' },
  { icon: '◈', text: 'Holistic Wellness' },
  { icon: '✦', text: 'Crafted with Care' },
  { icon: '◈', text: 'SA Made' },
  { icon: '✦', text: 'Ethically Sourced' },
  { icon: '◈', text: 'No Harmful Chemicals' },
  { icon: '✦', text: 'Mindful Beauty' },
  { icon: '◈', text: 'Natural Formulas' },
]

const marqueeItems = [...pillars, ...pillars]

export function PhilosophyBar() {
  return (
    <div className="border-y border-border/60 overflow-hidden bg-secondary/40">
      {/* Tagline row */}
      <div className="py-5 text-center border-b border-border/40">
        <p
          className="font-serif text-foreground/60 tracking-[0.28em] uppercase"
          style={{ fontSize: '0.78rem', letterSpacing: '0.28em' }}
        >
          Natural &nbsp;&nbsp;·&nbsp;&nbsp; Mindful &nbsp;&nbsp;·&nbsp;&nbsp; Restorative
        </p>
      </div>

      {/* Marquee */}
      <div className="relative py-4 flex overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, oklch(0.96 0.010 80), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, oklch(0.96 0.010 80), transparent)' }} />

        <div className="marquee-inner">
          {marqueeItems.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-8 whitespace-nowrap"
            >
              <span
                className="text-primary/50 text-sm"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span
                className="text-foreground/55 font-medium"
                style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}
              >
                {item.text}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
