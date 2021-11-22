"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratePageStructure = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var puppeteer_browser_1 = require("./puppeteer-browser");
var utils_1 = require("./utils");
var GeneratePageStructure = /** @class */ (function () {
    function GeneratePageStructure(options) {
        var output = options.output;
        this.options = __assign(__assign({}, options), { output: {
                filepath: output.filepath,
                injectSelector: (output === null || output === void 0 ? void 0 : output.injectSelector) || "body",
            } });
        this.filepath = (0, utils_1.createDefaultHtml)((0, utils_1.getRootPath)(output.filepath || "./"));
    }
    GeneratePageStructure.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pb, page, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, utils_1.logInfo)("Puppeteer", "正在启动浏览器，请稍后。");
                        pb = new puppeteer_browser_1.PuppeteerBrowser(this.options.isDebug);
                        (0, utils_1.logInfo)("Puppeteer", "\u6B63\u5728\u6253\u5F00\u9875\u9762" + this.options.url + "\uFF0C\u8BF7\u7A0D\u540E\u3002\u3002");
                        return [4 /*yield*/, pb.open(this.options.url, this.options.emulateOpts, this.options.extraHTTPHeaders)];
                    case 1:
                        page = _a.sent();
                        (0, utils_1.logInfo)("Puppeteer", "\u6B63\u5728\u751F\u6210\u9AA8\u67B6\u5C4F\u7247\u6BB5\uFF0C\u8BF7\u7A0D\u540E\u3002\u3002\u3002");
                        return [4 /*yield*/, this.generateSkeletonFragment(page)];
                    case 2:
                        html = _a.sent();
                        // 重写Html内容
                        (0, utils_1.rewriteHtml)(this.options.output.injectSelector, this.filepath, html);
                        (0, utils_1.logInfo)("Puppeteer", "\u9AA8\u67B6\u5C4F\u7247\u6BB5\u5DF2\u751F\u6210\u81F3" + this.filepath);
                        if (!!this.options.isDebug) return [3 /*break*/, 4];
                        return [4 /*yield*/, pb.close()];
                    case 3:
                        _a.sent();
                        process.exit(0);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 生成骨架HTML片段
     * @param page
     * @returns
     */
    GeneratePageStructure.prototype.generateSkeletonFragment = function (page) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var html, opts, scriptContent, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        html = "";
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        opts = [
                            {
                                name: "init",
                                type: "function",
                                value: "" + this.options.init,
                            },
                            {
                                name: "includeElement",
                                type: "function",
                                value: "" + this.options.includeElement,
                            },
                            { name: "background", type: "string", value: this.options.background },
                            { name: "animation", type: "string", value: this.options.animation },
                            {
                                name: "header",
                                type: "object",
                                value: JSON.stringify({
                                    height: (_a = this.options.header) === null || _a === void 0 ? void 0 : _a.height,
                                    background: (_b = this.options.header) === null || _b === void 0 ? void 0 : _b.background,
                                }),
                            },
                        ];
                        return [4 /*yield*/, fs_1.default.readFileSync(path_1.default.resolve(__dirname, "eval-dom-scripts.js"), "utf8")];
                    case 2:
                        scriptContent = _c.sent();
                        return [4 /*yield*/, page.addScriptTag({ content: scriptContent })];
                    case 3:
                        _c.sent();
                        if (this.options.isDebug) {
                            page.on("console", function (msg) { return (0, utils_1.logInfo)("PAGE_INFO", msg.text()); });
                        }
                        return [4 /*yield*/, page.evaluate(function (res) {
                                // @ts-ignore
                                return window.evalDOMScripts.apply(window, res);
                                // @ts-ignore
                            }, opts)];
                    case 4:
                        // 执行脚本获取生成的html片段
                        html = _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _c.sent();
                        (0, utils_1.logInfo)("Puppeteer.evaluate", e_1.message);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, html];
                }
            });
        });
    };
    return GeneratePageStructure;
}());
exports.GeneratePageStructure = GeneratePageStructure;
