const chalk = require("chalk");
const ora = require("ora");
const download = require("download-git-repo");
const ncp = require("ncp").ncp;
const spinner = ora("Downloading template...");

let doDownload = function(from, dist) {
  console.log(from, dist);
  spinner.start();
  return new Promise(function(resolve, reject) {
    download(from, dist, function(err) {
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


var initiator = function(download) {
  let path = download.path,
    branch = download.branch,
    from = download.from,
    dist = download.dist;
  if (from === 'GitHub' || from === 'GitLab' || from === 'Bitbucket') {
    dlFrom = from.toLocaleLowerCase() + ':' + path + '#' + branch
    result = await doDownload(dlFrom, dist)
  } else if (from.startsWith('http')) {
    dlFrom = 'direct:' + from
    result = await doDownload(dlFrom, dist)
  } else {
    dlFrom = 'others:' + from
    result = await doCopy(dlFrom.replace('others:', ''), dist)
  }

  console.log(result.status ? chalk.green(result.msg) : chalk.red(result.msg))

};

module.exports = initiator;
