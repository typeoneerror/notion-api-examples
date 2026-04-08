/**
 * Remove a Member from a Group.
 *
 * --group-id: ID of Group to remove from
 * --user-id:  ID of User to remove
 */

const { yargs } = require('../shared/scim');
const { findMemberByEmail, removeMemberFromGroup, groupKeyToId } = require('./shared');

const argv = yargs
  .option('groupId', {
    alias: 'g',
    describe: 'The ID of the group to remove the User from',
  })
  .option('groupKey', {
    alias: 'k',
    describe: 'Group key (nm or membership or ff or alum)',
    choices: ['nm', 'membership', 'ff', 'alum'],
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
  let email = argv.email;
  const groupKey = argv.groupKey || 'nm';
  const groupId = argv.groupId || groupKeyToId[groupKey];

  if (!(userId || email)) {
    return console.log('Need either a userId or email');
  } else if (argv.email) {
    const user = await findMemberByEmail(email);
    userId = user.id;
  }

  if (!userId) {
    return console.log('Could not find user');
  }

  await removeMemberFromGroup(groupId, userId);
})();
