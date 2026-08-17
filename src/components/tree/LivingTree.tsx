const BACK_LEAVES: [number, number, number][] = [
  [720, 320, 65], [520, 380, 60], [920, 360, 58],
  [380, 500, 68], [1060, 480, 62], [260, 660, 70],
  [1180, 640, 65], [180, 820, 62], [1260, 800, 58],
  [200, 1000, 55], [1240, 980, 52], [280, 1160, 48],
  [1160, 1140, 46], [360, 1320, 44], [1080, 1300, 42],
  [440, 1440, 40], [1000, 1420, 38], [560, 1500, 36],
  [880, 1480, 35], [720, 1550, 34],
  [640, 280, 50], [800, 300, 48], [480, 440, 52],
  [960, 420, 50], [340, 580, 54], [1100, 560, 52],
  [160, 740, 56], [1280, 720, 50], [120, 900, 48],
  [1300, 880, 46], [400, 1060, 44], [1040, 1040, 42],
  [300, 1220, 40], [1140, 1200, 38], [500, 1380, 36],
  [940, 1360, 34], [620, 1520, 32], [820, 1500, 30],
  [580, 340, 46], [860, 340, 44], [720, 460, 48],
  [420, 620, 50], [1020, 600, 48], [240, 860, 46],
  [1200, 840, 44], [340, 1040, 42], [1100, 1020, 40],
  [460, 1200, 38], [980, 1180, 36], [600, 1400, 34],
  [840, 1380, 32],
];

const FRONT_LEAVES: [number, number, number][] = [
  [720, 240, 60], [600, 300, 55], [840, 280, 54],
  [460, 420, 58], [980, 400, 56], [320, 580, 62],
  [1120, 560, 58], [220, 740, 56], [1220, 720, 52],
  [160, 920, 50], [1280, 900, 48], [240, 1080, 46],
  [1200, 1060, 44], [320, 1240, 42], [1120, 1220, 40],
  [720, 200, 55], [560, 260, 50], [880, 240, 48],
  [720, 380, 58], [640, 440, 52], [800, 420, 50],
  [720, 500, 54], [400, 560, 48], [1040, 540, 46],
  [660, 340, 48], [780, 320, 46], [540, 500, 50],
  [900, 480, 48], [380, 660, 52], [1060, 640, 50],
  [280, 820, 54], [1160, 800, 48], [200, 980, 46],
  [1240, 960, 44], [340, 1140, 42], [1100, 1120, 40],
  [440, 1300, 38], [1000, 1280, 36], [560, 1460, 34],
  [880, 1440, 32], [720, 580, 44], [620, 640, 42],
  [820, 620, 40], [500, 720, 46], [940, 700, 44],
  [360, 860, 42], [1080, 840, 40], [260, 1020, 38],
  [1180, 1000, 36], [400, 1180, 34], [1040, 1160, 32],
];

const LEAF_PALETTE = {
  dark: ['#0d2e1a', '#13391f', '#174a28', '#1b5530', '#1f5e35'],
  mid: ['#2a6e42', '#338050', '#3c8e58', '#469a62', '#4fa56a'],
  light: ['#56ad6e', '#62b878', '#6ec282', '#7acc8c', '#86d496'],
  highlight: ['#8edc9e', '#a0e6ae', '#b2eec0'],
};

const DARK_GREENS = LEAF_PALETTE.dark;
const MID_GREENS = LEAF_PALETTE.mid;
const LIGHT_GREENS = LEAF_PALETTE.light;

function pick<T>(arr: T[], i: number): T { return arr[((i % arr.length) + arr.length) % arr.length]; }

function SingleLeaf({ x, y, angle, scale, color, opacity }: {
  x: number; y: number; angle: number; scale: number; color: string; opacity: number;
}) {
  return (
    <path
      d={`M 0 0 C 3 -4, 8 -6, 12 -3 C 16 0, 12 4, 8 5 C 4 6, 1 3, 0 0 Z`}
      fill={color}
      opacity={opacity}
      transform={`translate(${x},${y}) rotate(${angle}) scale(${scale})`}
    />
  );
}

function LeafCluster({ cx, cy, r, delay, shade }: {
  cx: number; cy: number; r: number; delay: number; shade: 'dark' | 'mid' | 'light';
}) {
  const palette = LEAF_PALETTE[shade];
  const leaves: { x: number; y: number; angle: number; scale: number; color: string; opacity: number }[] = [];
  const count = Math.max(14, Math.round(r / 3));

  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (i * 0.618);
    const dist = r * (0.25 + ((i * 7 + 3) % 10) / 20);
    const lx = Math.cos(a) * dist;
    const ly = Math.sin(a) * dist * 0.7;
    const angle = (a * 180) / Math.PI + ((i * 17) % 30 - 15);
    const sc = 0.7 + ((i * 13) % 8) / 10;
    const ci = i % palette.length;
    const hi = (i * 3) % LEAF_PALETTE.highlight.length;
    const useHighlight = i % 5 === 0;
    leaves.push({
      x: lx, y: ly, angle, scale: sc,
      color: useHighlight ? LEAF_PALETTE.highlight[hi] : palette[ci],
      opacity: useHighlight ? 0.7 + ((i % 3) * 0.05) : 0.82 + ((i % 4) * 0.03),
    });
  }

  return (
    <g className="tree-leaf-sway" style={{ animationDelay: `${delay}s`, transformOrigin: `${cx}px ${cy}px` }}>
      <g transform={`translate(${cx},${cy})`}>
        {leaves.map((l, i) => (
          <SingleLeaf key={i} x={l.x} y={l.y} angle={l.angle} scale={l.scale} color={l.color} opacity={l.opacity} />
        ))}
      </g>
    </g>
  );
}

const ROOTS = [
  { d: 'M 640 4000 C 570 4150, 400 4350, 200 4550 C 160 4600, 120 4650, 80 4700', w: 16 },
  { d: 'M 660 4000 C 610 4180, 480 4400, 340 4620 C 300 4680, 260 4730, 220 4780', w: 14 },
  { d: 'M 680 4000 C 650 4200, 560 4450, 450 4700', w: 12 },
  { d: 'M 720 4000 C 720 4250, 710 4500, 700 4800', w: 14 },
  { d: 'M 760 4000 C 790 4200, 880 4450, 990 4700', w: 12 },
  { d: 'M 780 4000 C 830 4180, 960 4400, 1100 4620 C 1140 4680, 1180 4730, 1220 4780', w: 14 },
  { d: 'M 800 4000 C 870 4150, 1040 4350, 1240 4550 C 1280 4600, 1320 4650, 1360 4700', w: 16 },
  { d: 'M 740 4020 C 740 4180, 730 4350, 720 4550', w: 8 },
];

const SUB_ROOTS = [
  { d: 'M 400 4350 C 360 4400, 300 4460, 240 4510', w: 6 },
  { d: 'M 480 4400 C 440 4450, 380 4500, 320 4540', w: 5 },
  { d: 'M 960 4400 C 1000 4450, 1060 4500, 1120 4540', w: 5 },
  { d: 'M 1040 4350 C 1080 4400, 1140 4460, 1200 4510', w: 6 },
  { d: 'M 560 4450 C 530 4500, 480 4550, 430 4600', w: 4 },
  { d: 'M 880 4450 C 910 4500, 960 4550, 1010 4600', w: 4 },
];

const FALLING_LEAF_DATA = [
  { x: 350, y: 600, dur: 7, delay: 0, color: '#2d6b43' },
  { x: 900, y: 500, dur: 9, delay: 2, color: '#3d8b55' },
  { x: 550, y: 700, dur: 8, delay: 4, color: '#4a9e66' },
  { x: 1100, y: 550, dur: 10, delay: 1, color: '#1a4d2e' },
  { x: 250, y: 800, dur: 8.5, delay: 3, color: '#5cb870' },
  { x: 1200, y: 650, dur: 7.5, delay: 5, color: '#2d6b43' },
];

export default function LivingTree() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden living-tree-container" aria-hidden="true">
      <svg
        viewBox="0 0 1440 7200"
        preserveAspectRatio="xMidYMin slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9e8f5" />
            <stop offset="40%" stopColor="#e4f1f8" />
            <stop offset="100%" stopColor="#faf8f5" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a2e1a" />
            <stop offset="30%" stopColor="#7a5230" />
            <stop offset="50%" stopColor="#8b5a34" />
            <stop offset="70%" stopColor="#7a5230" />
            <stop offset="100%" stopColor="#4a2e1a" />
          </linearGradient>
          <linearGradient id="branchGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5a3825" />
            <stop offset="50%" stopColor="#6b4226" />
            <stop offset="100%" stopColor="#5a3825" />
          </linearGradient>
          <linearGradient id="rootGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a3825" />
            <stop offset="100%" stopColor="#3d2615" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d8b55" />
            <stop offset="40%" stopColor="#2d6b43" />
            <stop offset="100%" stopColor="#5a3825" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="0.7" cy="0.1" r="0.55">
            <stop offset="0%" stopColor="#fff7e6" stopOpacity={0.6} />
            <stop offset="60%" stopColor="#ffe8a0" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#fff7e6" stopOpacity={0} />
          </radialGradient>
          <filter id="leafBlur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="softShadow">
            <feDropShadow dx="3" dy="5" stdDeviation="8" floodColor="#1a4d2e" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="1440" height="1600" fill="url(#skyGrad)" />

        {/* Sunlight */}
        <rect x="0" y="0" width="1440" height="1600" fill="url(#sunGlow)" className="tree-light-pulse" />

        {/* Sun rays */}
        <g className="tree-light-pulse" opacity="0.35">
          <line x1="1050" y1="0" x2="800" y2="600" stroke="#ffd700" strokeWidth="4" />
          <line x1="1100" y1="0" x2="950" y2="500" stroke="#ffd700" strokeWidth="3" />
          <line x1="1000" y1="0" x2="650" y2="700" stroke="#ffd700" strokeWidth="3.5" />
          <line x1="1150" y1="0" x2="1100" y2="450" stroke="#ffd700" strokeWidth="2.5" />
        </g>

        {/* Back leaf layer */}
        <g opacity="0.8">
          {BACK_LEAVES.map(([cx, cy, r], i) => (
            <LeafCluster key={`bl${i}`} cx={cx} cy={cy} r={r} delay={i * 0.15} shade="dark" />
          ))}
        </g>

        {/* Back branches */}
        <g opacity="0.5">
          <path d="M 688 600 C 620 550, 480 470, 340 380" stroke="#4a2e1a" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M 680 1000 C 600 940, 430 850, 270 760" stroke="#4a2e1a" strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d="M 760 1250 C 850 1190, 1020 1080, 1180 980" stroke="#4a2e1a" strokeWidth="14" fill="none" strokeLinecap="round" />
        </g>

        {/* Trunk */}
        <path
          d="M 695 500 C 688 700, 682 900, 678 1100 C 674 1300, 670 1600, 668 1900 C 665 2200, 660 2600, 658 3000 C 655 3300, 650 3700, 648 4100 C 645 4600, 640 5100, 635 5600 L 805 5600 C 800 5100, 795 4600, 792 4100 C 790 3700, 785 3300, 782 3000 C 780 2600, 775 2200, 772 1900 C 770 1600, 766 1300, 762 1100 C 758 900, 752 700, 745 500 Z"
          fill="url(#trunkGrad)"
          filter="url(#softShadow)"
        />

        {/* Bark texture */}
        <g stroke="#3d2615" strokeWidth="1" fill="none" opacity="0.3">
          <path d="M 680 600 C 675 900, 672 1200, 670 1600" />
          <path d="M 670 1600 C 668 2000, 664 2500, 660 3000" />
          <path d="M 660 3000 C 656 3400, 652 3800, 648 4200" />
          <path d="M 760 600 C 765 900, 768 1200, 770 1600" />
          <path d="M 770 1600 C 772 2000, 776 2500, 780 3000" />
          <path d="M 780 3000 C 784 3400, 788 3800, 792 4200" />
          <path d="M 720 600 C 718 1000, 715 1400, 712 1900" />
          <path d="M 712 1900 C 710 2400, 706 3000, 700 3500" />
        </g>

        {/* Major branches */}
        <g>
          {[
            { d: 'M 688 600 C 620 550, 480 470, 340 380', w: 18 },
            { d: 'M 752 750 C 830 700, 980 620, 1130 530', w: 16 },
            { d: 'M 680 1000 C 600 940, 430 850, 270 760', w: 20 },
            { d: 'M 760 1250 C 850 1190, 1020 1080, 1180 980', w: 18 },
            { d: 'M 672 1550 C 590 1490, 420 1400, 280 1310', w: 16 },
            { d: 'M 776 1800 C 860 1740, 1010 1650, 1140 1560', w: 14 },
            { d: 'M 664 2200 C 590 2140, 440 2060, 320 1980', w: 14 },
            { d: 'M 780 2450 C 850 2390, 980 2310, 1080 2230', w: 12 },
            { d: 'M 656 2750 C 590 2700, 470 2630, 380 2560', w: 12 },
            { d: 'M 786 2950 C 845 2900, 950 2830, 1030 2760', w: 10 },
            { d: 'M 650 3200 C 570 3150, 450 3080, 350 3000', w: 10 },
            { d: 'M 792 3400 C 875 3350, 990 3270, 1090 3190', w: 9 },
          ].map((b, i) => (
            <path key={`br${i}`} d={b.d} stroke="url(#branchGrad)" strokeWidth={b.w} fill="none" strokeLinecap="round" className="tree-branch-sway" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </g>

        {/* Sub-branches */}
        <g>
          {[
            'M 480 470 C 420 420, 340 360, 260 310',
            'M 340 380 C 290 330, 220 280, 160 240',
            'M 980 620 C 1040 570, 1120 510, 1200 460',
            'M 430 850 C 370 790, 280 720, 200 660',
            'M 270 760 C 210 700, 150 640, 100 590',
            'M 1020 1080 C 1090 1020, 1180 940, 1260 880',
            'M 1180 980 C 1240 920, 1310 860, 1370 810',
            'M 420 1400 C 360 1350, 280 1290, 200 1240',
            'M 1010 1650 C 1070 1600, 1140 1540, 1200 1490',
            'M 440 2060 C 380 2010, 310 1960, 250 1910',
            'M 980 2310 C 1030 2260, 1090 2200, 1140 2160',
            'M 470 2630 C 420 2590, 360 2540, 300 2500',
          ].map((d, i) => (
            <path key={`sb${i}`} d={d} stroke="#5a3825" strokeWidth={8 - Math.floor(i / 3)} fill="none" strokeLinecap="round" />
          ))}
        </g>

        {/* Front leaf layer */}
        <g>
          {FRONT_LEAVES.map(([cx, cy, r], i) => (
            <LeafCluster key={`fl${i}`} cx={cx} cy={cy} r={r} delay={i * 0.12 + 0.5} shade={i % 3 === 0 ? 'light' : 'mid'} />
          ))}
        </g>

        {/* Branch tip leaves */}
        <g>
          {[
            [340, 360], [160, 220], [260, 290], [1130, 510],
            [1200, 440], [270, 740], [200, 640], [100, 570],
            [1180, 960], [1260, 860], [1370, 790],
            [280, 1290], [200, 1220], [1140, 1540], [1200, 1470],
            [320, 1960], [250, 1890], [1080, 2200], [1140, 2140],
            [380, 2540], [300, 2480], [1030, 2740], [350, 2980],
            [280, 2920], [1090, 3170], [1160, 3100],
          ].map(([cx, cy], i) => (
            <LeafCluster key={`tl${i}`} cx={cx} cy={cy} r={28 + (i % 5) * 4} delay={i * 0.1 + 1} shade={i % 2 === 0 ? 'mid' : 'light'} />
          ))}
        </g>

        {/* Ground layer */}
        <g transform="translate(0 1100)">
          <rect x="0" y="3950" width="1440" height="120" fill="url(#groundGrad)" />
          {/* Grass blades */}
          {Array.from({ length: 60 }, (_, i) => {
            const x = 20 + i * 24;
            const h = 15 + (i % 7) * 5;
            const sway = (i % 3) * 0.5;
            return (
              <line key={`g${i}`} x1={x} y1={3960} x2={x + sway} y2={3960 - h} stroke="#4a9e66" strokeWidth="2" strokeLinecap="round" opacity={0.6 + (i % 4) * 0.1} className="tree-leaf-sway" style={{ animationDelay: `${sway}s` }} />
            );
          })}
          {/* Small plants */}
          <circle cx="180" cy="3955" r="8" fill="#3d8b55" opacity="0.7" />
          <circle cx="190" cy="3952" r="6" fill="#4a9e66" opacity="0.6" />
          <circle cx="1250" cy="3955" r="7" fill="#3d8b55" opacity="0.7" />
          <circle cx="1260" cy="3953" r="5" fill="#4a9e66" opacity="0.6" />
          <circle cx="500" cy="3957" r="5" fill="#2d6b43" opacity="0.5" />
          <circle cx="940" cy="3957" r="5" fill="#2d6b43" opacity="0.5" />
          {/* Stones */}
          <ellipse cx="350" cy="3965" rx="12" ry="6" fill="#b8a99a" opacity="0.5" />
          <ellipse cx="1100" cy="3963" rx="10" ry="5" fill="#b8a99a" opacity="0.4" />
          <ellipse cx="700" cy="3968" rx="8" ry="4" fill="#c4b5a6" opacity="0.4" />
        </g>

        {/* Root system */}
        <g transform="translate(0 1100)">
          {ROOTS.map((r, i) => (
            <path key={`r${i}`} d={r.d} stroke="url(#rootGrad)" strokeWidth={r.w} fill="none" strokeLinecap="round" opacity={0.85} />
          ))}
          {SUB_ROOTS.map((r, i) => (
            <path key={`sr${i}`} d={r.d} stroke="#4a2e1a" strokeWidth={r.w} fill="none" strokeLinecap="round" opacity={0.7} />
          ))}
          {/* Root details */}
          <g stroke="#3d2615" strokeWidth="1" fill="none" opacity="0.2">
            <path d="M 570 4150 C 540 4200, 490 4260, 440 4310" />
            <path d="M 870 4150 C 900 4200, 950 4260, 1000 4310" />
            <path d="M 720 4250 C 718 4350, 715 4450, 712 4550" />
          </g>
        </g>

        {/* Underground soil texture */}
        <g opacity="0.15">
          {Array.from({ length: 30 }, (_, i) => (
            <circle key={`soil${i}`} cx={100 + (i * 43) % 1240} cy={4300 + (i * 37) % 500} r={2 + (i % 3)} fill="#5a3825" />
          ))}
        </g>

        {/* Falling leaves */}
        <g>
          {FALLING_LEAF_DATA.map((l, i) => (
            <g key={`fl${i}`} className="tree-falling-leaf" style={{ animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s` }}>
              <path
                d="M 0 0 C 2 -3, 6 -5, 10 -2 C 13 0, 10 3, 6 4 C 3 5, 1 2, 0 0 Z"
                fill={l.color}
                opacity="0.85"
                transform={`translate(${l.x},${l.y}) rotate(${i * 40}) scale(1.2)`}
              />
            </g>
          ))}
        </g>

        {/* Ambient light overlay on canopy */}
        <g className="tree-light-pulse" opacity="0.08">
          <ellipse cx="600" cy="500" rx="200" ry="150" fill="#ffd700" />
          <ellipse cx="850" cy="400" rx="180" ry="130" fill="#ffd700" />
        </g>
      </svg>
    </div>
  );
}
