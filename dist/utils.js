"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootPath = exports.rewriteHtml = exports.createDefaultHtml = exports.logInfo = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var default_html_1 = require("./default.html");
var jsdom_1 = require("jsdom");
function logInfo(tag, message, exit) {
    console.log("%c [ " + tag + " ]: ", "color: #bf2c9f; background: pink; font-size: 13px;", message);
    exit && process.exit(0);
}
exports.logInfo = logInfo;
function createDefaultHtml(filepath) {
    if (!fs_1.default.existsSync(filepath)) {
        console.log("%c [ Initialization failed ]: ", "color: #bf2c9f; background: pink; font-size: 13px;", "未能找到指定的入口文件，请排查！");
        process.exit(0);
    }
    var fileStat = fs_1.default.statSync(filepath);
    if (fileStat.isDirectory()) {
        filepath = path_1.default.join(filepath, "default.html");
        fs_1.default.writeFileSync(filepath, default_html_1.defaultHtml);
    }
    return filepath;
}
exports.createDefaultHtml = createDefaultHtml;
/**
 * 重写html文件加入骨架片段
 * @param filepath
 * @param html
 */
function rewriteHtml(selector, filepath, html) {
    var appendContent = html;
    var htmlContent = fs_1.default.readFileSync(filepath, 'utf-8');
    var dom = new jsdom_1.JSDOM(htmlContent);
    if (dom) {
        var appContent = dom.window.document.querySelector(selector);
        if (appContent) {
            appContent.innerHTML = appendContent;
        }
        var html_1 = dom.window.document.querySelector('html');
        if (html_1) {
            var result = html_1.outerHTML;
            fs_1.default.writeFileSync(filepath, result);
        }
    }
}
exports.rewriteHtml = rewriteHtml;
/**
 * 获取入口文件路径
 * @param filepath
 */
function getRootPath(filepath) {
    return !filepath || path_1.default.isAbsolute(filepath)
        ? filepath
        : path_1.default.join(process.cwd(), filepath);
}
exports.getRootPath = getRootPath;
