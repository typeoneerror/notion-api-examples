/**
 * DANGER: Completely remove a User from a Workspace!
 *
 * NOTE: does not delete Account (manual process)
 */

const { scim, yargs } = require('../shared/scim');
const { findMemberByEmail, removeMemberFromWorkspace } = require('./shared');

const argv = yargs
  .option('email', {
    alias: 'e',
    describe: "User's email address",
  })
  .option('userId', {
    alias: 'u',
    describe: "User's Notion identifier",
  }).argv;

(async function () {
  let userId = argv.userId;

  if (!(userId || argv.email)) {
    return console.log('Need either a userId or email');
  } else if (argv.email) {
    const user = await findMemberByEmail(argv.email);
    userId = user.id;
  }

  if (!userId) {
    return console.log('Could not find user');
  }

  await removeMemberFromWorkspace(userId);
})();
