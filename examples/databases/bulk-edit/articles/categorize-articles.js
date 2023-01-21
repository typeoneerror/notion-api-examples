/**
 * Loop through all articles, fetch category info from WordPress and apply
 * the same category from the Categories database in Notion.
 */

const _ = require('lodash');
const { BASE_URL, getPageBy, log, getWordPressPost, notion, wp, yargs } = require('./shared');
const { fetchAllPages, performWithAll } = require('../../../shared/fetch-pages');
const props = require('../../../shared/props');

const articlesDbId = 'bb4d4d5c799f43b9b5a21e182fc39059';
const categoriesDbId = '3fb1239524a94e7fac5403af482bae8a';
const argv = yargs
  .boolean('check-existing')
  .default({ articlesDbId, categoriesDbId, checkExisting: true }).argv;

async function editPage(page) {
  process.stdout.write('.');

  const {
    properties: {
      Slug: {
        rich_text: [{ plain_text: slug }],
      },
    },
  } = page;

  const post = await getWordPressPost(slug);

  if (_.isEmpty(post.categories)) {
    return Promise.resolve();
  }

  const categories = await Promise.all(
    post.categories.map(async (cid) => {
      const category = await getPageBy(argv.categoriesDbId, Number(cid), 'WordPress ID', 'number');

      if (category) {
        return { id: category.id };
      }
    })
  );

  const params = {
    page_id: page.id,
    properties: {
      Categories: {
        type: 'relation',
        relation: categories,
      },
    },
  };

  return await notion.pages.update(params);
}

(async () => {
  let pages = [];

  if (argv.pageId) {
    // Update a single page or...
    const page = await notion.pages.retrieve({ page_id: argv.pageId });

    pages.push(page);
  } else {
    const filter = {
      and: [
        {
          property: 'URL',
          url: {
            starts_with: BASE_URL,
          },
        },
        {
          property: 'Flags',
          multi_select: {
            does_not_contain: '404',
          },
        },
      ],
    };

    if (argv.checkExisting) {
      filter.and.push({
        property: 'Categories',
        relation: {
          is_empty: true,
        },
      });
    }

    // Fetch all the pages in the database.
    // This happens in chunks of 100 pages.
    pages = await fetchAllPages(argv.articlesDbId, { filter });
  }

  // Update each page with a rate limiter
  performWithAll(pages, editPage);
})();
