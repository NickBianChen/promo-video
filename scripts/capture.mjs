#!/usr/bin/env node
// Screenshot the live site for a promo video, driven by capture.json in the project.
//   node scripts/capture.mjs <project-dir> [--only name,name] [--viewport desktop]
// Writes assets/website/screens-<viewport>/<shot>.png and, for shots with
// "crops", assets/website/ui-crops/<crop>.png. Needs Playwright: run
// `npm install` in this repo's scripts/ once (or have it in the site repo).
import { createRequire } from "node:module";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const projectDir = path.resolve(args.find((a) => !a.startsWith("--")) ?? ".");
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const only = flag("only")?.split(",");
const onlyViewport = flag("viewport");

function loadPlaywright() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  for (const base of [projectDir, path.dirname(projectDir), scriptDir]) {
    const require = createRequire(path.join(base, "noop.js"));
    for (const id of ["playwright", "@playwright/test"]) {
      try {
        return require(id);
      } catch {}
    }
  }
  console.error(
    "Playwright not found. Run `npm install` in promo-video/scripts, then `npx playwright install chromium`.",
  );
  process.exit(1);
}

const config = JSON.parse(await readFile(path.join(projectDir, "capture.json"), "utf8"));
const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const hideCss = (config.hide ?? []).map((sel) => `${sel}{display:none!important}`).join("\n");
let count = 0;
const failures = [];

try {
  for (const [vpName, vp] of Object.entries(config.viewports)) {
    if (onlyViewport && vpName !== onlyViewport) continue;
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor ?? 1,
      isMobile: vp.isMobile ?? false,
      hasTouch: vp.isMobile ?? false,
      colorScheme: config.colorScheme ?? "light",
      locale: config.locale ?? "en-US",
    });
    const page = await context.newPage();
    const outDir = path.join(projectDir, "assets/website", `screens-${vpName}`);
    const cropDir = path.join(projectDir, "assets/website/ui-crops");
    await mkdir(outDir, { recursive: true });

    for (const shot of config.shots) {
      if (only && !only.includes(shot.name)) continue;
      if (shot.viewports && !shot.viewports.includes(vpName)) continue;
      const url = new URL(shot.path ?? "/", config.baseUrl).toString();
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: config.timeout ?? 60000 });
        if (hideCss) await page.addStyleTag({ content: hideCss });
        if (shot.waitFor) await page.waitForSelector(shot.waitFor, { timeout: 30000 });
        for (const step of shot.actions ?? []) {
          if (step.click) await page.click(step.click);
          if (step.fill) await page.fill(step.fill[0], step.fill[1]);
          if (step.upload) await page.setInputFiles(step.upload[0], path.resolve(projectDir, step.upload[1]));
          if (step.scrollTo) await page.locator(step.scrollTo).scrollIntoViewIfNeeded();
          if (step.wait) await page.waitForTimeout(step.wait);
        }
        await page.waitForTimeout(shot.delay ?? config.delay ?? 800);

        const file = path.join(outDir, `${shot.name}.png`);
        if (shot.selector) {
          const target = page.locator(shot.selector).first();
          if ((await target.count()) === 0) throw new Error(`selector "${shot.selector}" matches nothing on ${url}`);
          await target.screenshot({ path: file, animations: "disabled" });
        } else {
          await page.screenshot({ path: file, fullPage: shot.fullPage ?? false, animations: "disabled" });
        }
        count++;
        console.log(`${vpName}/${shot.name}.png  <- ${url}`);

        // crops: clean pieces of the UI (clip in CSS px of the viewport/page)
        for (const crop of shot.crops?.[vpName] ?? []) {
          await mkdir(cropDir, { recursive: true });
          const cropFile = path.join(cropDir, `${crop.name}.png`);
          await page.screenshot({ path: cropFile, clip: crop.clip, fullPage: true, animations: "disabled" });
          count++;
          console.log(`  crop ui-crops/${crop.name}.png`);
        }
      } catch (err) {
        failures.push(`${vpName}/${shot.name}`);
        console.error(`FAILED ${vpName}/${shot.name}: ${err.message.split("\n")[0]}`);
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(`${failures.length} shot(s) failed: ${failures.join(", ")}`);
  process.exitCode = 1;
}
console.log(
  `${count} images. Inspect every one you plan to use: dev badges, loading placeholders, unreleased entries, overlapping layout.`,
);
