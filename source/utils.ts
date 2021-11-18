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
  if (filepath) {
    if (!fs.existsSync(filepath)) {
      console.log(
        "%c [ output.filepath:404 ]: ",
        "color: #bf2c9f; background: pink; font-size: 13px;",
        "please provide the output filepath !"
      );
      process.exit(0);
    } else {
      const fileStat = fs.statSync(filepath);
      if (fileStat.isDirectory()) {
        filepath = path.join(filepath, "default.html");
        fs.writeFileSync(filepath, defaultHtml);
      }
    }
  }
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