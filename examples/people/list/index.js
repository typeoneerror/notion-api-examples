/**
 * Arguments:
 *
 * --page-size: 0-100, number of pages to fetch
 * --start-cursor: where to start in the results
 */

const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');

const argv = yargs.default({
  pageSize: 100,
}).argv;

(async () => {
  // NOTE: the Notion API only returns Members and Bots (no Guests!! :( )
  const users = await notion.users.list({
    page_size: argv.pageSize,
    start_cursor: argv.startCursor,
  });

  log(users);
})();
