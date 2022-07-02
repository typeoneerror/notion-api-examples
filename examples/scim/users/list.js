/**
 * List Notion Users
 *
 * --count:       0-100, number of Users to fetch
 * --start-index: Where to start in the results
 * --email, -e:   Filter User by email
 * --[no-]sort:   Sort the results (funky when paginating)
 */

const _ = require('lodash');
const { scim, yargs } = require('../../shared/scim');

const argv = yargs.boolean('sort').option('e', { alias: 'email', type: 'string' }).default({
  count: 100,
  startIndex: 1,
}).argv;

(async () => {
  // GET https://api.notion.com/scim/v2/Users

  const params = {
    count: argv.count,
    startIndex: argv.startIndex,
  };

  if (argv.email) {
    // SEE: https://ldapwiki.com/wiki/SCIM%20Filtering
    params.filter = `email eq "${argv.email}"`;
  }

  try {
    let {
      data: { Resources: users },
    } = await scim.get('Users', { params });

    users = _.reduce(
      users,
      (all, user) => {
        all.push({
          active: user.active,
          displayName: user.displayName,
          email: _.find(user.emails, { primary: true }).value,
          id: user.id,
          index: all.length + 1,
        });

        return all;
      },
      []
    );

    // Order by name
    if (argv.sort) {
      users = _.orderBy(users, 'email');
    }

    console.log(users);
  } catch (e) {
    console.log(e);
  }
})();
