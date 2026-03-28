/**
 * Updates a view's name, sorts, and grouping configuration.
 *
 * Arguments:
 *
 * --view-id: ID of the view to update
 */

const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const viewId = 'e40b1aba33a04d0095731e38f7f41c4f';

const argv = yargs.option('viewId', {
  alias: 'v',
  default: viewId,
}).argv;

(async () => {
  const view = await notion.views.update({
    view_id: argv.viewId,
    name: 'Updated View',
    sorts: [
      {
        property: 'Date',
        direction: 'ascending',
      },
    ],
    configuration: {
      type: 'table',
      group_by: {
        type: 'person',
        property_id: '<ji~',
        sort: {
          type: 'ascending',
        },
      },
    },
  });

  log(view);
})();
