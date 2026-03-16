/**
 * Arguments:
 *
 * --data-source-id, -d: ID of the data source to create a view for
 * --database-id, -b: ID of the database to create a top-level view in (optional)
 */

const notionAPI = require('../shared/notion-api');
const { log } = require('../shared/utils');
const { yargs } = require('../shared');

const dataSourceId = '45808fcd-2698-412a-97df-10e19c36cc21';
const databaseId = '3101c1cce3f380b2afa2dd5e35566bd2';

const argv = yargs
  .option('dataSourceId', {
    alias: 'd',
    default: dataSourceId,
  })
  .option('databaseId', {
    alias: 'b',
    default: dataSourceId,
  }).argv;

(async () => {
  const params = {
    data_source_id: argv.dataSourceId,
    name: 'My New View',
    type: 'list',
    // TODO: implement when this endpoint is fixed
    // filter: {
    // },
    // sorts: [
    //   {
    //     property: 'Date',
    //     direction: 'ascending',
    //   },
    // ],
    // configuration: {
    //   type: 'list',
    //   properties: [
    //     {
    //       property_id: 'Status',
    //       visible: true,
    //       status_show_as: 'checkbox',
    //       width: 0,
    //     },
    //   ],
    // },
  };

  // Add database_id if provided for top-level views
  if (argv.databaseId) {
    params.database_id = argv.databaseId;
  }

  // TODO: this is failing, looks like some conflict with the data_source_id and database_id
  // TODO: test again when issues with UUID fixed
  const { data: view } = await notionAPI.post('/views', params);

  log(view);
})();
