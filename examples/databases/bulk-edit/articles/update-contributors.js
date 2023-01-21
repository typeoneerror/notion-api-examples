/**
 * Updates Contributors database to add icons.
 */

const { notion, yargs } = require('./shared');
const { fetchAllPages, performWithAll } = require('../../../shared/fetch-pages');
const props = require('../../../shared/props');

const databaseId = '90852d414ffa46f29c382bcb4c295301';
const argv = yargs.default({ databaseId }).argv;

async function editPage(page) {
  process.stdout.write('.');

  const args = {
    page_id: page.id,
    icon: props.icon('user-circle-filled', 'green'),
  };

  // Update the page
  return await notion.pages.update(args);
}

(async () => {
  let pages = [];

  if (argv.pageId) {
    // Update a single page or...
    const page = await notion.pages.retrieve({ page_id: argv.pageId });

    pages.push(page);
  } else {
    // Fetch all the pages in the database.
    // This happens in chunks of 100 pages.
    pages = await fetchAllPages(argv.databaseId);
  }

  // Update each page with a rate limiter
  performWithAll(pages, editPage);
})();
