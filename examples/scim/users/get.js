/**
 * Fetch a Notion User
 *
 * --user-id, -u: ID of User to fetch
 */

const { scim, yargs } = require('../../shared/scim');

const userId = '333cf6eb-705a-4d62-ac98-a99b7c99f0ce';
const argv = yargs
  .option('u', {
    alias: 'user-id',
    type: 'string',
  })
  .default({ userId }).argv;

(async () => {
  // GET https://api.notion.com/scim/v2/Users/{id}

  const { data: user } = await scim.get(`Users/${argv.userId}`);

  console.log(user);
})();
