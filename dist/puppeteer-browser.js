"use strict";
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
exports.PuppeteerBrowser = void 0;
var puppeteer_1 = __importDefault(require("puppeteer"));
var PuppeteerBrowser = /** @class */ (function () {
    function PuppeteerBrowser(isDebug) {
        if (isDebug === void 0) { isDebug = false; }
        this.isDebug = isDebug;
    }
    PuppeteerBrowser.prototype.open = function (url, emulateOpts, extraHTTPHeaders) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, puppeteer_1.default.launch({
                                headless: !this.isDebug,
                                devtools: this.isDebug,
                                slowMo: 5,
                            })];
                    case 1:
                        _a.browser = _b.sent();
                        return [4 /*yield*/, this.browser.newPage()];
                    case 2:
                        page = _b.sent();
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 8, , 9]);
                        if (!extraHTTPHeaders) return [3 /*break*/, 5];
                        return [4 /*yield*/, page.setExtraHTTPHeaders(extraHTTPHeaders)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        if (!emulateOpts) {
                            emulateOpts = puppeteer_1.default.devices["iPhone 6"];
                        }
                        return [4 /*yield*/, page.emulate(emulateOpts)];
                    case 6:
                        _b.sent();
                        // networkidle0 waits for the network to be idle (no requests for 2 * 60 * 1000ms).
                        return [4 /*yield*/, page.goto(url, {
                                timeout: 2 * 60 * 1000,
                                waitUntil: "networkidle0",
                            })];
                    case 7:
                        // networkidle0 waits for the network to be idle (no requests for 2 * 60 * 1000ms).
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_1 = _b.sent();
                        console.error(e_1.message);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, page];
                }
            });
        });
    };
    PuppeteerBrowser.prototype.close = function () {
        var _a;
        (_a = this.browser) === null || _a === void 0 ? void 0 : _a.close();
    };
    return PuppeteerBrowser;
}());
exports.PuppeteerBrowser = PuppeteerBrowser;
