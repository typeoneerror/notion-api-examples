/**
 * Retrieve a Google Drive property _value_ from a database.
 *
 * Google Drive properties are Relations under the hood and
 * can be fetched, allowing you to access the underlying link
 * to the Google Drive file, but cannot be created or attached
 * via the API at this time (as far as I can understand).
 *
 * It's not possible to extrapolate what properties on a database
 * might be Google Drive properties as they only are reported as
 * "relation" types, so you would have to infer Google Drive properties
 * based on their titles or know the actual property ID of the property.
 *
 * Arguments:
 *
 * --page-id: ID of the page the property exists in
 * --prop-id: ID of the property to fetch
 */

const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const pageId = '1a51c1cce3f380c688b5ecdcc0a09f75';
const propId = 's%60%3Ev';
const argv = yargs.default({ pageId, propId }).argv;

async function fetchFiles(ids) {
  return await Promise.all(
    ids.map(async (id) => {
      return await notion.pages.retrieve({
        page_id: id,
      });
    })
  );
}

(async () => {
  const { results } = await notion.pages.properties.retrieve({
    page_id: argv.pageId,
    property_id: argv.propId,
  });

  const fileIds = results.map((file) => file.relation.id);
  const files = await fetchFiles(fileIds);

  log(files);
})();
