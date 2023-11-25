/**
 * This example was with an imported csv file that had each item's title prefixed
 * with "Image - " or "Video -". In this example, we remove the prefix, re-title
 * the Page, and apply the corresponding "Image" or "Video" as the Page's "Type"
 * property which is a Select field.
 */

/**
 * Arguments:
 *
 * --database-id: ID of the database to edit pages in
 */

const { notion, yargs } = require('../../shared');
const { fetchAllPages, performWithAll } = require('../../shared/fetch-pages');

const databaseId = '9d550c3fe4cf4b4bac9343fba0f4aa56';
const argv = yargs.default({ databaseId }).argv;

const expr = /(Image|Video) - /;

async function editPage(page) {
  process.stdout.write('.');

  // Get the current page title
  let {
    Name: {
      title: [{ plain_text: title }],
    },
  } = page.properties;

  // If the page's title does not match, no need to update
  if (!expr.test(title)) {
    return Promise.resolve();
  }

  // Capture the asset type from the title
  const [, type] = expr.exec(title);

  // Remove the prefix
  title = title.replace(expr, '');

  // Finally update the page with the new title
  return await notion.pages.update({
    page_id: page.id,
    properties: {
      Name: {
        title: [
          {
            type: 'text',
            text: {
              content: title,
            },
          },
        ],
      },
      Type: {
        select: {
          name: type,
        },
      },
    },
  });
}

(async () => {
  const pages = await fetchAllPages(argv.databaseId, {
    filter: {
      or: [
        {
          property: 'Name',
          rich_text: {
            starts_with: 'Image - ',
          },
        },
        {
          property: 'Name',
          rich_text: {
            starts_with: 'Video - ',
          },
        },
      ],
    },
  });

  await performWithAll(pages, editPage);
})();
