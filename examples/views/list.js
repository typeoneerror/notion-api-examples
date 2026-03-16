/**
 * Arguments:
 *
 * --database-id: ID of the database to list views of
 */

const notionAPI = require('../shared/notion-api');
const { log } = require('../shared/utils');
const { yargs } = require('../shared');

const databaseId = '3101c1cce3f380b2afa2dd5e35566bd2';

const argv = yargs.option('databaseId', {
  alias: 'd',
  default: databaseId,
}).argv;

(async () => {
  const { data: views } = await notionAPI.get('/views', {
    params: { database_id: argv.databaseId },
  });

  log(views);
})();
