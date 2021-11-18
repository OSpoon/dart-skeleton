interface Attribute {
  name: string;
  type: string;
  value: string;
}

interface ClassProps {
  position: string;
  zIndex: number;
  background?: string;
  animation?: string;
}

interface Rect {
  t: number;
  l: number;
  w: number;
  h: number;
}

interface OriginStyle {
  scrollTop: number;
  bodyOverflow: string;
}

interface Header {
  height: number;
  background: string;
}

interface Options {
  init?: Function;
  includeElement?: Function;
  background?: string;
  animation?: string;
  header?: Header | undefined;
  offsetTop?: number;
}

interface DrawBlock {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  zIndex?: number;
  background?: string;
  radius?: string;
  subClas?: boolean;
}

const WIN_W = window.innerWidth;
const WIN_H = window.innerHeight;

const ELEMENTS = [
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

const DEFAULT_ANIMATION = "opacity 1.5s linear infinite";
const DEFAULT_BACKGROUND = "#ecf0f2;";
const DEFAULT_POSITION = "fixed";
const DEFAULT_ZINDEX = 999;

const _eval = eval;

const classProps: ClassProps = {
  position: DEFAULT_POSITION,
  zIndex: DEFAULT_ZINDEX,
};

/**
 * 获取节点的指定属性的值
 * Node.nodeType ELEMENT_NODE=1
 * @param {*} node
 * @param {*} attr
 * @returns
 */
function getStyle(node: Element, attr: string): string {
  let value = "";
  if (node.nodeType === 1) {
    value = window.getComputedStyle(node).getPropertyValue(attr);
  }
  return value;
}

/**
 * 计算百分比
 * @param {*} total
 * @param {*} x
 * @returns
 */
function percent(total: number, x: number): number {
  return Number(parseFloat(`${x / total * 100}`).toFixed(3));
}

/**
 * 是否隐藏节点
 * @param {*} node
 * @returns
 */
function isHideStyle(node: HTMLElement) {
  const isNone = getStyle(node, "display") === "none";
  const isHidden = getStyle(node, "visibility") === "hidden";
  const isNoOpacity = Number(getStyle(node, "opacity")) === 0;
  return isNone || isHidden || isNoOpacity || node.hidden;
}

function includeElement(elements: string[], node: HTMLElement) {
  return ~elements.indexOf((node.tagName || "").toLowerCase());
}

function isCustomCardBlock(node: HTMLElement) {
  const bgStyle = getStyle(node, "background");
  const bgColorReg = /rgba\([\s\S]+?0\)/gi;
  const bdReg = /(0px)|(none)/;
  const hasBgColor = !bgColorReg.test(bgStyle) || ~bgStyle.indexOf("gradient");
  const hasNoBorder = ["top", "left", "right", "bottom"].some((item) => {
    return bdReg.test(getStyle(node, "border-" + item).toString());
  });
  const { w, h } = getRect(node);
  const customCardBlock = !!(
    hasBgColor &&
    (!hasNoBorder || getStyle(node, "box-shadow") != "none") &&
    w > 0 &&
    h > 0 &&
    w < 0.95 * WIN_W &&
    h < 0.3 * WIN_H
  );
  return customCardBlock;
}

/**
 * 获取元素的上下距离和宽高
 * @param {*} node
 * @returns
 */
function getRect(node: HTMLElement): Rect {
  if (!node) return { t: 0, l: 0, w: 0, h: 0 };
  const { top: t, left: l, width: w, height: h } = node.getBoundingClientRect();
  return { t, l, w, h };
}

/**
 * 获取元素的padding
 * @param {*} node
 * @returns
 */
function getPadding(node: HTMLElement) {
  return {
    paddingTop: parseInt(getStyle(node, "padding-top")),
    paddingLeft: parseInt(getStyle(node, "padding-left")),
    paddingBottom: parseInt(getStyle(node, "padding-bottom")),
    paddingRight: parseInt(getStyle(node, "padding-right")),
  };
}

class DrawPageframe {
  rootNode = document.body;
  blocks: string[] = [];
  originStyle: OriginStyle = {
    scrollTop: 0,
    bodyOverflow: "",
  };
  background: string;
  animation: string;
  header: Header | undefined;
  offsetTop: number;
  init: Function;
  includeElement: Function;

  constructor(opts: Options) {
    this.init = opts.init || function () { };
    this.includeElement = opts.includeElement || function () { };
    this.background = opts?.background || DEFAULT_BACKGROUND;
    this.animation = opts?.animation || DEFAULT_ANIMATION;
    this.header = opts?.header;
    this.offsetTop = opts.offsetTop || 0;
    this.initClassProps();
  }

  initClassProps() {
    classProps.background = this.background;
    classProps.animation = this.animation;
    const inlineStyle = ["<style>._{"];
    for (let prop in classProps) {
      inlineStyle.push(
        `${prop === "zIndex" ? "z-index" : prop}:${Reflect.get(
          classProps,
          prop
        )};`
      );
    }
    inlineStyle.push("}.__{top:0%;left:0%;width:100%;}</style>");
    this.blocks.push(inlineStyle.join(""));
  }

  resetDOM() {
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
    this.withHeader();
  }

  inHeader(node: HTMLElement) {
    if (this.header) {
      const height = parseInt(`${this.header.height}`);
      const { t } = getRect(node);
      return t <= height;
    }
  }

  withHeader() {
    if (this.header) {
      const { height, background } = this.header;
      const hHeight = parseInt(`${height}`);
      const hBackground = background || this.background;
      this.drawBlock({
        height: percent(WIN_H, hHeight),
        zIndex: 999,
        background: hBackground,
        subClas: true,
      });
    }
  }

  showBlocks() {
    if (this.blocks.length) {
      const { body } = document;
      const blocksHTML = this.blocks.join("");
      const div = document.createElement("div");
      div.innerHTML = blocksHTML;
      body.appendChild(div);
      window.scrollTo(0, this.originStyle.scrollTop);
      document.body.style.overflow = this.originStyle.bodyOverflow;
      return blocksHTML;
    }
  }

  startDraw() {
    this.resetDOM();
    // body NodeList
    const nodes = this.rootNode.childNodes;

    const deepFindNode = (nodes: string | any[] | NodeListOf<ChildNode>) => {
      if (nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          let childNodes = node.childNodes;

          // 不进行绘制的元素
          const { isHideNode, isCustomSkip } = this.skipNode(node);
          if (isHideNode || isCustomSkip) continue;

          // 需要绘制的元素
          // 1. 元素设置了背景图,即使内容空也绘制
          let background = getStyle(node, "background-image");
          let backgroundHasurl = background.match(/url\(.+?\)/);
          const hasBgUrl = backgroundHasurl && backgroundHasurl.length;
          // 2. 子元素遍历后有文本元素且有内容就绘制
          let hasChildText = false;
          for (let j = 0; j < childNodes.length; j++) {
            // Node.nodeType TEXT_NODE=3 有文本内容存在就需要绘制
            if (
              childNodes[j].nodeType === 3 &&
              childNodes[j].textContent.trim().length
            ) {
              hasChildText = true;
              break;
            }
          }
          // 3. 本身元素为文本的且有内容
          const hasText = node.nodeType === 3 && node.textContent.trim().length;
          // 4. 当设置头时,元素被头覆盖了,那么就跳过不绘制了
          const inHEAD = this.inHeader(node);
          // TODO 存疑
          const includeEle = includeElement(ELEMENTS, node);
          const isCCB = isCustomCardBlock(node);
          if (
            (includeEle || hasBgUrl || hasText || hasChildText || isCCB) &&
            !inHEAD
          ) {
            // top left width high
            const { t, l, w, h } = getRect(node);
            if (
              w > 0 &&
              h > 0 &&
              l >= 0 &&
              l < WIN_W &&
              WIN_H - t >= 20 &&
              t >= 0
            ) {
              const { paddingTop, paddingLeft, paddingBottom, paddingRight } =
                getPadding(node);
              const radius = getStyle(node, "border-radius");
              // 绘制色块
              this.drawBlock({
                width: percent(WIN_W, w - paddingLeft - paddingRight),
                height: percent(WIN_H, h - paddingTop - paddingBottom),
                top: percent(WIN_H, t + paddingTop),
                left: percent(WIN_W, l + paddingLeft),
                radius: radius,
              });
            }
          } else if (childNodes && childNodes.length) {
            if (!hasChildText) {
              deepFindNode(childNodes);
            }
          }
        }
      }
    };

    deepFindNode(nodes);
    return this.showBlocks();
  }

  private skipNode(node: any) {
    const isHideNode = isHideStyle(node);
    // 自定义跳过的元素
    const isCustomSkip =
      typeof this.includeElement === "function" &&
      this.includeElement(node, this.drawBlock) == false;
    return { isHideNode, isCustomSkip };
  }

  /**
   * 绘制元素块
   * @param {*} param0
   */
  drawBlock({
    width,
    height,
    top,
    left,
    zIndex = 999,
    background = this.background,
    radius,
    subClas = false,
  }: DrawBlock) {
    const styles = ["height:" + height + "%"];
    if (!subClas) {
      styles.push(
        "top:" + top + "%",
        "left:" + left + "%",
        "width:" + width + "%"
      );
    }
    if (classProps.zIndex !== zIndex) {
      styles.push("z-index:" + zIndex);
    }
    if (classProps.background !== background) {
      styles.push("background:" + background);
    }
    radius && radius != "0px" && styles.push("border-radius:" + radius);
    this.blocks.push(
      `<div class="_${subClas ? " __" : ""}" style="${styles.join(";")}"></div>`
    );
  }
}

function parseAgrs(attrs: Attribute[]) {
  let params = {};
  attrs.forEach(({ name, type, value }) => {
    const v =
      type === "function"
        ? _eval("(" + value + ")")
        : type === "object"
          ? JSON.parse(value)
          : value;
    Reflect.set(params, name, v);
  });
  return params;
}

// @ts-ignore
window.evalDOMScripts = (...args: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const html = new DrawPageframe(parseAgrs(args)).startDraw();
        resolve(html);
      } catch (e) {
        reject(e);
      }
    }, 1000);
  });
};
