/**
 * Remove a User from a Workspace
 *
 * NOTE: does not delete Account (manual process)
 *
 * --used-id, -u: ID of User to remove
 */

const { scim, yargs } = require('../../shared/scim');

const userId = 'ebd6dbe5-4f02-4a8a-bb77-5f3f4b1f9a48';
const argv = yargs
  .option('u', {
    alias: 'user-id',
    describe: "User's ID",
  })
  .default({ userId }).argv;

(async function () {
  // DELETE https://api.notion.com/scim/v2/Users/{id}

  try {
    const { status, statusText } = await scim.delete(`Users/${argv.userId}`);

    console.log(`${status}: ${statusText}`);
  } catch ({ response: { status, statusText } }) {
    console.log(`${status}: ${statusText}`);
  }
})();
