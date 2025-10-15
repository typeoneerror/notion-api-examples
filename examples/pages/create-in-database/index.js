/**
 * Create a page inside a database.
 *
 * Arguments:
 *
 * --database-id: ID of the database to create in
 */

const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const titledDate = require('../../shared/titled-date');
const { log } = require('../../shared/utils');

const databaseId = '688d410fd0e842a2ad399650d34842ba';
const argv = yargs.default({ databaseId }).argv;

// The titledDate helper adds a title in the format of "<Prefix>: <MMM DD, YYYY>"
// and also assigns the "Date" property with the same date. So this will create
// a page called something like "Journal: Jan 13, 2023"
const properties = titledDate('Journal');

const params = {
  parent: {
    type: 'database_id',
    database_id: argv.databaseId,
  },
  icon: props.emoji('👨‍🚒'),
  properties,
};

(async () => {
  // FIXME: use data sources
  const page = await notion.pages.create(params);

  log(page);
})();
