import fs from "fs";
import path from "path";
import { defaultHtml } from "./default.html";
import cheerio from "cheerio";

export function logInfo(tag: string, message: string, exit?: boolean) {
  console.log(
    `%c [ ${tag} ]: `,
    "color: #bf2c9f; background: pink; font-size: 13px;",
    message
  );
  exit && process.exit(0);
}

export function createDefaultHtml(filepath: string) {
  if (!fs.existsSync(filepath)) {
    console.log(
      "%c [ Initialization failed ]: ",
      "color: #bf2c9f; background: pink; font-size: 13px;",
      "未能找到指定的入口文件，请排查！"
    );
    process.exit(0);
  }
  const fileStat = fs.statSync(filepath);
  if (fileStat.isDirectory()) {
    filepath = path.join(filepath, "default.html");
    fs.writeFileSync(filepath, defaultHtml);
  }
  return filepath;
}

/**
 * 重写html文件加入骨架片段
 * @param filepath
 * @param html
 */
export function rewriteHtml(selector: string, filepath: string, html: string) {
  if (filepath) {
    let fileHTML = fs.readFileSync(filepath);
    let $ = cheerio.load(fileHTML, {
      decodeEntities: false,
    });
    $(selector).html(html);
    fs.writeFileSync(filepath, $.html("html"));
  }
}

/**
 * 获取入口文件路径
 * @param filepath
 */
export function getRootPath(filepath: string) {
  return !filepath || path.isAbsolute(filepath)
    ? filepath
    : path.join(process.cwd(), filepath);
}
