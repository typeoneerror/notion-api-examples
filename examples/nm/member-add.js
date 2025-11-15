/**
 * Add a new or existing Member to a Group.
 *
 * 1. Fetch a Member in Notion Mastery, if they don't exist then,
 * 2. Provision a new User/Member in Notion Mastery, and then,
 * 3. Add the User provisioned to the Group determined by --group-id option.
 */

const { yargs } = require('../shared/scim');
const { addMemberToGroup, findOrProvisionUser } = require('./shared');

const argv = yargs
  .option('groupId', {
    alias: 'g',
    describe: 'The ID of the group to add the User to',
  })
  .option('groupKey', {
    alias: 'k',
    describe: 'Group key (nm or membership or ff)',
    choices: ['nm', 'membership', 'ff'],
  })
  .option('email', {
    alias: 'e',
    describe: "User's email address",
  })
  .option('userId', {
    alias: 'u',
    describe: "User's Notion identifier",
  }).argv;

// Group key to ID hash
const groupKeyToId = {
  nm: '7d3e5712-a873-43a8-a4b5-2ab138a9e2ea', // Notion Mastery
  membership: '9e7b05bc-e9e6-4b7a-8246-f8b1af875ea2', // Notion Mastery Membership
  ff: '70158620-4985-4b86-b08e-95657b6d2edf', // Formula Fundamentals 2.0
  aw: '2ebb373f-3023-4e43-a81d-a62cb3292f06', // Architecting Workspaces
};

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
