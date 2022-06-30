/**
 * Add a User to a Group
 *
 * --group-id: ID of Group to add to
 * --user-id:  ID of User to add
 */

const { scim, yargs, SCIM_SCHEMA_PATCH_OP } = require('../../shared/scim');

const groupId = '0332a96e-0a56-4454-ab7b-f90546bc0e79';
const userId = '333cf6eb-705a-4d62-ac98-a99b7c99f0ce';
const argv = yargs.default({ groupId, userId }).argv;

(async () => {
  // PATCH https://api.notion.com/scim/v2/Groups/{id}

  try {
    const { status, statusText } = await scim.patch(`Groups/${argv.groupId}`, {
      schemas: [SCIM_SCHEMA_PATCH_OP],
      Operations: [
        {
          op: 'Add',
          path: 'members',
          value: [
            {
              value: argv.userId,
            },
          ],
        },
      ],
    });

    console.log(`${status}: ${statusText}`);
  } catch (e) {
    console.log('Error', e);
  }
})();
