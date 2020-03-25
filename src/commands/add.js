const prompt = require("inquirer").prompt;
const DB = require("../db");
const listTable = require("../table");

async function addTemplate() {
  const tplList = await DB.find({});

  const questions = [
    {
      type: "input",
      name: "name",
      message: "设置项目模版名称:",
      validate(val) {
        let result = true;
        if (!val) {
          result = "模版名称不能为空.";
        } else if (tplList.some(({ name }) => name === val)) {
          result = `模版名称 "${val}" 已存在.`;
        }
        return result;
      }
    },
    {
      type: "list",
      name: "from",
      message: "模板来源?",
      choices: ["GitHub", "GitLab", "Bitbucket", "Others"]
    },
    {
      type: "input",
      name: "from",
      when: ({ from }) => {
        if (from === "Others") {
          return true;
        }
      },
      filter: val => {
        if (val.startsWith(".")) {
          val = process.cwd() + "/" + val;
        }
        return val;
      }
    },
    {
      type: "input",
      name: "path",
      message: "模版Owner:",
      when: ({ from }) => {
        if (!["GitHub", "GitLab", "Bitbucket"].includes(from)) {
          return false;
        } else {
          return true;
        }
      },
      validate(val) {
        if (val !== "") {
          return true;
        }
        return "Path is required!";
      }
    },
    {
      type: "input",
      name: "branch",
      message: "模版分支:",
      default: "master",
      when: ({ from }) => {
        if (!["GitHub", "GitLab", "Bitbucket"].includes(from)) {
          return false;
        } else {
          return true;
        }
      }
    }
  ];

  prompt(questions).then(
    async ({ name, path = "---", branch = "---", from }) => {
      const template = {
        name,
        path,
        branch,
        from
      };
      await DB.insert(template);
      const newList = await DB.find({});
      listTable(newList, "模版名称创建成功!");
    }
  );
}

module.exports = addTemplate;
