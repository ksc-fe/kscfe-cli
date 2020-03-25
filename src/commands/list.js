const DB = require("../db");
const listTable = require("../table");

async function listTemplates() {
  const tplList = await DB.find({});

  listTable(tplList, "");
}

module.exports = listTemplates;
