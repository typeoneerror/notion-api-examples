/**
 * Create a page inside a data source.
 *
 * Arguments:
 *
 * --data-source-id: ID of the database to create in
 */

const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const titledDate = require('../../shared/titled-date');
const { log } = require('../../shared/utils');

const dataSourceId = 'dd25a489-2480-46c8-afa4-d56cf22c04c6';
const argv = yargs.default({ dataSourceId }).argv;

// The titledDate helper adds a title in the format of "<Prefix>: <MMM DD, YYYY>"
// and also assigns the "Date" property with the same date. So this will create
// a page called something like "Journal: Jan 13, 2023"
const properties = titledDate('Journal');

const params = {
  parent: {
    type: 'data_source_id',
    data_source_id: argv.dataSourceId,
  },
  icon: props.emoji('👨‍🚒'),
  properties,
};

(async () => {
  const page = await notion.pages.create(params);

  log(page);
})();
