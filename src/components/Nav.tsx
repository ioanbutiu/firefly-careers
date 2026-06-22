import { motion } from 'motion/react';

const links = ['Mission', 'Technology', 'Newsroom', 'Careers'];

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="container-page flex items-center justify-between py-5">
        <a href="#" className="flex items-center gap-2 font-sans text-lg font-semibold tracking-tight">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-accent">✦</span>
          Firefly
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="font-sans text-sm text-ink-medium transition-colors hover:text-ink"
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a href="#" className="hidden font-sans text-sm text-ink-medium hover:text-ink sm:block">
            Log in
          </a>
          <motion.a
            href="#roles"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-accent"
          >
            We&apos;re hiring
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
