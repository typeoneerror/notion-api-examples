const find = require('lodash/find');
const { scim } = require('../../shared/scim');
const { log } = require('../../shared/utils');

(async () => {
  // GET https://api.notion.com/scim/v2/ResourceTypes

  const { data } = await scim.get('ResourceTypes');
  const schema = find(data, { id: 'Group' });

  log(schema);
})();
