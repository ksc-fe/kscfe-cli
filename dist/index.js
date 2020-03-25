'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var inquirer = _interopDefault(require('inquirer'));
var nedb = _interopDefault(require('nedb'));
var path = _interopDefault(require('path'));
var cliTable = _interopDefault(require('cli-table'));
var chalk = _interopDefault(require('chalk'));
var ora = _interopDefault(require('ora'));
var downloadGitRepo = _interopDefault(require('download-git-repo'));
var ncp$1 = _interopDefault(require('ncp'));

const db = new nedb({
  filename: path.resolve(__dirname, "./db"),
  autoload: true
});
let DB = /** @class */ (function() {
  function DB() {}
  DB.find = function(condition) {
    return new Promise(function(resolve, reject) {
      db.find(null, condition, function(err, docs) {
        if (err) reject(err);
        resolve(docs);
      });
    });
  };
  DB.insert = function(doc) {
    return new Promise(function(resolve, reject) {
      db.insert(doc, function(err, newDoc) {
        if (err) reject(err);
        resolve(newDoc);
      });
    });
  };
  DB.remove = function(condition) {
    return new Promise(function(resolve, reject) {
      db.remove(condition, function(err, newDoc) {
        if (err) reject(err);
        resolve(newDoc);
      });
    });
  };
  return DB;
})();
var db_1 = DB;

const table = new cliTable({
  head: ["Project name", "Owner", "Branch", "From"],
  style: {
    head: ["green"]
  }
});

var table_1 = (tplList, lyric, autoExit) => {
  if (autoExit === void 0) {
    autoExit = true;
  }
  tplList.forEach(function(tpl) {
    var name = tpl.name,
      path = tpl.path,
      branch = tpl.branch,
      from = tpl.from;
    table.push([name, path, branch, from]);
    if (table.length === tplList.length) {
      console.log(table.toString());
      if (lyric) {
        console.log(chalk["default"].green("\u2714 " + lyric));
      }
      autoExit && process.exit();
    }
  });
};

const prompt = inquirer.prompt;



async function addTemplate() {
  const tplList = await db_1.find({});

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
      await db_1.insert(template);
      const newList = await db_1.find({});
      table_1(newList, "模版名称创建成功!");
    }
  );
}

var add = addTemplate;

async function listTemplates() {
  const tplList = await db_1.find({});

  table_1(tplList, "");
}

var list = listTemplates;

const prompt$1 = inquirer.prompt;



async function deleteTemplate() {
  const tplList = await db_1.find({});

  const questions = [
    {
      type: "rawlist",
      name: "name",
      message: "选择删除的模板:",
      choices: () =>
        tplList.map(tpl => {
          return {
            name: tpl.name,
            value: tpl.name
          };
        })
    }
  ];

  prompt$1(questions).then(async ({ name }) => {
    await db_1.remove({ name });
    const newList = await db_1.find({});
    table_1(newList, "模板删除成功!");
  });
}

var _delete = deleteTemplate;

const ncp = ncp$1.ncp;
let spinner = ora("Downloading template...");

let doDownload = function(from, dist) {
  spinner = ora("Downloading template..." + from).start();

  return new Promise(function(resolve, reject) {
    downloadGitRepo(from, dist, function(err) {
      spinner.stop();
      if (err) {
        console.log("download error: ", err);
        reject({
          status: 0,
          msg: err
        });
      }
      resolve({
        status: 1,
        msg: "新项目成功创建! 位于目录 \n" + dist
      });
    });
  });
};

const doCopy = (from, dist) => {
  spinner.start();
  return new Promise((resolve, reject) => {
    ncp(from, dist, err => {
      if (err) {
        reject({
          status: 0,
          msg: err
        });
      }
      spinner.stop();
      resolve({
        status: 1,
        msg: `新项目成功创建! 位于目录 \n \n${dist}`
      });
    });
  });
};

let initiator = async function(download) {
  let path = download.path,
    branch = download.branch,
    from = download.from,
    dist = download.dist;
  let dlFrom = "";
  let result = {};
  if (from === "GitHub" || from === "GitLab" || from === "Bitbucket") {
    dlFrom = from.toLocaleLowerCase() + ":" + path + "#" + branch;
    result = await doDownload(dlFrom, dist);
  } else if (from.startsWith("http")) {
    dlFrom = "direct:" + from;
    result = doDownload(dlFrom, dist);
  } else {
    dlFrom = "others:" + from;
    result = doCopy(dlFrom.replace("others:", ""), dist);
  }
  console.log(result.status ? chalk.green(result.msg) : chalk.red(result.msg));
};

var initiator_1 = initiator;

const prompt$2 = inquirer.prompt;




async function initTemplate() {
  const tplList = await db_1.find({});
  table_1(tplList, "", false);

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

  prompt$2(questions).then(async ({ tplName, project }) => {
    const tpl = tplList.filter(({ name }) => name === tplName)[0];
    const { path, branch, from } = tpl;
    const pwd = process.cwd();
    initiator_1({ path, branch, from, dist: `${pwd}/${project}` });
  });
}

var init = initTemplate;

var commands = { add, list, del: _delete, init };
var commands_1 = commands.add;
var commands_2 = commands.list;
var commands_3 = commands.del;
var commands_4 = commands.init;

exports.add = commands_1;
exports.default = commands;
exports.del = commands_3;
exports.init = commands_4;
exports.list = commands_2;
