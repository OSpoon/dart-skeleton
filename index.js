const { GeneratePageStructure } = require("./dist/generate-page-structure");

const options = {
  url: "https://m.bilibili.com/",
  output: {
    injectSelector: "#app",
  },
  isDebug: false,
  // 生成骨架屏之前的操作，比如删除干扰节点
  //   init: function () {
  //     document
  //       .querySelectorAll(".launch-app-btn")
  //       .forEach((item) => item.parentNode.removeChild(item));
  //   },
};
new GeneratePageStructure(options).start();
