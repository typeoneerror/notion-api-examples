/**
 * Example bulk-edit script. In this script, there are two databases. One is
 * Spends which has a bunch of data for advertising spends in it. The other
 * is Trends, which has a bunch of data for traffic/metrics for websites. There
 * is a relation between the two.
 *
 * This script is updating all pages in the Trends database by:
 *
 * 1. Apply an icon to each page.
 * 2. Find the corresponding Spends relation (by ID) and relating it to the Trends entry with the same date.
 * 3. Re-titles the Trend page using the Date property.
 */

const { format, parse } = require('date-fns');
const { notion } = require('../../shared');
const { fetchAllPages, fetchPages, performWithAll } = require('../../shared/fetch-pages');
const { emoji } = require('../../shared/props');

const spendsDbId = '029a7e3e6b734169a0e973493fc0dbf1';
const trendsDbId = 'e7cfab7d65394f17904b7123ec3bfe1f';

async function editPage(page) {
  process.stdout.write('.');

  let {
    Date: {
      date: { start: actualDate },
    },
  } = page.properties;

  const parsed = parse(actualDate, 'yyyy-MM-dd', new Date());
  const dateTitle = format(parsed, 'MMM d, yyyy');
  const spendsTitle = `Spends: ${dateTitle}`;

  const {
    results: [spends],
  } = await notion.databases.query({
    database_id: spendsDbId,
    filter: {
      property: 'ID',
      title: {
        equals: spendsTitle,
      },
    },
  });

  if (!spends) {
    throw new Error(`"${spendsTitle}" could not be found in the Spends database!`);
  }

  return await notion.pages.update({
    page_id: page.id,
    icon: emoji('📈'),
    properties: {
      ID: {
        title: [
          {
            type: 'text',
            text: {
              content: `Trends: ${dateTitle}`,
            },
          },
        ],
      },
      Spends: {
        relation: [
          {
            id: spends.id,
          },
        ],
      },
    },
  });
}

(async () => {
  const pages = await fetchAllPages(trendsDbId, {
    sorts: [
      {
        property: 'Date',
        direction: 'ascending',
      },
    ],
  });

  await performWithAll(pages, editPage);
})();
