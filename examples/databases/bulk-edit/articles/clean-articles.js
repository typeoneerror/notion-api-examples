/**
 * Update a database of articles imported from a .csv file downloaded from Google Sheets.
 *
 * First we find all the articles in the Notion database, then for each article:
 *
 * - Fetch the corresponding WordPress article
 * - Copy the WordPress title into the database
 * - Save the WordPress SEO description from Yoast in "Description"
 * - Save the WordPress slug in the database in "Slug"
 * - Add an icon to the page
 */

const { getWordPressPost, notion, SLUG_MATCH, yargs } = require('./shared');
const { fetchAllPages, performWithAll } = require('../../../shared/fetch-pages');
const props = require('../../../shared/props');

const databaseId = 'bb4d4d5c799f43b9b5a21e182fc39059';
const argv = yargs.default({ databaseId }).argv;

async function editPage(page) {
  process.stdout.write('.');

  // Get the current page data.
  let {
    URL: { url },
  } = page.properties;

  let properties = {};

  const matches = SLUG_MATCH.exec(url);

  // The URL in the database is populated and is valid.
  if (matches) {
    // Fetch the post via WordPress API.
    let [, slug] = matches;
    const post = await getWordPressPost(slug.trim());

    // Grab title and SEO description (defined by Yoast plugin)
    const {
      title: { rendered: postTitle },
      yoast_head_json: { description: postDescription },
    } = post;

    // Assign post properties to Notion properties.
    properties = {
      ...properties,
      'Blog Title': props.pageTitle(postTitle),
      Description: props.richText(postDescription),
      Slug: props.richText(slug.trim()),
    };
  }

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
    // const filter = {
    //   and: [
    //     {
    //       property: 'URL',
    //       url: {
    //         is_not_empty: true,
    //       },
    //     },
    //     {
    //       property: 'Categories',
    //       relation: {
    //         is_empty: true,
    //       },
    //     },
    //   ],
    // };

    // Fetch all the pages in the database.
    // This happens in chunks of 100 pages.
    pages = await fetchAllPages(argv.databaseId /*, { filter }*/);
  }

  // Update each page with a rate limiter
  performWithAll(pages, editPage);
})();
