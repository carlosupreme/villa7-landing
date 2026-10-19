// Usage: node scripts/shoot.mjs [url] — screenshots the page at several scroll positions (desktop + mobile)
import { chromium } from 'playwright'
const url = process.argv[2] || 'http://127.0.0.1:8087'
const browser = await chromium.launch({ env: { ...process.env, LD_LIBRARY_PATH: process.env.HOME + '/.local/chromelibs/usr/lib/x86_64-linux-gnu' } })
for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2200)
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  const stops = [0, 0.12, 0.2, 0.3, 0.4, 0.5, 0.6, 0.72, 0.85, 1]
  for (const s of stops) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * s))
    await page.waitForTimeout(900)
    await page.screenshot({ path: `shots/${name}-${String(Math.round(s * 100)).padStart(3, '0')}.png` })
  }
  console.log(name, 'height', total, 'errors', errors)
  await page.close()
}
await browser.close()
