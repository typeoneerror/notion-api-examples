/**
 * Arguments:
 *
 * --database-id: ID of the page to fetch
 */

const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');

const databaseId = '7354557becb34d72b6140bb541ac529a';
const argv = yargs.default({ databaseId }).argv;

(async () => {
  const db = await notion.databases.retrieve({
    database_id: argv.databaseId,
  });

  log(db);
})();
