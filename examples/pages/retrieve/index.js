/**
 * Arguments:
 *
 * --page-id: ID of the page to fetch
 */

const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');

const pageId = '6027a8c8749a4eb9a9bc9bc2714c0d08';
const argv = yargs.default({ pageId }).argv;

(async () => {
  const page = await notion.pages.retrieve({
    page_id: argv.pageId,
  });

  log(page);
})();
