/**
 * Create a page inside another page
 *
 * Arguments:
 *
 * --page-id: ID of the parent page to create the page inside
 */

const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const { log } = require('../../shared/utils');

const pageId = '6027a8c8749a4eb9a9bc9bc2714c0d08';
const argv = yargs.default({ pageId }).argv;

const params = {
  parent: {
    type: 'page_id',
    page_id: argv.pageId,
  },
  icon: props.emoji('📄'),
  properties: {
    title: props.pageTitle('Hello, world!'),
  },
};

(async () => {
  const page = await notion.pages.create(params);

  log(page);
})();
