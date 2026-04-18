export function PhilosophyBar() {
  return (
    <section className="bg-background border-y border-border/60">
      {/* Tagline */}
      <div className="py-8 text-center">
        <p
          className="font-serif text-foreground/70"
          style={{ fontSize: '1.1rem', letterSpacing: '0.12em' }}
        >
          Natural &nbsp;&nbsp;|&nbsp;&nbsp; Mindful &nbsp;&nbsp;|&nbsp;&nbsp; Restorative
        </p>
      </div>

      {/* Three pillars */}
      <div className="border-t border-border/40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-border/40">

            {/* Pure Ingredients */}
            <div className="flex flex-col items-center gap-4 py-10 px-4">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
                xmlns="http://www.w3.org/2000/svg" className="text-foreground/45"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Flask / beaker */}
                <path d="M18 8 L18 22 L10 38 Q9 40 11 40 L37 40 Q39 40 38 38 L30 22 L30 8" />
                <line x1="16" y1="8" x2="32" y2="8" />
                <path d="M14 30 Q18 26 24 28 Q30 30 34 28" fill="none" />
                <circle cx="20" cy="34" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="28" cy="32" r="1" fill="currentColor" stroke="none" />
              </svg>
              <p className="text-foreground/60 font-sans uppercase text-center"
                style={{ fontSize: '0.62rem', letterSpacing: '0.22em' }}>
                Pure Ingredients
              </p>
            </div>

            {/* Holistic Wellness */}
            <div className="flex flex-col items-center gap-4 py-10 px-4">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
                xmlns="http://www.w3.org/2000/svg" className="text-foreground/45"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Open hand holding leaf */}
                <path d="M12 30 C12 30 10 24 14 20 C18 16 22 20 22 20 L22 10 C22 8.5 23 7.5 24.5 7.5 C26 7.5 27 8.5 27 10 L27 18 C27 18 28 17 29.5 17 C31 17 32 18 32 19.5 L32 20 C32 20 33 19.5 34.5 19.5 C36 19.5 36.5 20.5 36.5 22 L36.5 28 C36.5 34 32 40 26 40 L20 40 C16 40 12 36 12 32 Z" />
                <path d="M26 10 C26 10 32 6 36 8 C36 8 34 14 28 14 L26 10 Z" />
                <path d="M26 10 L24 20" />
              </svg>
              <p className="text-foreground/60 font-sans uppercase text-center"
                style={{ fontSize: '0.62rem', letterSpacing: '0.22em' }}>
                Holistic Wellness
              </p>
            </div>

            {/* Crafted with Care */}
            <div className="flex flex-col items-center gap-4 py-10 px-4">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
                xmlns="http://www.w3.org/2000/svg" className="text-foreground/45"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Sprouting plant */}
                <path d="M14 38 C14 38 12 30 16 26 C20 22 24 26 24 26 L24 38" />
                <path d="M24 32 C24 32 30 26 34 28 C34 28 32 34 26 34 Z" />
                <path d="M24 28 C24 28 20 22 22 18 C24 14 28 16 28 20 C28 24 24 28 24 28 Z" />
                <path d="M36 14 L37 11 L38 14 L41 15 L38 16 L37 19 L36 16 L33 15 Z" />
              </svg>
              <p className="text-foreground/60 font-sans uppercase text-center"
                style={{ fontSize: '0.62rem', letterSpacing: '0.22em' }}>
                Crafted with Care
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
