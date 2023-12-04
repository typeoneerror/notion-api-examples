/**
 * Change access from one email to another.
 */

const { RED_COLOR, yargs } = require('../shared/scim');
const {
  addMemberToGroup,
  findMemberByEmail,
  findOrProvisionUser,
  removeMemberFromWorkspace,
} = require('./shared');

const argv = yargs
  .option('groupId', {
    alias: 'g',
    describe: 'The ID of the group to add the User to',
    demand: true,
    default: '7d3e5712-a873-43a8-a4b5-2ab138a9e2ea',
  })
  .option('old', {
    alias: 'o',
    describe: "User's current email address",
    demand: true,
  })
  .option('new', {
    alias: 'n',
    describe: "User's new email address",
    demand: true,
  }).argv;

(async () => {
  const { groupId, old: oldEmail, new: newEmail } = argv;

  // Find the old member
  const oldMember = await findMemberByEmail(oldEmail);
  if (!oldMember) {
    return console.log(RED_COLOR, `No member by email <${oldEmail}> found`);
  }

  // Provision the new member
  const user = await findOrProvisionUser(newEmail);
  if (!user.id) {
    return console.log(RED_COLOR, 'Could not find or provision user');
  }

  await addMemberToGroup(argv.groupId, user.id);
  await removeMemberFromWorkspace(oldMember.id);
})();
