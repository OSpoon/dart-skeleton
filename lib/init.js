const path = require("path");
const fs = require("fs");
const prompts = require("prompts");

module.exports = () => {
  const dsConfig = require("./default.config");
  const currDir = process.cwd();
  const optionsFile = path.resolve(currDir, dsConfig.filename);
  if (fs.existsSync(optionsFile)) {
    console.log(
      "[ DS ] >",
      `[${dsConfig.filename}] 已存在，您可以直接创建骨架片段，命令如下：ds start`
    );
    process.exit(0);
  }
  interrogatorResponder().then(({ url, filepath }) => {
    const outputPath = filepath
      ? path.resolve(currDir, filepath).replace(/\\/g, "\\\\")
      : "";
    prompts({
      type: "toggle",
      name: "value",
      message: `你确定要基于${url}创建骨架屏片段吗?\n并将输出到${outputPath}`,
      initial: true,
      active: "Yes",
      inactive: "no",
    }).then((res) => {
      if (res.value) {
        fs.writeFile(
          path.resolve(currDir, dsConfig.filename),
          dsConfig.getTemplate({
            url: url,
            filepath: outputPath,
          }),
          (err) => {
            if (err) throw err;
            console.log(
              "[ DS ] >",
              `[${dsConfig.filename}] 已经创建，您可以直接创建骨架片段了，命令如下：ds start`
            );
          }
        );
      }
    });
  });
};

/**
 * 问答器
 * @returns
 */
function interrogatorResponder() {
  const questions = [
    {
      type: "text",
      name: "url",
      message: "请出入您要生产骨架片段的目标网址？（必填）",
      validate: function (value) {
        const urlReg = /^https?:\/\/.+/gi;
        if (urlReg.test(value)) {
          return true;
        }
        return "请输入有效的网页地址~";
      },
    },
    {
      type: "text",
      name: "filepath",
      message: "请填写骨架片段的输出路径？（可选）",
      validate: function (value) {
        const filepath = path.isAbsolute(value)
          ? value
          : path.join(__dirname, value);
        const exists = fs.existsSync(filepath);
        if (value && !exists) {
          return "请输入已经存在的输出路径~";
        }
        return true;
      },
    },
  ];
  return prompts(questions);
}
