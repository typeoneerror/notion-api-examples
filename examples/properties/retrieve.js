/**
 * Retrieve a property _value_ from a database.
 *
 * Required if you want to get accurate data from Rollups via the API.
 *
 * Arguments:
 *
 * --prop-id: ID of the property to fetch
 */

const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const pageId = 'a2d67b9cb48e4b2aaca6026d8d577dfd';
const propId = 'uy%7Db';
const argv = yargs.default({ pageId, propId }).argv;

(async () => {
  const prop = await notion.pages.properties.retrieve({
    page_id: argv.pageId,
    property_id: argv.propId,
  });

  log(prop);
})();
