#!/usr/bin/env node
const program = require("commander");
program.version(require("../package").version);

program
  .command("init")
  .description("初始化dart.skeleton.config配置文件~")
  .action(require("../lib/init"));

program
  .command("start")
  .description("启动为目标页面生成骨架片段~")
  .action(require("../lib/start"));

program
  .command("remove")
  .description("清除init生成的配置文件~")
  .action(require("../lib/remove"));

program.parse(process.argv);
if (program.args.length < 1) {
  program.help();
}
