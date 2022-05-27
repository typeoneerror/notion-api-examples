/**
 * Arguments:
 *
 * --user-id: ID of the user to retrieve
 */

const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');

const userId = '333cf6eb-705a-4d62-ac98-a99b7c99f0ce';

const argv = yargs.default({
  userId,
}).argv;

(async () => {
  const user = await notion.users.retrieve({
    user_id: argv.userId,
  });

  log(user);
})();
