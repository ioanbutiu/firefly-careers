import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import { people } from '../data';

const COUNT = people.length;
const COPIES = 5; // enough duplicates that a single flick never runs out of content
const HOME = 2; // keep the active card parked in the middle copy

// the whole track is built from COPIES back-to-back copies of `people`
const track = Array.from({ length: COPIES }, (_, c) =>
  people.map((p, i) => ({ ...p, key: `${c}-${i}`, idx: c * COUNT + i })),
).flat();

const SETTLE = { type: 'spring', stiffness: 300, damping: 40, restDelta: 0.4 } as const;

export default function Hero() {
  const x = useMotionValue(0);
  const [itemW, setItemW] = useState(0);
  const [paused, setPaused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  const setW = itemW * COUNT;

  // measure one item's full width (incl. spacing) and keep it in sync on resize
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setItemW(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // (re)center on the active card whenever the measurement changes
  useEffect(() => {
    if (!itemW) return;
    x.jump(-(HOME * COUNT + indexRef.current) * itemW);
  }, [itemW, x]);

  // animate to a snap point, then invisibly normalize back into the middle copy
  const settle = (target: number) => {
    if (!setW) return;
    const controls = animate(x, target, SETTLE);
    controls.then(() => {
      const v = x.get();
      const home = -HOME * setW;
      const nv = v - Math.round((v - home) / setW) * setW; // nearest equivalent in middle copy
      x.jump(nv);
      indexRef.current = ((Math.round(-nv / itemW) % COUNT) + COUNT) % COUNT;
    });
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (!itemW) return;
    const projected = x.get() + info.velocity.x * 0.12; // flick: throw further with velocity
    settle(Math.round(projected / itemW) * itemW);
  };

  // gentle auto-advance, paused on hover / interaction
  useEffect(() => {
    if (paused || !itemW) return;
    const t = setInterval(() => {
      settle(Math.round(x.get() / itemW) * itemW - itemW);
    }, 3500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, itemW]);

  return (
    <section className="relative overflow-hidden bg-white pt-36 pb-20 md:pt-20">
      <div className="container-page flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="label-mono mb-7"
        >
          Careers
        </motion.div>

        <h1 className="display-h1 w-full">
          {'Help build the infrastructure for a safer America'
            .split(' ')
            .map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="mr-[0.22em] inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.15 + i * 0.05,
                  }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
        </h1>

        <motion.a
          href="#roles"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="btn-accent mt-9"
        >
          Explore open roles
        </motion.a>
      </div>

      {/* Carousel */}
      <div
        className="relative mt-0 h-[460px] w-full overflow-hidden md:h-[680px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="absolute bottom-0 left-1/2 flex cursor-grab items-end active:cursor-grabbing"
          style={{ x, marginLeft: itemW ? -itemW / 2 : 0, opacity: itemW ? 1 : 0 }}
          drag="x"
          dragMomentum={false}
          onPointerDown={() => setPaused(true)}
          onDragEnd={onDragEnd}
        >
          {track.map((p) => (
            <Card
              key={p.key}
              person={p}
              idx={p.idx}
              x={x}
              itemW={itemW || 1}
              innerRef={p.idx === 0 ? cardRef : undefined}
            />
          ))}
        </motion.div>

        {/* edge gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[8vw] bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[8vw] bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}

function Card({
  person,
  idx,
  x,
  itemW,
  innerRef,
}: {
  person: (typeof track)[number];
  idx: number;
  x: ReturnType<typeof useMotionValue<number>>;
  itemW: number;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  // distance of this card's centre from the viewport centre (0 = centered)
  const distance = useTransform(x, (v) => idx * itemW + v);
  // center: 1 · immediate neighbours: 0.9 · next out: 0.7
  const scale = useTransform(
    distance,
    [-2 * itemW, -itemW, 0, itemW, 2 * itemW],
    [0.7, 0.9, 1, 0.9, 0.7],
  );
  // push the 0.9 neighbours out (more room next to center) while keeping the
  // outer 0.7 cards pulled in close to them
  const pullX = useTransform(
    distance,
    [-2 * itemW, -itemW, 0, itemW, 2 * itemW],
    [itemW * 0.09, itemW * -0.025, 0, itemW * 0.025, itemW * -0.09],
  );
  // active card "zooms out" the person (img at 1.0) while the others stay zoomed
  // in a touch — leaves headroom for the text on the centered card
  const imgScale = useTransform(distance, [-itemW, 0, itemW], [1.08, 1, 1.08]);
  // text fades in and drops down into place as the card reaches center
  const labelOpacity = useTransform(distance, [-itemW * 0.55, 0, itemW * 0.55], [0, 1, 0]);
  const labelY = useTransform(distance, [-itemW * 0.55, 0, itemW * 0.55], [-0, 0, -0]);

  return (
    <div ref={innerRef} className="shrink-0 px-3">
      <motion.div
        style={{ scale, x: pullX, transformOrigin: 'bottom center' }}
        className="relative aspect-[2/3] w-[clamp(220px,25.93vw,440px)] overflow-hidden rounded-[24px] bg-surface-grey"
      >
        <motion.img
          src={person.src}
          alt={person.name}
          draggable={false}
          style={{ scale: imgScale }}
          className="pointer-events-none h-full w-full select-none object-cover"
        />

        <motion.div
          style={{ opacity: labelOpacity, y: labelY }}
          className="absolute inset-x-5 top-5 text-left"
        >
          <p className="font-sans text-[28px] font-medium leading-tight text-ink-medium">
            <span className="text-ink">{person.name}</span> {person.achievement}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
