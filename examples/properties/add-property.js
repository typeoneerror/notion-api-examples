/**
 * Add a simple property to a database
 *
 * Arguments:
 *
 * --database-id: ID of the property to add to
 * --name: Name of the property to add
 * --type: Type of the property to add
 */

const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const databaseId = '5bdcff6258b246788536d5c642b2fe55';
const name = 'Watched by';
const type = 'people';
const argv = yargs.default({ databaseId, name, type }).argv;

(async () => {
  const params = {
    database_id: argv.databaseId,
    properties: {
      [argv.name]: {
        type,
        [argv.type]: {},
      },
    },
  };

  const database = await notion.databases.update(params);

  log(database);
})();
