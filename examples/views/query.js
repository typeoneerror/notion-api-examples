/**
 * Queries a view by ID.
 *
 * Arguments:
 *
 * --view-id: ID of the view to query.
 */

const { log } = require('../shared/utils');
const { notion, yargs } = require('../shared');

const viewId = 'e40b1aba33a04d0095731e38f7f41c4f';

const argv = yargs.option('viewId', {
  alias: 'v',
  default: viewId,
}).argv;

(async () => {
  // FIXME: total_count always null?
  const query = await notion.views.queries.create({
    view_id: argv.viewId,
  });

  log(query);

  // TODO: paginate like fetch-pages.js (to abstract)
  // const results = await notion.views.queries.results({
  //   view_id: argv.viewId,
  //   query_id: query.id,
  //   start_cursor: query.next_cursor,
  //   page_size: 50,
  // });

  // This endpoint is idempotent — calling it on an already-deleted or expired query still returns success.
  await notion.views.queries.delete({
    view_id: argv.viewId,
    query_id: query.id,
  });
})();
