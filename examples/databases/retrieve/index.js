/**
 * Arguments:
 *
 * --database-id: ID of the database to fetch
 */

const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');

const databaseId = '1e7abab87ee8457799c1155cf69d502a';
const argv = yargs.default({ databaseId }).argv;

(async () => {
  const db = await notion.databases.retrieve({
    database_id: argv.databaseId,
  });

  log(db);
})();
