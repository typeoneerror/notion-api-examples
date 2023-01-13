/**
 * Arguments:
 *
 * --database-id: ID of the page to fetch
 */

const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');

const databaseId = '87a5721f46b146dca5b3bddf414e9f00';
const argv = yargs.default({ databaseId }).argv;

(async () => {
  const db = await notion.databases.retrieve({
    database_id: argv.databaseId,
  });

  log(db);
})();
