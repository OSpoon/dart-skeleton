import { Viewport } from "puppeteer";

export interface Configuration {
  /** 调试模式可输出更多日志信息 */
  isDebug?: boolean;
  /** 待生成骨架屏的页面地址 */
  url: string;
  /** 输出配置 */
  output: {
    /** 生成的骨架屏节点写入的文件 */
    filepath: string;
    /** 骨架屏节点插入的位置 */
    injectSelector: string;
  };
  /** Header配置 */
  header?: {
    /** 主题header的高 */
    height?: number;
    /** 主题header的背景色 */
    background?: string;
  };
  /** 骨架屏主题色 */
  background?: string;
  /** css3动画属性 */
  animation?: string;
  /** 添加请求头 */
  extraHTTPHeaders?: Record<string, string>;
  /** 开始生成之前的操作 */
  init?: Function;
  /** 定制某个节点如何生成 */
  includeElement?: Function;
  /** 设备信息 */
  emulateOpts?: {
    viewport: Viewport;
    userAgent: string;
  };
}
