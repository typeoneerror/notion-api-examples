/**
 * Arguments:
 *
 * --database-id: ID of the database to create in
 */

const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const titledDate = require('../../shared/titled-date');
const { log } = require('../../shared/utils');

const databaseId = '7b71eb300cbf4f4998f8c2208d733ee2';
const argv = yargs.default({ databaseId }).argv;

const params = {
  parent: {
    database_id: argv.databaseId,
  },
  icon: props.icon('👨‍🚒'),
  properties: titledDate('Duty Crew'),
};

(async () => {
  const page = await notion.pages.create(params);

  log(page);
})();
