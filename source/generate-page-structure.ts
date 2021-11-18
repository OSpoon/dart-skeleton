import path from "path";
import fs from "fs";

import { Page } from "puppeteer";

import { Configuration } from "./models";
import { PuppeteerBrowser } from "./puppeteer-browser";
import { createDefaultHtml, logInfo, rewriteHtml } from "./utils";

export class GeneratePageStructure {
  private options: Configuration;
  private filepath: string;

  constructor(options: Configuration) {
    const { output, background, init, includeElement } = options;
    this.options = {
      ...options,
      output: {
        filepath: output.filepath,
        injectSelector: output?.injectSelector || "body",
      },
      background: background || "#ecf0f2",
      init: init || function () {},
      includeElement: includeElement || function () {},
    };
    this.filepath =
      !output.filepath || path.isAbsolute(output.filepath)
        ? output.filepath
        : path.join(process.cwd(), output.filepath);
    createDefaultHtml(this.filepath);
  }

  async start() {
    logInfo("Puppeteer", "正在启动浏览器，请稍后。");
    const pb = new PuppeteerBrowser(this.options.isDebug);

    logInfo("Puppeteer", `正在打开页面${this.options.url}，请稍后。。`);
    const page = await pb.open(
      this.options.url,
      this.options.emulateOpts,
      this.options.extraHTTPHeaders
    );

    logInfo("Puppeteer", `正在生成骨架屏片段，请稍后。。。`);
    const html = await this.generateSkeletonFragment(page);

    // 重写Html内容
    rewriteHtml(this.options.output.injectSelector, this.filepath, html);
    logInfo("Puppeteer", `骨架屏片段已生成至${this.filepath}`);

    // 非开发模式自动关闭
    if (!this.options.isDebug) {
      await pb.close();
      process.exit(0);
    }
  }

  /**
   * 生成骨架HTML片段
   * @param page
   * @returns
   */
  async generateSkeletonFragment(page: Page) {
    let html = "";
    try {
      const opts = [
        {
          name: "init",
          type: "function",
          value: `${this.options.init}`,
        },
        {
          name: "includeElement",
          type: "function",
          value: `${this.options.includeElement}`,
        },
        { name: "background", type: "string", value: this.options.background },
        { name: "animation", type: "string", value: this.options.animation },
        {
          name: "header",
          type: "object",
          value: JSON.stringify({
            height: this.options.header?.height,
            background: this.options.header?.background,
          }),
        },
      ];

      // 加载脚本文件 插入到无头浏览器中
      let scriptContent = await fs.readFileSync(
        path.resolve(__dirname, "eval-dom-scripts.js"),
        "utf8"
      );
      await page.addScriptTag({ content: scriptContent });

      if (this.options.isDebug) {
        page.on("console", (msg) => logInfo("PAGE_INFO", msg.text()));
      }
      // 执行脚本获取生成的html片段
      html = await page.evaluate((res) => {
        // @ts-ignore
        return window.evalDOMScripts.apply(window, res);
        // @ts-ignore
      }, opts);
    } catch (e) {
      logInfo("Puppeteer.evaluate", (e as Error).message);
    }
    return html;
  }
}
