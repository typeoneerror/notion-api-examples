/**
 * Arguments:
 *
 * --data-source-id: ID of the data source to fetch
 */

const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');

const dataSourceId = '45808fcd2698412a97df10e19c36cc21';
const argv = yargs.option('dataSourceId', {
  alias: 'd',
  describe: 'The ID of the data source to create the page in',
  default: dataSourceId,
}).argv;

(async () => {
  const ds = await notion.dataSources.retrieve({
    data_source_id: argv.dataSourceId,
  });

  log(ds);
})();
