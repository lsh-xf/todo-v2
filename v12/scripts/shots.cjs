const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = 'http://127.0.0.1:5199/';

(async () => {
  const outDir = path.join(__dirname, '..', 'shots');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 760, height: 620 },
    deviceScaleFactor: 2.5,
    locale: 'zh-CN',
  });
  const page = await context.newPage();
  const result = {};

  await page.goto(BASE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('.todo-form');
  result.emptyText = await page.textContent('.empty');

  const tasks = [
    '完成第12周 Context 主题切换',
    '把 localStorage 改成惰性初始化',
    '写三层审查报告',
  ];
  for (const task of tasks) {
    await page.fill('.todo-input', task);
    await page.press('.todo-input', 'Enter');
  }
  await page.locator('.todo-item input[type=checkbox]').nth(1).check();

  const app = page.locator('.app');
  await app.screenshot({ path: path.join(outDir, 'w12-light.png') });
  result.lightTheme = await page.getAttribute('html', 'data-theme');
  result.lightCount = await page.locator('.todo-item').count();
  result.footer = await page.textContent('.app-footer');

  await page.click('.btn-theme');
  await page.waitForTimeout(400);
  result.darkTheme = await page.getAttribute('html', 'data-theme');
  await app.screenshot({ path: path.join(outDir, 'w12-dark.png') });

  await page.reload();
  await page.waitForSelector('.todo-item');
  result.afterReloadCount = await page.locator('.todo-item').count();
  result.afterReloadTexts = await page.locator('.todo-text').allTextContents();
  result.themeAfterReload = await page.getAttribute('html', 'data-theme');
  await app.screenshot({ path: path.join(outDir, 'w12-persisted.png') });

  await page.evaluate(() => {
    localStorage.setItem(
      'todos',
      JSON.stringify([{ id: 1, text: '测试任务', completed: false }]),
    );
  });
  await page.reload();
  await page.waitForSelector('.todo-item');
  result.seedTexts = await page.locator('.todo-text').allTextContents();
  result.storageAfterSeedLoad = await page.evaluate(() => localStorage.getItem('todos'));
  await page.screenshot({ path: path.join(outDir, 'w12-seed-keep.png') });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
