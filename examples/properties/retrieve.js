/**
 * Retrieve a property _value_ from a page.
 *
 * Required if you want to get accurate data from Rollups via the API.
 *
 * Arguments:
 *
 * --page-id: ID of the page to fetch property from
 * --prop-id: ID of the property to fetch
 */

const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const pageId = '3291c1cce3f380b7b2b0d382d589ef78';
const propId = '}Ulu';
const argv = yargs
  .option('pageId', {
    alias: 'd',
    default: pageId,
  })
  .option('propId', {
    alias: 'p',
    default: propId,
  }).argv;

(async () => {
  const prop = await notion.pages.properties.retrieve({
    page_id: argv.pageId,
    property_id: argv.propId,
  });

  log(prop);
})();
