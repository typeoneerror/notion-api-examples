/**
 * Deletes a specified view by its ID.
 *
 * Arguments:
 *
 * --view-id: ID of the view to delete
 */

const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const viewId = '3101c1cce3f3804d8481000c37e852fa';

const argv = yargs.option('viewId', {
  alias: 'v',
  default: viewId,
}).argv;

(async () => {
  const view = await notion.views.delete({
    view_id: argv.viewId,
  });

  log(view);
})();
