/**
 * Update a Notion Group
 *
 * --group-id: ID of Group to update
 */

const { scim, yargs, SCIM_SCHEMA_GROUP } = require('../../shared/scim');

const groupId = '0332a96e-0a56-4454-ab7b-f90546bc0e79';
const argv = yargs.default({ groupId }).argv;

(async () => {
  // PUT https://api.notion.com/scim/v2/Groups/{id}

  try {
    const { status, statusText } = await scim.put(`Groups/${argv.groupId}`, {
      schemas: [SCIM_SCHEMA_GROUP],
      displayName: 'Group Name Updated',
    });

    console.log(`${status}: ${statusText}`);
  } catch (e) {
    console.log(e);
  }
})();
