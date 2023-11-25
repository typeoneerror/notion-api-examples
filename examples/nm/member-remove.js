/**
 * Remove a Member from a Group.
 *
 * --group-id: ID of Group to remove from
 * --user-id:  ID of User to remove
 */

const { yargs } = require('../shared/scim');
const { findMemberByEmail, removeMemberFromGroup } = require('./shared');

const argv = yargs
  .option('groupId', {
    alias: 'g',
    describe: 'The ID of the group to add the User to',
    demand: true,
    default: '7d3e5712-a873-43a8-a4b5-2ab138a9e2ea',
  })
  .option('email', {
    alias: 'e',
    describe: "User's email address",
  })
  .option('userId', {
    alias: 'u',
    describe: "User's Notion identifier",
  }).argv;

(async () => {
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

  await removeMemberFromGroup(argv.groupId, userId);
})();
