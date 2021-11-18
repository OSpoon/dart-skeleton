const { GeneratePageStructure } = require("../dist/generate-page-structure");
const { options } = require("../dart.skeleton.config");

// 执行启动函数
new GeneratePageStructure(options).start();
