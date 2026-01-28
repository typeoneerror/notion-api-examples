/**
 * Add a new or existing Member to a Notion Group, Circle, and tag properly in ConvertKit.
 */

const { notion } = require('../shared');
const { addCircleMember, findCircleMember } = require('../shared/circle');
const { removeConvertkitTag } = require('../shared/convertkit');
const { yargs, RED_COLOR } = require('../shared/scim');
const { addMemberToGroup, findOrProvisionUser } = require('./shared');

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
  .option('circle', {
    alias: 'c',
    describe: "User's Circle email address (if different from email)",
  }).argv;

(async () => {
  const email = argv.email;
  const circleEmail = argv.circle || email;

  // Add to Notion as Member
  const user = await findOrProvisionUser(email);

  if (!user) {
    return console.log(RED_COLOR, 'Could not find or provision user in Notion');
  }

  // Add to Notion Group
  await addMemberToGroup(argv.groupId, user.id);

  // Invite to Circle
  let circleMember = await findCircleMember(circleEmail);

  if (!circleMember) {
    const {
      name: { formatted: name },
    } = user;

    console.log(`Adding ${name} <${circleEmail}> to Circle`);

    circleMember = await addCircleMember(circleEmail, name);

    if (!circleMember) {
      console.log(RED_COLOR, `Could not add <${circleEmail}> to Circle`);
    }
  }

  removeConvertkitTag(email);
  removeConvertkitTag(circleEmail);
})();
