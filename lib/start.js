const path = require("path");
const fs = require("fs");
const { GeneratePageStructure } = require("../dist/generate-page-structure");

module.exports = () => {
  new GeneratePageStructure(getOptions()).start();
};

function getOptions() {
  const dsConfig = require("./default.config");
  const currDir = process.cwd();
  const optionsFile = path.resolve(currDir, dsConfig.filename);
  if (!fs.existsSync(optionsFile)) {
    console.log("[ DS ] >", `请使用命名创建配置文件后使用，命令如下：ds init;`);
    process.exit(0);
  }
  return require(optionsFile);
}
