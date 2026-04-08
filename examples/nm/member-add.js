/**
 * Add a new or existing Member to a Group.
 *
 * 1. Fetch a Member in Notion Mastery, if they don't exist then,
 * 2. Provision a new User/Member in Notion Mastery, and then,
 * 3. Add the User provisioned to the Group determined by --group-id option.
 */

const { yargs } = require('../shared/scim');
const { addMemberToGroup, findOrProvisionUser, groupKeyToId } = require('./shared');

const groupKeys = Object.keys(groupKeyToId);

const argv = yargs
  .option('groupId', {
    alias: 'g',
    describe: 'The ID of the group to add the User to',
  })
  .option('groupKey', {
    alias: 'k',
    describe: `Group key (${groupKeys.join(' or ')})`,
    choices: groupKeys,
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
  const groupKey = argv.groupKey || 'nm';
  const groupId = argv.groupId || groupKeyToId[groupKey];

  if (!(userId || argv.email)) {
    return console.log('Need either a userId or email');
  } else if (!userId) {
    const user = await findOrProvisionUser(argv.email);
    userId = user.id;
  }

  if (!userId) {
    return console.log('Could not find or provision user');
  }

  await addMemberToGroup(groupId, userId);
})();
