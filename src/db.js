const datastore = require("nedb");
const path = require("path");
const db = new datastore({
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
module.exports = DB;
