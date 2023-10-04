const { RateLimit } = require('async-sema');
const { RED_COLOR, yargs } = require('../shared/scim');
const { addMemberToGroup, findMemberByEmail, findOrProvisionUser, getCache } = require('./shared');

const RPS = 3;
const limit = RateLimit(RPS);

const argv = yargs
  .option('groupId', {
    alias: 'g',
    describe: 'The ID of the group to add the User to',
    demand: true,
    default: '7d3e5712-a873-43a8-a4b5-2ab138a9e2ea',
  })
  .option('file', {
    alias: 'f',
    describe: 'File of user IDs to add to group',
    demand: true,
    default: 'members-import',
  })
  .boolean('provision')
  .default({ provision: false }).argv;

async function addMember(groupId, user, provision = false) {
  await limit();

  const { email } = user;

  let member;

  if (provision) {
    member = await findOrProvisionUser(email);
  } else {
    member = await findMemberByEmail(email);

    if (!member) {
      console.log(RED_COLOR, `No member by email <${email}> found`);
      return;
    }
  }

  await limit();

  return await addMemberToGroup(groupId, member.id);
}

(async () => {
  const users = await getCache(argv.file);

  for (const user of users) {
    await addMember(argv.groupId, user, argv.provision);
  }

  console.log(`${users.length} added to group`);
})();
