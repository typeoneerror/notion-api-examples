/**
 * Add a simple property to a database
 *
 * Arguments:
 *
 * --data-source-id: ID of the property to add to
 * --name: Name of the property to add
 * --type: Type of the property to add
 */

const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const dataSourceId = 'e50ebeba-8a21-45ef-84b4-d240f31d7428';
const name = 'Watched by';
const type = 'people';
const argv = yargs.default({ dataSourceId, name, type }).argv;

(async () => {
  const params = {
    data_source_id: argv.dataSourceId,
    properties: {
      [argv.name]: {
        type,
        [argv.type]: {},
      },
    },
  };
  const dataSource = await notion.dataSources.update(params);

  log(dataSource);
})();
