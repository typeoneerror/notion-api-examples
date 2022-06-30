/**
 * List Notion Groups
 *
 * --count:        0-100, number of groups to fetch
 * --start-index:  where to start in the results
 * --filter:       filter group by displayName
 * --[no-]sort:    sort the results (funky when paginating)
 */

const _ = require('lodash');
const { scim, yargs } = require('../../shared/scim');
const { log } = require('../../shared/utils');

const argv = yargs.boolean('sort').default({
  count: 100,
  startIndex: 1,
}).argv;

(async () => {
  // GET https://api.notion.com/scim/v2/Groups

  const params = {
    count: argv.count,
    startIndex: argv.startIndex,
  };

  if (argv.filter) {
    // SEE: https://ldapwiki.com/wiki/SCIM%20Filtering
    params.filter = `displayName eq "${argv.filter}"`;
  }

  try {
    let {
      data: { Resources: groups },
    } = await scim.get('Groups', { params });

    // Formats groups into simple format showing group name, id,
    // and a count showing the number of members in the group.

    groups = _.reduce(
      groups,
      (all, group) => {
        all.push({
          displayName: group.displayName,
          id: group.id,
          memberCount: group.members.length || 0,
          index: all.length + 1,
        });

        return all;
      },
      []
    );

    // Order by name if desired
    if (argv.sort) {
      groups = _.orderBy(groups, 'displayName');
    }

    log(groups);
  } catch (e) {
    console.log(e);
  }
})();
