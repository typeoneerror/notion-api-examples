/**
 * Update all articles to swap Title and Keyword properties.
 */

const { notion, yargs } = require('./shared');
const { fetchAllPages, performWithAll } = require('../../../shared/fetch-pages');
const props = require('../../../shared/props');

const databaseId = 'bb4d4d5c799f43b9b5a21e182fc39059';
const argv = yargs.default({ databaseId }).argv;

async function editPage(page) {
  process.stdout.write('.');

  // Get the current page data.
  let {
    Title: {
      title: [{ plain_text: title }],
    },
    'Keyword (Primary)': {
      rich_text: [{ plain_text: keyword }],
    },
    URL: { url },
  } = page.properties;

  let properties = {
    Title: props.pageTitle(keyword),
    'Keyword (Primary)': props.richText(title),
  };

  const args = {
    page_id: page.id,
    icon: props.icon('drafts', 'green'),
    properties,
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
