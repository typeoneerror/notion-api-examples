/**
 * Fetch a Notion Group
 *
 * --group-id: ID of Group to fetch
 */

const { scim, yargs } = require('../../shared/scim');
const { log } = require('../../shared/utils');

const groupId = '70158620-4985-4b86-b08e-95657b6d2edf';
const argv = yargs.default({ groupId }).argv;

(async () => {
  // GET https://api.notion.com/scim/v2/Groups/{id}

  const { data: group } = await scim.get(`Groups/${argv.groupId}`);

  log(group);
})();
