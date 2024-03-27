/**
 * Output a list of all groups in the Notion Mastery workspace.
 */

const _ = require('lodash');
const { scim, yargs } = require('../shared/scim');
const { log } = require('../shared/utils');
const { setCache } = require('./shared');

(async () => {
  // GET https://api.notion.com/scim/v2/Groups

  const params = {
    count: 100,
    startIndex: 1,
  };

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
        });

        return all;
      },
      []
    );

    groups = _.orderBy(groups, 'displayName');

    await setCache('groups', groups);

    log(groups);
  } catch (e) {
    console.log(e);
  }
})();
