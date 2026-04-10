/**
 * Lists all views for a specified database.
 *
 * Arguments:
 *
 * --database-id: ID of the database to list views of
 */

const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const databaseId = 'a48377a8442142f19d7ef89211fce07d';

const argv = yargs.option('databaseId', {
  alias: 'd',
  default: databaseId,
}).argv;

(async () => {
  const views = await notion.views.list({
    database_id: argv.databaseId,
  });

  log(views);
})();
