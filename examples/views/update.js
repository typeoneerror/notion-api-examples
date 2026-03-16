/**
 * Arguments:
 *
 * --view-id: ID of the view to update
 */

const notionAPI = require('../shared/notion-api');
const { log } = require('../shared/utils');
const { yargs } = require('../shared');

const viewId = '3101c1cce3f3804d8481000c37e852fa';

const argv = yargs.option('v', {
  alias: 'viewId',
  default: view,
}).argv;

(async () => {
  const { data: view } = await notionAPI.patch(`/views/${argv.viewId}`, {
    name: 'Todo',
    sorts: [
      {
        property: 'Date',
        direction: 'ascending',
      },
    ],
    configuration: {
      type: 'table',
      // TODO: group_by person not implemented?
      // group_by: {
      //   type: 'person',
      //   id: '%3Cji~',
      //   sort: 'ascending',
      // },
    },
  });

  log(view);
})();
