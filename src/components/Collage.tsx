import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { collage } from '../data';

// flip-back color schemes (using Figma/Tailwind tokens) — picked at random on flip
const FLIP_SCHEMES = [
  { bg: 'bg-ink', text: 'text-white', sub: 'text-white/55' },
  { bg: 'bg-accent', text: 'text-ink', sub: 'text-ink/55' },
  { bg: 'bg-surface-subtle', text: 'text-ink', sub: 'text-ink/55' },
  { bg: 'bg-ink-medium', text: 'text-white', sub: 'text-white/60' },
  { bg: 'bg-surface-grey', text: 'text-ink', sub: 'text-ink/55' },
];

const BASE_SHADOW = '0 4px 4px -2px rgba(4,4,4,0.25)';
const LIFT_SHADOW = '0 12px 16px -4px rgba(4,4,4,0.25)';

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function Collage() {
  const viewport = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [dragging, setDragging] = useState(false);

  // monotonic z-index so the last touched/hovered photo sits on top
  const zCounter = useRef(10);
  const nextZ = useCallback(() => (zCounter.current += 1), []);

  return (
    <section className="relative bg-white py-48 text-ink md:py-0 border-y border-hairline">
      {/* Draggable canvas */}
      <div
        ref={viewport}
        className="relative h-[100vh] min-h-[700px] w-full overflow-hidden"
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        {/* fixed dot grid background */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: 'radial-gradient(#d1d4d6 1.25px, transparent 1.25px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* the plane that drags — extends well beyond the canvas (past the max
            drag distance) so it always covers the viewport, even when thrown to a
            corner. Images live in a centered inner wrapper, behind the text. */}
        <motion.div
          className="absolute -left-[820px] -right-[820px] -top-[480px] -bottom-[480px] z-10"
          style={{ x, y }}
          drag
          dragConstraints={{ left: -700, right: 700, top: -360, bottom: 360 }}
          dragElastic={0.12}
          dragTransition={{ power: 0.25, timeConstant: 220, bounceStiffness: 260, bounceDamping: 36 }}
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
        >
          <div className="absolute left-1/2 top-1/2">
            {/* text lives on the canvas: centered, panning with it, beneath the
                photos so they can be dragged on top of it */}
            <div className="pointer-events-none absolute left-0 top-0 z-0 flex w-[50vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center px-6 text-center">
              <div className="label-mono mb-5">Life at Firefly</div>
              <h2 className="display-h2 max-w-[14ch] text-ink">Work alongside amazing people</h2>
              <p className="mt-5 max-w-md font-sans text-base text-ink-medium">
                Lorem ipsum dolor sit amet consectetur. Cras massa ut nunc malesuada odio. Faucibus
                est ullamcorper sodales.
              </p>
            </div>

            {collage.map((item) => (
              <FlipCard key={item.src} item={item} nextZ={nextZ} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FlipCard({ item, nextZ }: { item: (typeof collage)[number]; nextZ: () => number }) {
  const [flipped, setFlipped] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [z, setZ] = useState(1);
  // pick a flip-back color scheme once on load and keep it
  const [scheme] = useState(() => Math.floor(Math.random() * FLIP_SCHEMES.length));
  const ref = useRef<HTMLDivElement>(null);
  const toFront = () => setZ(nextZ());
  const s = FLIP_SCHEMES[scheme];

  // Stop the pointerdown from bubbling to the canvas (native, bubble phase) so the
  // photo drags on its own while the empty canvas still pans. Capture-phase /
  // React stopPropagation would also cancel this card's own drag gesture.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onDown = (e: PointerEvent) => {
      e.stopPropagation();
      setZ(nextZ());
      setPressed(true);
    };
    const onUp = () => setPressed(false);
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [nextZ]);

  return (
    <motion.div
      ref={ref}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        left: item.x,
        top: item.y,
        width: item.w,
        rotate: item.r,
        perspective: 1000,
        zIndex: z,
      }}
      drag
      dragMomentum={false}
      // lift on press/drag: card grows a touch
      animate={{ scale: pressed ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      onHoverStart={() => {
        setFlipped(true);
        toFront();
      }}
      onHoverEnd={() => setFlipped(false)}
    >
      <motion.div
        className="relative aspect-square w-full"
        style={{ transformStyle: 'preserve-3d' }}
        // flip to the solid back face on hover and keep it there while pressed/dragging.
        // shadow rides on this (rotating) element so it foreshortens with the card and
        // fades out at the edge-on point of the flip — no square outline left behind.
        animate={{
          rotateY: flipped ? 180 : 0,
          boxShadow: pressed ? LIFT_SHADOW : BASE_SHADOW,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        {/* front */}
        <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
          <img
            src={item.src}
            alt=""
            draggable={false}
            className="pointer-events-none h-full w-full select-none object-cover"
          />
        </div>
        {/* back */}
        <div
          className={`absolute inset-0 flex flex-col justify-between p-4 ${s.bg} ${s.text}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="font-sans text-lg font-medium leading-tight">{item.back}</span>
          <div
            className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] ${s.sub}`}
          >
            <PinIcon className="h-3.5 w-3.5 shrink-0" />
            <span>{item.location}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
