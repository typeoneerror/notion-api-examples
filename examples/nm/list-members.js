/**
 * Output all Members of the space, regardless of status.
 */

const _ = require('lodash');
const { RateLimit } = require('async-sema');
const { scim, yargs } = require('../shared/scim');
const { log } = require('../shared/utils');
const { setCache } = require('./shared');

const PER_PAGE = 100;
const RPS = 2;

const limit = RateLimit(RPS);

let allUsers = [];

async function fetchUsers(page = 1) {
  const startIndex = 1 + (page - 1) * PER_PAGE;
  console.log(`Fetching page ${page} at startIndex ${startIndex}...`);

  const params = {
    count: PER_PAGE,
    startIndex,
  };

  try {
    let data = await scim.get('Users', { params });
    let {
      data: { Resources: users, totalResults },
    } = data;

    allUsers.push(...users);

    let remaining = totalResults - (startIndex + PER_PAGE - 1);
    if (remaining > 0) {
      console.log(`\t${remaining} items remaining to fetch, total is ${allUsers.length}...`);

      await limit();
      await fetchUsers(page + 1);
    }
  } catch (e) {
    console.log(e);
  }
}

(async () => {
  await fetchUsers();

  allUsers = _.reduce(
    allUsers,
    (all, user) => {
      all.push({
        active: user.active,
        displayName: user.displayName,
        email: _.find(user.emails, { primary: true }).value,
        emails: user.emails,
        id: user.id,
        name: user.name,
      });

      return all;
    },
    []
  );

  console.log(`${allUsers.length} users fetched.`);

  await setCache('members', allUsers);
})();
