/**
 * Add standard "advanced" properties to a data source.
 *
 * Arguments:
 *
 * --data-source-id: ID of the data source to add the properties to
 * --[no-]watched-by: whether to create a "Watched by" Person property
 *                    (default or --watched-by) or not (--no-watched-by)
 */

const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const dataSourceId = 'e50ebeba-8a21-45ef-84b4-d240f31d7428';
const argv = yargs.boolean('watched-by').default({ dataSourceId, watchedBy: true }).argv;

(async () => {
  let properties = argv.watchedBy ? { 'Watched by': { people: {} } } : {};

  properties = {
    ...properties,
    'Created by': { created_by: {} },
    'Created at': { created_time: {} },
    'Updated by': { last_edited_by: {} },
    'Updated at': { last_edited_time: {} },
  };

  const params = {
    data_source_id: argv.dataSourceId,
    properties,
  };

  const database = await notion.dataSources.update(params);

  log(database);
})();
