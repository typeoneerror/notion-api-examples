/**
 * Fetch a Notion Group
 *
 * --group-id: ID of Group to fetch
 */

const { scim, yargs } = require('../../shared/scim');
const { log } = require('../../shared/utils');

const groupId = '3dcd9218-8b1b-45d5-8ee9-860de3511fbd';
const argv = yargs.default({ groupId }).argv;

(async () => {
  // GET https://api.notion.com/scim/v2/Groups/{id}

  const { data: group } = await scim.get(`Groups/${argv.groupId}`);

  log(group);
})();
