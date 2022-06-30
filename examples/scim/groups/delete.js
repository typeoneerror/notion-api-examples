/**
 * Delete a Notion Group
 *
 * --group-id: ID of Notion Group to delete
 */

const { scim, yargs } = require('../../shared/scim');

const groupId = '72448843-6e69-4050-9488-fe0b28e6c970';
const argv = yargs.default({ groupId }).argv;

(async () => {
  // DELETE https://api.notion.com/scim/v2/Groups/{id}

  try {
    const { status, statusText } = await scim.delete(`Groups/${argv.groupId}`);

    console.log(`${status}: ${statusText}`);
  } catch ({ response: { status, statusText } }) {
    console.log(`${status}: ${statusText}`);
  }
})();
