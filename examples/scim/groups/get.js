/**
 * Fetch a Notion Group
 *
 * --group-id: ID of Group to fetch
 */

const { scim, yargs } = require('../../shared/scim');
const { log } = require('../../shared/utils');
const { groupKeyToId } = require('../../nm/shared');

const groupKeys = Object.keys(groupKeyToId);

const argv = yargs
  .option('groupId', {
    alias: 'g',
    describe: 'The ID of the group to fetch',
  })
  .option('groupKey', {
    alias: 'k',
    describe: `Group key (${groupKeys.join(' or ')})`,
    choices: groupKeys,
  }).argv;

(async () => {
  const groupKey = argv.groupKey || 'nm';
  const groupId = argv.groupId || groupKeyToId[groupKey];

  // GET https://api.notion.com/scim/v2/Groups/{id}
  const { data: group } = await scim.get(`Groups/${groupId}`);

  log(group);
})();
