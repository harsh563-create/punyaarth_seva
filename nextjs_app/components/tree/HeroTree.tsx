/* Deterministic pseudo-random so SSR/hydration and re-renders are stable */
function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const PALETTE = {
  deep: ['#1d4423', '#235029', '#2a5c30', '#1a3d20'],
  mid: ['#2f6b38', '#38793f', '#418547', '#356f3b'],
  light: ['#4f9a52', '#5ca85c', '#6ab466', '#57a257'],
  highlight: ['#8ccb7e', '#a3d892', '#bce4a6'],
  gold: ['#d9a94a', '#e6bd63'],
};

type ClusterSpec = { x: number; y: number; r: number };

function Leaf({ x, y, angle, scale, color, opacity }: {
  x: number; y: number; angle: number; scale: number; color: string; opacity: number;
}) {
  return (
    <path
      d="M 0 0 C 4 -6, 12 -9, 19 -5 C 21 -3.5, 20 -0.5, 16 1.5 C 10 4.5, 3.5 3, 0 0 Z"
      fill={color}
      opacity={opacity}
      transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${scale.toFixed(2)})`}
    />
  );
}

/**
 * A blob of leaves with three internal depth passes:
 * shadow pass (offset down-right), body pass, highlight pass.
 */
function LeafCluster({ cx, cy, r, seed, tone, swayClass }: {
  cx: number; cy: number; r: number; seed: number;
  tone: 'deep' | 'mid' | 'light'; swayClass?: string;
}) {
  const count = Math.round(r / 2.4);
  const shadowLeaves: React.ReactNode[] = [];
  const bodyLeaves: React.ReactNode[] = [];
  const hiLeaves: React.ReactNode[] = [];

  for (let i = 0; i < count; i++) {
    const a = i * 2.39996 + rand(seed + i) * 0.55;
    const dist = r * (0.15 + Math.sqrt(rand(seed + i * 3.7)) * 0.85);
    const lx = Math.cos(a) * dist * 1.08;
    const ly = Math.sin(a) * dist * 0.78;
    const angle = ((a * 180) / Math.PI) % 360 + (rand(seed + i * 9.1) - 0.5) * 70;
    const sc = 0.65 + rand(seed + i * 5.3) * 0.75;

    // Shadow pass — darker leaves peeking below the blob edge
    if (i % 2 === 0) {
      const c = PALETTE.deep[(i + seed) % PALETTE.deep.length];
      shadowLeaves.push(
        <Leaf key={`s${i}`} x={lx + 3} y={ly + 5} angle={angle + 14} scale={sc} color={c} opacity={0.9} />,
      );
    }
    // Body pass
    const bodyTone =
      dist > r * 0.62 ? PALETTE[tone === 'light' ? 'mid' : 'deep'] : PALETTE[tone];
    const bc = bodyTone[(i * 3 + seed) % bodyTone.length];
    bodyLeaves.push(<Leaf key={`b${i}`} x={lx} y={ly} angle={angle} scale={sc} color={bc} opacity={0.95} />);
    // Highlight pass — sun-kissed leaves on top
    if (i % 4 === 0) {
      const gold = i % 11 === 0;
      const hc = gold ? PALETTE.gold[i % 2] : PALETTE.highlight[(i + seed * 2) % PALETTE.highlight.length];
      hiLeaves.push(
        <Leaf key={`h${i}`} x={lx * 0.82} y={ly * 0.72 - 2} angle={angle - 18} scale={sc * 0.72}
          color={hc} opacity={gold ? 0.75 : 0.85} />,
      );
    }
  }

  return (
    <g
      className={swayClass}
      style={{
        animationDelay: `${(seed % 40) / 10}s`,
        animationDuration: `${5 + (seed % 30) / 10}s`,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      <g transform={`translate(${cx},${cy})`}>
        <g>{shadowLeaves}</g>
        <g>{bodyLeaves}</g>
        <g>{hiLeaves}</g>
      </g>
    </g>
  );
}

function SittingBird({ x, y, scale = 1, flip = false, delay = 0 }: { x: number; y: number; scale?: number; flip?: boolean; delay?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -scale : scale},${scale})`} className="tree-bird-sit" style={{ animationDelay: `${delay}s` }}>
      {/* tail */}
      <path d="M 2 2 L 15 -3 L 13 3 Z" fill="#3d2f26" />
      {/* body */}
      <path d="M -8 0 C -9 -7, -1 -11, 4 -7 C 7 -5, 8 -1, 6 2 C 3 4, -5 4, -8 0 Z" fill="#4a382c" />
      {/* head */}
      <circle cx="-7.5" cy="-6.5" r="3.6" fill="#4a382c" />
      {/* beak */}
      <path d="M -11 -6.8 L -14.5 -5.8 L -11 -4.9 Z" fill="#e0a23e" />
      {/* eye */}
      <circle cx="-8" cy="-7.2" r="0.7" fill="#171310" />
      {/* wing hint */}
      <path d="M -2 -4 C 1 -6, 4 -5, 5 -2 C 2 -1, -1 -2, -2 -4 Z" fill="#3a2b22" opacity="0.85" />
    </g>
  );
}

function FlyingBird({ delay, dur, from, to }: { delay: number; dur: number; from: { x: number; y: number }; to: { x: number; y: number } }) {
  return (
    <g className="tree-bird-fly" style={{
      animationDelay: `${delay}s`,
      animationDuration: `${dur}s`,
      '--fly-from-x': `${from.x}px`,
      '--fly-from-y': `${from.y}px`,
      '--fly-to-x': `${to.x}px`,
      '--fly-to-y': `${to.y}px`,
    } as React.CSSProperties}>
      <g className="tree-bird-flap">
        <path d="M -11 0 Q -5 -7 0 -1 Q 5 -7 11 0" fill="none" stroke="#4a3d33" strokeWidth="2.6" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ---------------- static scene data ---------------- */

const BACK_CLUSTERS: ClusterSpec[] = [
  { x: 250, y: 380, r: 92 }, { x: 400, y: 260, r: 108 }, { x: 560, y: 240, r: 102 },
  { x: 690, y: 340, r: 92 }, { x: 742, y: 448, r: 76 }, { x: 180, y: 478, r: 82 },
  { x: 330, y: 158, r: 78 }, { x: 500, y: 128, r: 68 }, { x: 636, y: 152, r: 66 },
  { x: 772, y: 420, r: 58 }, { x: 142, y: 398, r: 60 }, { x: 600, y: 350, r: 88 },
];

const MID_CLUSTERS: ClusterSpec[] = [
  { x: 300, y: 320, r: 84 }, { x: 430, y: 208, r: 88 }, { x: 580, y: 200, r: 84 },
  { x: 682, y: 290, r: 78 }, { x: 220, y: 420, r: 74 }, { x: 700, y: 400, r: 66 },
  { x: 360, y: 150, r: 66 }, { x: 520, y: 118, r: 58 }, { x: 268, y: 248, r: 68 },
  { x: 622, y: 128, r: 54 }, { x: 750, y: 350, r: 52 }, { x: 170, y: 330, r: 56 },
];

const FRONT_CLUSTERS: ClusterSpec[] = [
  { x: 340, y: 280, r: 70 }, { x: 480, y: 190, r: 76 }, { x: 600, y: 258, r: 64 },
  { x: 258, y: 360, r: 62 }, { x: 660, y: 348, r: 54 }, { x: 420, y: 122, r: 54 },
  { x: 550, y: 92, r: 44 }, { x: 308, y: 202, r: 52 }, { x: 720, y: 300, r: 44 },
  { x: 198, y: 282, r: 44 }, { x: 498, y: 300, r: 60 }, { x: 380, y: 92, r: 40 },
];

const FALLING_LEAVES = [
  { x: 320, y: 300, dur: 11, delay: 0, color: '#4f9a52', scale: 1 },
  { x: 520, y: 210, dur: 13, delay: 2.5, color: '#d9a94a', scale: 0.9 },
  { x: 630, y: 330, dur: 12, delay: 5, color: '#38793f', scale: 1.05 },
  { x: 430, y: 160, dur: 14, delay: 8, color: '#6ab466', scale: 0.85 },
  { x: 250, y: 400, dur: 12.5, delay: 10.5, color: '#2f6b38', scale: 1 },
  { x: 700, y: 370, dur: 13.5, delay: 6.5, color: '#5ca85c', scale: 0.95 },
];

export default function HeroTree() {
  return (
    <svg viewBox="0 0 900 950" fill="none" role="img" aria-label="Illustration of a large flourishing tree with birds">
      <defs>
        <linearGradient id="ht-trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a2312" />
          <stop offset="20%" stopColor="#63401f" />
          <stop offset="46%" stopColor="#8f6236" />
          <stop offset="54%" stopColor="#9c6f41" />
          <stop offset="66%" stopColor="#7a5230" />
          <stop offset="86%" stopColor="#54371e" />
          <stop offset="100%" stopColor="#33200e" />
        </linearGradient>
        <linearGradient id="ht-branch" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#4c2f17" />
          <stop offset="100%" stopColor="#5f3c1f" />
        </linearGradient>
        <radialGradient id="ht-sun" cx="0.32" cy="0.16" r="0.5">
          <stop offset="0%" stopColor="#ffdf8e" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#ffe9b0" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#fff4d6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ht-mound-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5d9459" />
          <stop offset="100%" stopColor="#47794a" />
        </linearGradient>
        <linearGradient id="ht-mound-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f7c43" />
          <stop offset="100%" stopColor="#2b5a31" />
        </linearGradient>
        <radialGradient id="ht-canopy-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#16351c" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#16351c" stopOpacity="0" />
        </radialGradient>
        <filter id="ht-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="ht-softer" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="ht-haze" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>

      {/* warm sun glow behind the canopy */}
      <rect x="0" y="0" width="900" height="950" fill="url(#ht-sun)" className="tree-sun-glow" />

      {/* distant flying birds */}
      <FlyingBird delay={0} dur={34} from={{ x: 80, y: 190 }} to={{ x: 980, y: 90 }} />
      <FlyingBird delay={17} dur={40} from={{ x: -60, y: 130 }} to={{ x: 960, y: 210 }} />

      {/* soft shadow cast by canopy on the ground */}
      <ellipse cx="480" cy="888" rx="310" ry="46" fill="url(#ht-canopy-shadow)" filter="url(#ht-softer)" />

      {/* ===== BACK CANOPY (static: sits under a blur filter, animating inside
             a filtered group would force per-frame re-rasterization) ===== */}
      <g filter="url(#ht-haze)">
        {BACK_CLUSTERS.map((c, i) => (
          <LeafCluster key={`bk${i}`} cx={c.x} cy={c.y} r={c.r} seed={i * 7 + 1} tone="deep" />
        ))}
      </g>

      {/* ===== BRANCHES (between back and mid foliage so limbs vanish into leaves) ===== */}
      <g stroke="url(#ht-branch)" fill="none" strokeLinecap="round">
        {/* main left limb */}
        <path d="M 448 505 C 402 462, 344 428, 288 392" strokeWidth="24" />
        <path d="M 288 392 C 250 368, 214 348, 182 328" strokeWidth="14" />
        <path d="M 182 328 C 158 314, 138 300, 118 284" strokeWidth="8" />
        <path d="M 288 392 C 272 366, 258 340, 250 306" strokeWidth="8" />
        {/* main right limb */}
        <path d="M 472 500 C 522 456, 580 424, 646 388" strokeWidth="22" />
        <path d="M 646 388 C 682 368, 712 354, 744 340" strokeWidth="13" />
        <path d="M 744 340 C 766 330, 784 322, 800 310" strokeWidth="7" />
        <path d="M 646 388 C 656 356, 662 326, 664 292" strokeWidth="8" />
        {/* central leader */}
        <path d="M 460 495 C 458 440, 454 380, 450 318" strokeWidth="20" />
        <path d="M 450 318 C 447 268, 446 220, 446 168" strokeWidth="11" />
        <path d="M 450 318 C 428 288, 402 264, 372 240" strokeWidth="9" />
        <path d="M 446 168 C 444 140, 444 116, 446 92" strokeWidth="6" />
        <path d="M 448 440 C 486 420, 520 404, 556 392" strokeWidth="9" />
        <path d="M 452 380 C 420 362, 388 350, 352 342" strokeWidth="8" />
      </g>

      {/* ===== MID CANOPY ===== */}
      <g>
        {MID_CLUSTERS.map((c, i) => (
          <LeafCluster key={`md${i}`} cx={c.x} cy={c.y} r={c.r} seed={i * 13 + 5} tone="mid" />
        ))}
      </g>

      {/* ===== TRUNK ===== */}
      <g>
        {/* trunk silhouette */}
        <path
          d="M 372 862
             C 386 792, 398 736, 404 676
             C 410 618, 417 566, 425 524
             C 431 494, 433 476, 434 460
             L 502 458
             C 501 474, 502 492, 506 520
             C 513 562, 520 614, 527 674
             C 534 734, 546 790, 560 862
             Z"
          fill="url(#ht-trunk)"
        />
        {/* bark ridges — dark grooves following trunk flow */}
        <g stroke="#3a2312" strokeWidth="2.4" fill="none" opacity="0.4" strokeLinecap="round">
          <path d="M 408 840 C 419 764, 426 704, 431 646" />
          <path d="M 436 852 C 442 776, 446 708, 449 632" />
          <path d="M 462 858 C 463 784, 465 716, 468 644" />
          <path d="M 490 850 C 487 776, 484 708, 482 636" />
          <path d="M 516 846 C 509 774, 503 714, 499 654" />
          <path d="M 428 600 C 431 560, 434 530, 438 500" strokeWidth="1.8" />
          <path d="M 478 598 C 476 560, 475 530, 474 500" strokeWidth="1.8" />
        </g>
        {/* bark highlights on lit side */}
        <g stroke="#c99a63" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round">
          <path d="M 418 820 C 428 748, 435 692, 441 634" />
          <path d="M 452 830 C 456 758, 460 696, 463 628" />
          <path d="M 445 560 C 448 528, 451 502, 455 476" strokeWidth="1.6" />
        </g>
        {/* small knots for character */}
        <ellipse cx="474" cy="700" rx="8" ry="12" fill="#2c1a0c" />
        <ellipse cx="474" cy="700" rx="12" ry="17" fill="none" stroke="#54371e" strokeWidth="2.5" opacity="0.7" />
        <ellipse cx="440" cy="580" rx="4.5" ry="7" fill="#33200e" opacity="0.85" />
        {/* root flare / buttress roots sinking into the mound */}
        <g fill="url(#ht-trunk)">
          <path d="M 372 862 C 352 846, 322 838, 284 842 C 258 845, 238 852, 222 862 Z" />
          <path d="M 560 862 C 580 848, 606 840, 640 842 C 664 844, 682 851, 694 862 Z" />
          <path d="M 402 862 C 392 850, 378 844, 358 846 C 344 848, 332 853, 324 862 Z" opacity="0.9" />
          <path d="M 536 862 C 546 850, 560 844, 580 846 C 592 848, 602 853, 610 862 Z" opacity="0.9" />
        </g>
      </g>

      {/* ===== GROUND ===== */}
      <g>
        <ellipse cx="230" cy="1035" rx="430" ry="165" fill="url(#ht-mound-back)" opacity="0.9" />
        <ellipse cx="680" cy="1048" rx="420" ry="172" fill="url(#ht-mound-back)" opacity="0.75" />
        <ellipse cx="450" cy="1064" rx="640" ry="196" fill="url(#ht-mound-front)" />
        {/* grass blades swaying along the mound crest */}
        <g stroke="#4f9a52" strokeLinecap="round" fill="none">
          {Array.from({ length: 34 }, (_, i) => {
            const t = i / 33;
            const gx = 90 + t * 720;
            const gy = 900 - Math.sin(t * Math.PI) * 26 + Math.cos(t * 12) * 5;
            const h = 13 + rand(i * 3.3) * 15;
            const lean = (rand(i * 7.7) - 0.5) * 12;
            return (
              <path
                key={`gr${i}`}
                d={`M ${gx} ${gy} q ${lean * 0.4} ${-h * 0.6} ${lean} ${-h}`}
                strokeWidth={2.2}
                opacity={0.55 + rand(i * 1.9) * 0.35}
                className="grass-blade"
                style={{
                  animationDelay: `${(i % 9) * 0.45}s`,
                  animationDuration: `${3.4 + (i % 5) * 0.5}s`,
                  transformOrigin: `${gx}px ${gy}px`,
                }}
              />
            );
          })}
        </g>
        {/* tiny flowers */}
        <g>
          {[[176, 878], [232, 890], [640, 884], [704, 894], [330, 896], [560, 898]].map(([fx, fy], i) => (
            <g key={`fl${i}`}>
              <line x1={fx} y1={fy} x2={fx} y2={fy - 9} stroke="#3f7c43" strokeWidth="1.6" />
              <circle cx={fx} cy={fy - 11} r="3.4" fill={i % 2 ? '#ffd54d' : '#fdf3e0'} />
              <circle cx={fx} cy={fy - 11} r="1.3" fill="#e6a53e" />
            </g>
          ))}
        </g>
        {/* stones near the base */}
        <ellipse cx="298" cy="886" rx="13" ry="7" fill="#a7988a" />
        <ellipse cx="304" cy="883" rx="9" ry="5" fill="#bdb0a2" />
        <ellipse cx="612" cy="890" rx="10" ry="6" fill="#a7988a" />
        <ellipse cx="616" cy="887" rx="6.5" ry="4" fill="#c2b6a8" />
      </g>

      {/* ===== FRONT CANOPY (over branches & trunk top for depth) ===== */}
      <g>
        {FRONT_CLUSTERS.map((c, i) => (
          <LeafCluster key={`fr${i}`} cx={c.x} cy={c.y} r={c.r} seed={i * 17 + 11} tone="light" swayClass="tree-cluster-fast" />
        ))}
      </g>

      {/* birds perched on limbs */}
      <SittingBird x={186} y={318} scale={0.9} delay={1.2} />
      <SittingBird x={748} y={332} scale={1} flip delay={3.6} />

      {/* falling leaves */}
      {FALLING_LEAVES.map((l, i) => (
        <g key={`fall${i}`} className="tree-fall" style={{ animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s` }}>
          <g className="tree-drift" style={{ animationDuration: `${l.dur / 5}s`, animationDelay: `${l.delay}s` }}>
            <Leaf x={l.x} y={l.y} angle={i * 47} scale={l.scale} color={l.color} opacity={0.9} />
          </g>
        </g>
      ))}
    </svg>
  );
}
