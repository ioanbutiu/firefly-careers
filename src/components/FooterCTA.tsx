import { motion } from 'motion/react';

const cols = [
  { h: 'Company', items: ['Mission', 'Technology', 'Newsroom', 'Contact'] },
  { h: 'Careers', items: ['Open roles', 'Life at Firefly', 'Benefits', 'Interns'] },
  { h: 'Legal', items: ['Privacy', 'Terms', 'Security'] },
];

export default function FooterCTA() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-page py-24 md:py-32">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="display-h2 max-w-[12ch] text-white"
          >
            Make safety your advantage.
          </motion.h2>
          <motion.a
            href="#roles"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-accent"
          >
            See open roles
          </motion.a>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-white/10 pt-12 md:grid-cols-4">
          <div className="flex items-center gap-2 font-sans text-lg font-semibold">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-ink">✦</span>
            Firefly
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div className="label-mono mb-4 text-white/40">{c.h}</div>
              <ul className="space-y-2">
                {c.items.map((i) => (
                  <li key={i}>
                    <a href="#" className="font-sans text-sm text-white/70 transition-colors hover:text-white">
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 font-mono text-[11px] uppercase tracking-[0.18em] text-white/30">
          © {new Date().getFullYear()} Firefly — Motion demo
        </div>
      </div>
    </footer>
  );
}
