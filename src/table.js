const cli_table = require("cli-table");
const chalk = require("chalk");

const table = new cli_table({
  head: ["Template name", "Owner", "Branch", "From"],
  style: {
    head: ["green"],
  },
});

module.exports = (tplList, lyric, autoExit) => {
  if (autoExit === void 0) {
    autoExit = true;
  }
  tplList.forEach(function (tpl) {
    var name = tpl.name,
      path = tpl.path,
      branch = tpl.branch,
      from = tpl.from;
    table.push([name, path, branch, from]);
    if (table.length === tplList.length) {
      console.log(table.toString());
      if (lyric) {
        console.log(chalk.green("\u2714 " + lyric));
      }
      autoExit && process.exit();
    }
  });
};
