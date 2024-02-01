const { RateLimit } = require('async-sema');
const { addMemberToGroup, getCache } = require('./shared');

const RPS = 1;
const limit = RateLimit(RPS);

async function addMember(groupId, user) {
  await limit();

  const { memberName, newEmail, email, NMID } = user;

  console.log(`Added ${memberName} <${newEmail || email}> (${NMID}) to ${groupId}`);

  return await addMemberToGroup(groupId, NMID);
}

async function addMembers(groupId, cacheName) {
  const users = await getCache(cacheName);

  console.log(`Adding ${users.length} members to group ${groupId}`);

  for (const user of users) {
    await addMember(groupId, user);
  }

  console.log(`${users.length} added to group`);
}

(async () => {
  await addMembers('7d3e5712-a873-43a8-a4b5-2ab138a9e2ea', 'members-import-nm');
  await addMembers('922f01d5-b5e4-4f13-9be7-411242a2c68b', 'members-import-legacy');
})();
