import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { faq } from '../data';

export default function WhatIsFirefly() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-surface-subtle py-24 md:py-36">
      <div className="container-page grid items-center gap-14 md:grid-cols-2">
        {/* Left: heading list */}
        <div>
          <ul className="flex flex-col">
            {faq.map((item, i) => {
              const on = i === active;
              return (
                <li key={item.n}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group inline-flex items-baseline gap-5 py-3 text-left"
                  >
                    <span
                      className={`font-mono text-4xl transition-colors ${on ? 'text-ink-subtle' : 'text-ink-subtle/50'
                        }`}
                    >
                      {item.n}
                    </span>
                    <span className="relative">
                      <span
                        className={`font-sans text-4xl tracking-[-0.01em] transition-colors duration-300 font-medium ${on ? 'text-ink' : 'text-ink-subtle'
                          }`}
                      >
                        {item.heading}
                      </span>
                      {/* <motion.span
                        className="absolute -bottom-1 left-0 h-px bg-ink"
                        initial={false}
                        animate={{ width: on ? '100%' : '0%' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      /> */}
                    </span>
                    {/* <motion.span
                      animate={{ opacity: on ? 1 : 0, x: on ? 0 : -8 }}
                      className="font-mono text-ink"
                    >
                      →
                    </motion.span> */}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: stacked photo deck with the supporting text below it */}
        <div className="mx-auto w-full max-w-[600px]">
          <div className="relative aspect-[3/2] w-full">
            {faq.map((item, i) => {
              // depth = how far behind the active card this card sits (cyclic)
              const depth = (i - active + faq.length) % faq.length;
              const onTop = depth === 0;
              return (
                <motion.div
                  key={item.src}
                  onClick={onTop ? () => setActive((a) => (a + 1) % faq.length) : undefined}
                  className={`absolute inset-0 overflow-hidden rounded-none bg-white p-2 border border-hairline shadow-[0_30px_60px_-30px_rgba(4,16,26,0.25)] ${
                    onTop ? 'cursor-pointer' : ''
                  }`}
                  style={{ pointerEvents: onTop ? 'auto' : 'none' }}
                  animate={{
                    y: depth * 18,
                    x: depth * 14,
                    rotate: onTop ? 0 : (i % 2 === 0 ? -3 : 3) - depth,
                    scale: 1 - depth * 0.05,
                    zIndex: faq.length - depth,
                    opacity: depth > 2 ? 0 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                >
                  <img src={item.src} alt="" className="h-full w-full rounded-none object-cover" />
                  {/* <motion.div
                  animate={{ opacity: onTop ? 1 : 0 }}
                  className="absolute bottom-4 left-4 rounded-md bg-white/95 px-3 py-2 backdrop-blur"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
                    {item.n} / Firefly
                  </span>
                </motion.div> */}
                </motion.div>
              );
            })}
          </div>

          {/* Supporting text under the image */}
          <div className="relative mt-24 min-h-[96px] max-w-[60ch] text-balance">
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans text-lg leading-relaxed text-ink-medium"
              >
                {faq[active].body}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
