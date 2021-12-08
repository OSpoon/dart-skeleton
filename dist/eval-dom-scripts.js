"use strict";
var WIN_WIDTH = window.innerWidth;
var WIN_HEIGHT = window.innerHeight;
var ELEMENTS = [
    "audio",
    "button",
    "canvas",
    "code",
    "img",
    "input",
    "pre",
    "svg",
    "textarea",
    "video",
    "xmp",
];
var DEFAULT_ANIMATION = "opacity 1.5s linear infinite";
var DEFAULT_BACKGROUND = "#ecf0f2;";
var DEFAULT_POSITION = "fixed";
var DEFAULT_ZINDEX = 999;
var _eval = eval;
var classProps = {
    position: DEFAULT_POSITION,
    zIndex: DEFAULT_ZINDEX,
};
/**
 * 解析入参数组为对象格式
 * @param attrs
 * @returns
 */
function parseAgrs(attrs) {
    var params = {};
    attrs.forEach(function (_a) {
        var name = _a.name, type = _a.type, value = _a.value;
        var v = type === "function"
            ? _eval("(" + value + ")")
            : type === "object"
                ? JSON.parse(value)
                : value;
        Reflect.set(params, name, v);
    });
    return params;
}
/**
 * 计算百分比
 * @param {*} total
 * @param {*} x
 * @returns
 */
function percent(total, x) {
    return Number(parseFloat("" + (x / total) * 100).toFixed(3));
}
/**
 * 当前节点是否在给定列表中包含
 * @param elements
 * @param node
 * @returns
 */
function includeElement(elements, node) {
    return ~elements.indexOf((node.tagName || "").toLowerCase());
}
/**
 * 获取节点的指定属性的值
 * Node.nodeType ELEMENT_NODE=1
 * @param {*} node
 * @param {*} attr
 * @returns
 */
function getStyle(node, attr) {
    var value = "";
    if (node.nodeType === 1) {
        value = window.getComputedStyle(node).getPropertyValue(attr);
    }
    return value;
}
/**
 * 是否隐藏节点
 * @param {*} node
 * @returns
 */
function isHideStyle(node) {
    var isNone = getStyle(node, "display") === "none";
    var isHidden = getStyle(node, "visibility") === "hidden";
    var isNoOpacity = Number(getStyle(node, "opacity")) === 0;
    return isNone || isHidden || isNoOpacity || node.hidden;
}
/**
 * 有背景色且有四边框或设置阴影的需要绘制
 * @param node
 * @returns
 */
function isCustomCardBlock(node) {
    // 设置rgba的时候alpha不为0
    // 不存在渐变内容
    var bgStyle = getStyle(node, "background");
    var bgColorReg = /rgba\([\s\S]+?0\)/gi;
    var hasBgColor = !bgColorReg.test(bgStyle) || ~bgStyle.indexOf("gradient");
    // 检查border的四边是否有0像素或none的情况,四边都有值的时候绘制
    var bdReg = /(0px)|(none)/;
    var hasNoBorder = ["top", "left", "right", "bottom"].some(function (item) {
        return bdReg.test(getStyle(node, "border-" + item).toString());
    });
    // 存在阴影的情况需要绘制
    var hasBoxShadow = getStyle(node, "box-shadow") != "none";
    var _a = getRect(node), w = _a.w, h = _a.h;
    // !!: !=null && !=undefined && !=''
    var customCardBlock = !!(hasBgColor &&
        (!hasNoBorder || hasBoxShadow) &&
        w > 0 &&
        h > 0 &&
        // 最大宽高设上限,避免尺寸过大绘制效果差
        w < 0.95 * WIN_WIDTH &&
        h < 0.3 * WIN_HEIGHT);
    // 返回true需要绘制
    return customCardBlock;
}
/**
 * 获取元素的上下距离和宽高
 * @param {*} node
 * @returns
 */
function getRect(node) {
    if (!node)
        return { t: 0, l: 0, w: 0, h: 0 };
    var _a = node.getBoundingClientRect(), t = _a.top, l = _a.left, w = _a.width, h = _a.height;
    return { t: t, l: l, w: w, h: h };
}
/**
 * 获取元素的padding
 * @param {*} node
 * @returns
 */
function getPadding(node) {
    return {
        paddingTop: parseInt(getStyle(node, "padding-top")),
        paddingLeft: parseInt(getStyle(node, "padding-left")),
        paddingBottom: parseInt(getStyle(node, "padding-bottom")),
        paddingRight: parseInt(getStyle(node, "padding-right")),
    };
}
var DrawPageFrame = /** @class */ (function () {
    function DrawPageFrame(opts) {
        this.rootNode = document.body;
        this.blocks = [];
        this.originStyle = {
            scrollTop: 0,
            bodyOverflow: "",
        };
        this.init = opts.init || function () { };
        this.includeElement = opts.includeElement || function () { };
        this.background = (opts === null || opts === void 0 ? void 0 : opts.background) || DEFAULT_BACKGROUND;
        this.animation = (opts === null || opts === void 0 ? void 0 : opts.animation) || DEFAULT_ANIMATION;
        this.header = opts === null || opts === void 0 ? void 0 : opts.header;
        this.offsetTop = opts.offsetTop || 0;
        this.initClassProps();
    }
    DrawPageFrame.prototype.initClassProps = function () {
        classProps.background = this.background;
        classProps.animation = this.animation;
        var inlineStyle = ["<style>._{"];
        for (var prop in classProps) {
            inlineStyle.push((prop === "zIndex" ? "z-index" : prop) + ":" + Reflect.get(classProps, prop) + ";");
        }
        inlineStyle.push("}.__{top:0%;left:0%;width:100%;}</style>");
        this.blocks.push(inlineStyle.join(""));
    };
    DrawPageFrame.prototype.startDraw = function () {
        var _this = this;
        this.resetDOM();
        // body NodeList
        var nodes = this.rootNode.childNodes;
        var deepTraverseNode = function (nodes) {
            if (nodes.length) {
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    var childNodes = node.childNodes;
                    // 不进行绘制的元素
                    var isHideNode = isHideStyle(node);
                    // 自定义跳过的元素
                    var isCustomSkip = typeof _this.includeElement === "function" &&
                        _this.includeElement(node, _this.drawBlock) == false;
                    if (isHideNode || isCustomSkip)
                        continue;
                    // 需要绘制的元素
                    // 1. 元素设置了背景图,即使内容空也绘制
                    var background = getStyle(node, "background-image");
                    var backgroundHasurl = background.match(/url\(.+?\)/);
                    var _hasBackgroundHasurl = backgroundHasurl && backgroundHasurl.length;
                    // 2. 子元素遍历后有文本元素且有内容就绘制
                    var hasChildText = false;
                    for (var j = 0; j < childNodes.length; j++) {
                        // Node.nodeType TEXT_NODE=3 有文本内容存在就需要绘制
                        if (childNodes[j].nodeType === 3 &&
                            childNodes[j].textContent.trim().length) {
                            hasChildText = true;
                            break;
                        }
                    }
                    // 3. 本身元素为文本的且有内容
                    var hasText = node.nodeType === 3 && node.textContent.trim().length;
                    // 4. 当设置头时,元素被头覆盖了,那么就跳过不绘制了
                    var _inHeader = _this.inHeader(node);
                    // 5. 在特殊元素列表指定的需要绘制
                    var _includeElement = includeElement(ELEMENTS, node);
                    // 存疑
                    var _isCustomCardBlock = isCustomCardBlock(node);
                    if ((_includeElement ||
                        _hasBackgroundHasurl ||
                        hasText ||
                        hasChildText ||
                        _isCustomCardBlock) &&
                        !_inHeader) {
                        // top left width high
                        var _a = getRect(node), t = _a.t, l = _a.l, w = _a.w, h = _a.h;
                        if (w > 0 &&
                            h > 0 &&
                            l >= 0 &&
                            t >= 0 &&
                            l < WIN_WIDTH &&
                            WIN_HEIGHT - t >= 20) {
                            var _b = getPadding(node), paddingTop = _b.paddingTop, paddingLeft = _b.paddingLeft, paddingBottom = _b.paddingBottom, paddingRight = _b.paddingRight;
                            var radius = getStyle(node, "border-radius");
                            // 绘制色块
                            _this.drawBlock({
                                width: percent(WIN_WIDTH, w - paddingLeft - paddingRight),
                                height: percent(WIN_HEIGHT, h - paddingTop - paddingBottom),
                                top: percent(WIN_HEIGHT, t + paddingTop),
                                left: percent(WIN_WIDTH, l + paddingLeft),
                                radius: radius,
                            });
                        }
                    }
                    // 存在子节点的情况下要进行递归遍历,当前节点为文本类型的跳过
                    if (childNodes && childNodes.length) {
                        if (!hasChildText) {
                            deepTraverseNode(childNodes);
                        }
                    }
                }
            }
        };
        // 遍历Node节点进行处理
        deepTraverseNode(nodes);
        return this.showBlocks();
    };
    DrawPageFrame.prototype.resetDOM = function () {
        this.init && this.init();
        this.originStyle = {
            scrollTop: window.scrollY,
            bodyOverflow: getStyle(document.body, "overflow"),
        };
        window.scrollTo(0, this.offsetTop);
        document.body.style.cssText += "overflow:hidden!important;";
        this.drawBlock({
            height: 100,
            zIndex: 990,
            background: "#fff",
            subClas: true,
        });
        if (this.header) {
            this.withHeader();
        }
    };
    DrawPageFrame.prototype.inHeader = function (node) {
        if (this.header) {
            var height = parseInt("" + this.header.height);
            var t = getRect(node).t;
            return t <= height;
        }
    };
    DrawPageFrame.prototype.withHeader = function () {
        var _a = this.header, height = _a.height, background = _a.background;
        var hHeight = parseInt("" + height);
        var hBackground = background || this.background;
        this.drawBlock({
            height: percent(WIN_HEIGHT, hHeight),
            zIndex: 999,
            background: hBackground,
            subClas: true,
        });
    };
    /**
     * 绘制元素块
     * @param {*} param0
     */
    DrawPageFrame.prototype.drawBlock = function (_a) {
        var width = _a.width, height = _a.height, top = _a.top, left = _a.left, _b = _a.zIndex, zIndex = _b === void 0 ? 999 : _b, _c = _a.background, background = _c === void 0 ? this.background : _c, radius = _a.radius, _d = _a.subClas, subClas = _d === void 0 ? false : _d;
        var styles = ["height:" + height + "%"];
        if (!subClas) {
            styles.push("top:" + top + "%", "left:" + left + "%", "width:" + width + "%");
        }
        if (classProps.zIndex !== zIndex) {
            styles.push("z-index:" + zIndex);
        }
        if (classProps.background !== background) {
            styles.push("background:" + background);
        }
        radius && radius != "0px" && styles.push("border-radius:" + radius);
        this.blocks.push("<div class=\"_" + (subClas ? " __" : "") + "\" style=\"" + styles.join(";") + "\"></div>");
    };
    /**
     * 将片段直接注入当前网页的body节点下进行预览
     * @returns
     */
    DrawPageFrame.prototype.showBlocks = function () {
        var body = document.body;
        var blocksHTML = this.blocks.join("");
        var div = document.createElement("div");
        div.innerHTML = blocksHTML;
        body.appendChild(div);
        window.scrollTo(0, this.originStyle.scrollTop);
        document.body.style.overflow = this.originStyle.bodyOverflow;
        return blocksHTML;
    };
    return DrawPageFrame;
}());
/**
 * 启动脚本函数,挂载到window便于调用
 * @param args
 * @returns
 */
// @ts-ignore
window.evalDOMScripts = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            try {
                var html = new DrawPageFrame(parseAgrs(args)).startDraw();
                resolve(html);
            }
            catch (e) {
                reject(e);
            }
        }, 1000);
    });
};
// 可以在浏览器中单独运行预览
// window.evalDOMScripts().then((res) => console.log(res));
