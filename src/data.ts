export type Person = {
	src: string;
	name: string;
	role: string;
	// achievement predicate — rendered as "Name <achievement>"
	achievement: string;
};

// Studio portraits → hero carousel
export const people: Person[] = [
	{
		src: '/photos/photo-03.jpg',
		name: 'Emily',
		role: 'Hardware Engineer',
		achievement: 'built our first flight controller from scratch.',
	},
	{
		src: '/photos/photo-05.jpg',
		name: 'Priya',
		role: 'Operations Lead',
		achievement: 'scaled our operations across three launch sites.',
	},
	{
		src: '/photos/photo-07.jpg',
		name: 'Sofia',
		role: 'Product Design',
		achievement: 'shaped the product our customers rely on.',
	},
	{
		src: '/photos/photo-12.jpg',
		name: 'Marcus',
		role: 'Flight Software',
		achievement: 'wrote the autonomy stack that keeps us flying.',
	},
	{
		src: '/photos/photo-17.jpg',
		name: 'Daniel',
		role: 'Systems Engineer',
		achievement: 'tied every subsystem into one platform.',
	},
];

// Candids → draggable collage canvas. x/y are canvas coords (px), r = rotation deg.
export type CollageItem = {
	src: string;
	x: number;
	y: number;
	w: number;
	r: number;
	caption?: string;
	back?: string; // caption shown on flip
	location?: string; // location shown on flip
};

// non-portrait candids, cycled across the whole canvas
const candidPhotos = [1, 2, 4, 6, 8, 9, 10, 13, 14, 15, 16, 18, 19];
const candidCaptions = [
	'Onsite at the launch facility',
	'Demo day',
	'HQ, Salt Lake City',
	'Field testing',
	'New hire week',
	'Integration lab',
	'First tradeshow',
	'Awards night',
	'Team offsite',
	'Lab coats on',
	'Build review',
	'Group dinner',
	'Conference crew',
];
const candidLocations = [
	'Salt Lake City, UT',
	'HQ, Building A',
	'Launch Facility',
	'Field Site, NV',
	'Integration Lab',
	'Wendover, UT',
	'Mission Control',
	'The Floor',
];

// small seeded PRNG so the layout is stable across renders
function mulberry32(seed: number) {
	return function () {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// Scatter photos across the full pannable area, leaving a central safe-zone clear
// for the fixed text overlay. Uses Mitchell's best-candidate sampling: each new
// photo is the best of K random candidates — the one that sits farthest from all
// already-placed photos — which yields an even, organic spread with no clumps or
// wide empty patches and no visible grid.
function buildCollage(): CollageItem[] {
	const rng = mulberry32(8);
	const items: CollageItem[] = [];

	const AX = 1630; // half-width of the scatter area
	const AY = 970; // half-height of the scatter area
	const SX = 260; // half-width of the cleared center (text safe-zone)
	const SY = 150; // half-height of the cleared center
	const w = 260; // uniform size — only position & rotation vary
	const half = w / 2;
	const COUNT = 44; // how many photos to place
	const CANDIDATES = 12; // candidates evaluated per placement (higher = more even)

	const inSafeZone = (cx: number, cy: number) => Math.abs(cx) < SX + half && Math.abs(cy) < SY + half;

	const placed: { cx: number; cy: number }[] = [];
	let i = 0;
	let attempts = 0;
	while (placed.length < COUNT && attempts < COUNT * 200) {
		attempts++;
		let best: { cx: number; cy: number } | null = null;
		let bestDist = -1;
		for (let c = 0; c < CANDIDATES; c++) {
			const cx = (rng() * 2 - 1) * AX;
			const cy = (rng() * 2 - 1) * AY;
			if (inSafeZone(cx, cy)) continue;
			// squared distance to the nearest already-placed photo (∞ for the first)
			let nearest = Infinity;
			for (const p of placed) {
				const dx = p.cx - cx;
				const dy = p.cy - cy;
				nearest = Math.min(nearest, dx * dx + dy * dy);
			}
			if (nearest > bestDist) {
				bestDist = nearest;
				best = { cx, cy };
			}
		}
		if (!best) continue; // every candidate landed in the safe-zone — retry
		placed.push(best);
		items.push({
			src: `/photos/photo-${String(candidPhotos[i % candidPhotos.length]).padStart(2, '0')}.jpg`,
			x: Math.round(best.cx - half),
			y: Math.round(best.cy - half),
			w,
			r: Math.round((rng() - 0.5) * 16), // -8°..8°
			back: candidCaptions[i % candidCaptions.length],
			location: candidLocations[i % candidLocations.length],
		});
		i++;
	}
	return items;
}

export const collage: CollageItem[] = buildCollage();

// Stacked photo deck → "What is Firefly?" section
export type FaqItem = {
	n: string;
	heading: string;
	body: string;
	src: string;
};

export const faq: FaqItem[] = [
	{
		n: '01',
		heading: 'What is Firefly?',
		body: 'We design and build the autonomous infrastructure that keeps communities safe — from the silicon up to the airframe. One mission, end to end.',
		src: '/photos/photo-19.jpg',
	},
	{
		n: '02',
		heading: 'What are the people like?',
		body: 'Curious, low-ego, and relentlessly hands-on. The person who designed the board is often the one out in the field watching it fly.',
		src: '/photos/photo-16.jpg',
	},
	{
		n: '03',
		heading: 'What are our benefits?',
		body: 'Meaningful equity, full medical, and a budget to grow your craft. Plus the rare benefit of seeing your work matter in weeks, not years.',
		src: '/photos/photo-13.jpg',
	},
	{
		n: '04',
		heading: 'Why work with us?',
		body: 'Because the hardest, most important problems are the most fun to solve — and here you get to solve them alongside people you admire.',
		src: '/photos/photo-02.jpg',
	},
];

// Prefix every photo path with Vite's base URL so they resolve when the site is
// served from a sub-path (e.g. GitHub Pages: /firefly-careers/).
const withBase = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\/+/, '')}`;
for (const p of people) p.src = withBase(p.src);
for (const c of collage) c.src = withBase(c.src);
for (const f of faq) f.src = withBase(f.src);

export type Role = {
	team: string;
	title: string;
	location: string;
	type: string;
};

export const roles: Role[] = [
	{ team: 'Product', title: 'Senior Product Designer', location: 'Salt Lake City, UT', type: 'Full-time' },
	{ team: 'Product', title: 'Product Manager, Autonomy', location: 'Remote, US', type: 'Full-time' },
	{ team: 'Sales', title: 'Account Executive, Public Sector', location: 'Washington, DC', type: 'Full-time' },
	{ team: 'Sales', title: 'Solutions Engineer', location: 'Salt Lake City, UT', type: 'Full-time' },
	{ team: 'Engineering', title: 'Flight Software Engineer', location: 'Salt Lake City, UT', type: 'Full-time' },
	{ team: 'Engineering', title: 'Embedded Systems Engineer', location: 'Salt Lake City, UT', type: 'Full-time' },
	{ team: 'Engineering', title: 'Senior Mechanical Engineer', location: 'Salt Lake City, UT', type: 'Full-time' },
];
