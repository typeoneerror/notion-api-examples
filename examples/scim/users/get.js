/**
 * Fetch a Notion User
 *
 * --user-id: ID of User to fetch
 */

const { scim, yargs } = require('../../shared/scim');
const { log } = require('../../shared/utils');

const userId = '333cf6eb-705a-4d62-ac98-a99b7c99f0ce';
const argv = yargs.default({ userId }).argv;

(async () => {
  // GET https://api.notion.com/scim/v2/Users/{id}

  const { data: user } = await scim.get(`Users/${argv.userId}`);

  log(user);
})();
