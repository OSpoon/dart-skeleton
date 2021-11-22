const path = require("path");
const fs = require("fs");
const prompts = require("prompts");

module.exports = () => {
    const dsConfig = require("./default.config");
    const currDir = process.cwd();
    const optionsFile = path.resolve(currDir, dsConfig.filename);
    if (fs.existsSync(optionsFile)) {
        prompts({
            type: "toggle",
            name: "value",
            message: `你确定要删除${optionsFile}配置文件吗?`,
            initial: true,
            active: "no",
            inactive: "Yes",
        }).then((res) => {
            if (!res.value) {
                fs.unlinkSync(optionsFile)
            }
        });
    }
};