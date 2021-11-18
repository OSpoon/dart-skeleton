import puppeteer, { Viewport } from "puppeteer";

export class PuppeteerBrowser {
  isDebug: boolean;
  browser: puppeteer.Browser | undefined;

  constructor(isDebug: boolean = false) {
    this.isDebug = isDebug;
  }

  async open(
    url: string,
    emulateOpts?: {
      viewport: Viewport;
      userAgent: string;
    },
    extraHTTPHeaders?: Record<string, string>
  ): Promise<puppeteer.Page> {
    this.browser = await puppeteer.launch({
      headless: !this.isDebug,
      devtools: this.isDebug,
      slowMo: 5,
    });
    const page = await this.browser.newPage();
    try {
      if (extraHTTPHeaders) {
        await page.setExtraHTTPHeaders(extraHTTPHeaders);
      }
      if (!emulateOpts) {
        emulateOpts = puppeteer.devices["iPhone 6"];
      }
      await page.emulate(emulateOpts);
      // networkidle0 waits for the network to be idle (no requests for 2 * 60 * 1000ms).
      await page.goto(url, {
        timeout: 2 * 60 * 1000,
        waitUntil: "networkidle0",
      });
    } catch (e) {
      console.error((e as Error).message);
    }
    return page;
  }

  close() {
    this.browser?.close();
  }
}
