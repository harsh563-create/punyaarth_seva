/* Smoke-test all routes for console errors + overflow */
const puppeteer = require('puppeteer-core');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = process.env.TARGET_URL || 'http://localhost:5173';
const ROUTES = ['/', '/about', '/seva', '/activities', '/events', '/join', '/contact', '/nope'];

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] });
  let bad = 0;
  for (const route of ROUTES) {
    const page = await browser.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}`));
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 });
    // let entrance animations (slide-in from ±40px) finish so transient
    // transform offsets don't read as permanent layout overflow
    await new Promise((r) => setTimeout(r, 1500));
    const r = await page.evaluate(() => ({ ox: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
    const ok = errors.length === 0 && r.ox <= 1;
    if (!ok) bad++;
    console.log(`${route.padEnd(12)} overflow-x=${r.ox}px errors=${errors.length ? JSON.stringify(errors.slice(0, 2)) : 'none'} ${ok ? 'OK' : 'FAIL'}`);
    await page.close();
  }
  await browser.close();
  console.log(bad === 0 ? 'ALL ROUTES OK' : `${bad} route(s) failing`);
})();
