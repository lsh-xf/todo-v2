const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:5199/';
const BAD_URL = BASE + 'experiments/bad.html';
const SEED = [{ id: 1, text: '测试任务', completed: false }];

const PROBE = () => {
  window.__writes = [];
  const original = Storage.prototype.setItem;
  Storage.prototype.setItem = function setItem(key, value) {
    window.__writes.push(value);
    return original.call(this, key, value);
  };
};

(async () => {
  const outDir = path.join(__dirname, '..', 'shots');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  async function probe(url) {
    const page = await browser.newPage({ viewport: { width: 720, height: 300 } });
    await page.addInitScript(PROBE);
    await page.goto(url);
    await page.evaluate((seed) => {
      localStorage.clear();
      localStorage.setItem('todos', JSON.stringify(seed));
    }, SEED);
    await page.reload();
    await page.waitForTimeout(900);
    const result = {
      writesDuringLoad: await page.evaluate(() => window.__writes),
      finalStorage: await page.evaluate(() => localStorage.getItem('todos')),
      rendered: await page.locator('li').allTextContents(),
    };
    await page.close();
    return result;
  }

  const bad = await probe(BAD_URL);
  const good = await probe(BASE);

  const page = await browser.newPage({ viewport: { width: 720, height: 300 } });
  await page.addInitScript(PROBE);
  await page.goto(BAD_URL);
  await page.evaluate((seed) => {
    localStorage.clear();
    localStorage.setItem('todos', JSON.stringify(seed));
  }, SEED);
  await page.reload();
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(outDir, 'w12-bad-writes.png') });
  await page.close();

  console.log(JSON.stringify({ bad, good }, null, 2));
  await browser.close();
})();
