/* Layout verification: overflow, broken images, console errors at breakpoints */
const puppeteer = require('puppeteer-core');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = process.env.TARGET_URL || 'http://localhost:5173/';
const VIEWPORTS = [
  { name: 'mobile-sm', width: 360, height: 740 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'desktop-xl', width: 1920, height: 1080 },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  });

  let failures = 0;

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text());
    });
    page.on('pageerror', (e) => consoleErrors.push(`PAGEERROR: ${e.message}`));

    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1200));

    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const issues = [];
      const overflowX = doc.scrollWidth - doc.clientWidth;
      if (overflowX > 1) {
        // find offending elements
        const vw = doc.clientWidth;
        const bad = [...document.querySelectorAll('*')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.right > vw + 1 || r.left < -1;
          })
          .slice(0, 6)
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 3).join('.')} [${Math.round(el.getBoundingClientRect().left)}..${Math.round(el.getBoundingClientRect().right)}]`);
        issues.push(`overflow-x: ${overflowX}px; offenders: ${bad.join(' | ')}`);
      }
      const brokenImgs = [...document.querySelectorAll('img')]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.getAttribute('src'));
      if (brokenImgs.length) issues.push(`broken imgs: ${brokenImgs.join(', ')}`);

      const tree = document.querySelector('svg[role="img"][aria-label*="tree"]');
      const treeBox = tree ? tree.getBoundingClientRect() : null;
      if (tree && (treeBox.width < 50 || treeBox.height < 50)) issues.push(`tree too small: ${Math.round(treeBox.width)}x${Math.round(treeBox.height)}`);

      const heroText = document.querySelector('h1');
      if (!heroText || !heroText.textContent.includes('Rooted')) issues.push('hero h1 missing');

      return { overflowX, issues, title: document.title };
    });

    // scroll to bottom to trigger lazy sections + reveal animations
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const step = () => {
          y += 600;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(step, 60);
          else resolve();
        };
        step();
      });
    });
    await new Promise((r) => setTimeout(r, 800));

    const footerOk = await page.evaluate(() => {
      const f = document.querySelector('footer');
      if (!f) return 'no footer';
      const r = f.getBoundingClientRect();
      return `footer visible=${r.top < innerHeight} h=${Math.round(r.height)}`;
    });

    const name = vp.name.padEnd(11);
    if (report.issues.length || consoleErrors.length) failures++;
    console.log(
      `[${name}] ${vp.width}x${vp.height} | overflow-x=${report.overflowX}px | issues=${JSON.stringify(report.issues)} | consoleErrors=${consoleErrors.length ? JSON.stringify(consoleErrors.slice(0, 3)) : 'none'} | ${footerOk}`,
    );

    if (process.env.SHOTS === '1') {
      await page.screenshot({ path: `D:/projects/seva_website/.shots/${vp.name}-full.png`, fullPage: true });
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise((r) => setTimeout(r, 400));
      await page.screenshot({ path: `D:/projects/seva_website/.shots/${vp.name}-hero.png` });
    }
    await page.close();
  }

  await browser.close();
  console.log(failures === 0 ? 'ALL VIEWPORTS CLEAN' : `${failures} viewport(s) with issues`);
  process.exit(0);
})();
