const prompt = require("inquirer").prompt;
const DB = require("../db");
const listTable = require("../table");
const initiator = require("../initiator");

async function initTemplate() {
  const tplList = await DB.find({});
  listTable(tplList, "", false);

  const questions = [
    {
      type: "rawlist",
      name: "tplName",
      message: "Select a template:",
      choices: () =>
        tplList.map(tpl => {
          return {
            name: tpl.name,
            value: tpl.name
          };
        })
    },
    {
      type: "input",
      name: "project",
      message: "Project name:",
      default: lastAnswer => {
        return lastAnswer.tplName;
      }
    }
  ];

  prompt(questions).then(async ({ tplName, project }) => {
    const tpl = tplList.filter(({ name }) => name === tplName)[0];
    const { path, branch, from } = tpl;
    const pwd = process.cwd();
    initiator({ path, branch, from, dist: `${pwd}/${project}` });
  });
}

module.exports = initTemplate;
