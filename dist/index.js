'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var inquirer = _interopDefault(require('inquirer'));
var nedb = _interopDefault(require('nedb'));
var path = _interopDefault(require('path'));
var cliTable = _interopDefault(require('cli-table'));
var chalk = _interopDefault(require('chalk'));
var ora = _interopDefault(require('ora'));
require('download-git-repo');
var ncp$1 = _interopDefault(require('ncp'));
var child_process = _interopDefault(require('child_process'));

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
  head: ["项目名称", "创建人/Owner", "分支", "来源"],
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
      message: "Set the custom name of the template:",
      validate(val) {
        let result = true;
        if (!val) {
          result = "Template name cannot be empty.";
        } else if (tplList.some(({ name }) => name === val)) {
          result = `Template with name "${val}" is exist.`;
        }
        return result;
      }
    },
    {
      type: "list",
      name: "from",
      message: "Where is the template from?",
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
      message: "Owner/name of the template:",
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
      message: "Branch of the template:",
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
      table_1(newList, "New template has been added successfully!");
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
      message: "Select a template to delete:",
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
    table_1(newList, "New templates has been updated successfully!");
  });
}

var _delete = deleteTemplate;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

const ncp = ncp$1.ncp;
const spinner = ora("Downloading template...");
const exec = child_process.exec;

var __awaiter =
  (commonjsGlobal && commonjsGlobal.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (commonjsGlobal && commonjsGlobal.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };

// let doDownload = function(from, dist) {
//   console.log(from, dist);
//   spinner.start();
//   return new Promise(function(resolve, reject) {
//     download(from, dist, function(err) {
//       if (err) {
//         reject({
//           status: 0,
//           msg: err
//         });
//       }
//       spinner.stop();
//       resolve({
//         status: 1,
//         msg: "新项目成功创建! 位于目录 \n" + dist
//       });
//     });
//   });
// };

let doDownload = function(from, dist) {
  console.log(from, dist);
  spinner.start();
  return new Promise(function(resolve, reject) {
    // git命令，远程拉取项目并自定义项目名
    let cmdStr = `git clone git@newgit.op.ksyun.com:ksc-data-fe/ksc-fe-cli.git && cd ${projectName} && git checkout master`;

    console.log(chalk.white("\n Start generating..."));

    exec(cmdStr, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        reject({
          status: 0,
          msg: err
        });
      }
      spinner.stop();
      console.log(chalk.green("\n √ Generation completed!"));
      console.log(`\n cd ${projectName} && npm install \n`);
      resolve({ status: 1, msg: "新项目成功创建! 位于目录 \n" + dist });

    });
  });
};

let doCopy = function(from, dist) {
  console.log(from, dist);
  spinner.start();
  return new Promise(function(resolve, reject) {
    ncp(from, dist, function(err) {
      if (err) {
        reject({
          status: 0,
          msg: err
        });
      }
      spinner.stop();
      resolve({
        status: 1,
        msg: "新项目成功创建! 位于目录 \n" + dist
      });
    });
  });
};

var initiator = function(Download) {
  var path = Download.path,
    branch = Download.branch,
    from = Download.from,
    dist = Download.dist;
  return __awaiter(void 0, void 0, void 0, function() {
    var dlFrom, result;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          dlFrom = "";
          if (!(from === "GitHub" || from === "GitLab" || from === "Bitbucket"))
            return [3 /*break*/, 2];
          dlFrom = from.toLocaleLowerCase() + ":" + path + "#" + branch;
          return [4 /*yield*/, doDownload(dlFrom, dist)];
        case 1:
          result = _b.sent();
          return [3 /*break*/, 6];
        case 2:
          if (!from.startsWith("http")) return [3 /*break*/, 4];
          dlFrom = "direct:" + from;
          return [4 /*yield*/, doDownload(dlFrom, dist)];
        case 3:
          result = _b.sent();
          return [3 /*break*/, 6];
        case 4:
          dlFrom = "others:" + from;
          return [4 /*yield*/, doCopy(dlFrom.replace("others:", ""), dist)];
        case 5:
          result = _b.sent();
          _b.label = 6;
        case 6:
          console.log(
            result.status
              ? chalk.green(result.msg)
              : chalk.red(result.msg)
          );
          return [2 /*return*/];
      }
    });
  });
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
