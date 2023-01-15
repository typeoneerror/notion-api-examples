/**
 * Add standard "advanced" properties to a database.
 *
 * Arguments:
 *
 * --database-id: ID of the property to fetch
 * --[no-]watched-by: whether to create a "Watched by" Person property
 *                    (default or --watched-by) or not (--no-watched-by)
 */

const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const databaseId = '5bdcff6258b246788536d5c642b2fe55';
const argv = yargs.boolean('watched-by').default({ databaseId, watchedBy: true }).argv;

(async () => {
  let properties = argv.watchedBy ? { 'Watched by': { person: {} } } : {};

  properties = {
    ...properties,
    'Created by': { created_by: {} },
    'Created at': { created_time: {} },
    'Updated by': { last_edited_by: {} },
    'Updated at': { last_edited_time: {} },
  };

  const params = {
    database_id: argv.databaseId,
    properties,
  };

  await notion.databases.retrieve({ database_id: argv.databaseId });

  const database = await notion.databases.update(params);

  log(database);
})();
