/**
 * Create a Notion Group
 *
 * --name: Name of the Group to create
 */

const { scim, yargs, SCIM_SCHEMA_GROUP } = require('../../shared/scim');
const { log } = require('../../shared/utils');

const name = 'Group Name';
const argv = yargs.default({ name }).argv;

(async () => {
  // POST https://api.notion.com/scim/v2/Groups

  const { data: group } = await scim.post('Groups', {
    schemas: [SCIM_SCHEMA_GROUP],
    displayName: argv.name,
  });

  log(group);
})();
