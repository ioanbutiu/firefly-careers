import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';

const text =
  'We design and build the infrastructure that keeps communities safe — uniting hardware, software, and the people who care enough to get it right.';

function Word({ children, range, progress }: { children: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

export default function Mission() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.25'],
  });
  const words = text.split(' ');

  return (
    <section className="bg-white py-28 md:py-60 border-t border-hairline relative">
      <div className="container-page grid gap-10 md:grid-cols-[25%_1fr]">
        <div className="label-mono pt-3 mission-label">Our mission</div>
        <div ref={ref}>
          <p className="font-sans text-[28px] font-normal leading-[1] tracking-[-0.01em] md:text-[52px] text-balance">
            {words.map((w, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <Word key={i} range={[start, end]} progress={scrollYProgress}>
                  {w}
                </Word>
              );
            })}
          </p>
        </div>
      </div>
      <div className='absolute top-0 left-0 h-full w-6 border-r border-hairline' />
      <div className='absolute top-0 right-0 h-full w-6 border-l border-hairline' />
      <div className='absolute top-24 right-24 h-3 w-3 bg-accent' />
      <div className='absolute top-24 left-24 h-3 w-3 bg-accent' />
      <div className='absolute bottom-24 right-24 h-3 w-3 bg-accent' />
      <div className='absolute bottom-24 left-24 h-3 w-3 bg-accent' />
    </section>
  );
}
