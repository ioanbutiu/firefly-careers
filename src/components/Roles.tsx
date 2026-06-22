import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { roles } from '../data';

const teams = ['All', 'Product', 'Sales', 'Engineering'];

export default function Roles() {
  const [team, setTeam] = useState('All');
  const filtered = useMemo(
    () => (team === 'All' ? roles : roles.filter((r) => r.team === team)),
    [team]
  );

  return (
    <section id="roles" className="bg-white py-24 md:py-32">
      <div className="container-page">
        <h2 className="display-h2 mb-12 text-center">
          Find the role that
          <br className="hidden md:block" /> works for you
        </h2>

        {/* tabs */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {teams.map((t) => (
            <button
              key={t}
              onClick={() => setTeam(t)}
              className={`relative rounded-md px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                team === t ? 'text-ink' : 'text-ink-subtle hover:text-ink-medium'
              }`}
            >
              {team === t && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 -z-10 rounded-md bg-surface-grey"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {t}
            </button>
          ))}
        </div>

        {/* list */}
        <ul className="border-t border-hairline">
          <AnimatePresence mode="popLayout">
            {filtered.map((r) => (
              <motion.li
                key={r.title}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                className="group border-b border-hairline"
              >
                <a href="#" className="relative flex items-center gap-6 py-6">
                  <span className="absolute inset-0 -z-10 origin-left scale-x-0 bg-surface-subtle transition-transform duration-300 group-hover:scale-x-100" />
                  <span className="w-28 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-subtle">
                    {r.team}
                  </span>
                  <span className="flex-1 font-sans text-xl tracking-[-0.01em] md:text-2xl">
                    {r.title}
                  </span>
                  <span className="hidden font-sans text-sm text-ink-medium md:block">
                    {r.location}
                  </span>
                  <span className="hidden font-sans text-sm text-ink-subtle lg:block">{r.type}</span>
                  <span className="inline-block translate-x-0 font-mono text-ink transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}
