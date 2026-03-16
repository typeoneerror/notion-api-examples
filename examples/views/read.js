/**
 * Arguments:
 *
 * --view-id: ID of the view to retrieve
 */

const notionAPI = require('../shared/notion-api');
const { log } = require('../shared/utils');
const { yargs } = require('../shared');

const viewId = '3101c1cce3f3804d8481000c37e852fa';

const argv = yargs.option('viewId', {
  alias: 'v',
  default: viewId,
}).argv;

(async () => {
  const { data: view } = await notionAPI.get(`/views/${argv.viewId}`);

  log(view);
})();
