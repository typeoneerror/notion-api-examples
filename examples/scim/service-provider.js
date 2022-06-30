const { scim } = require('../shared/scim');

(async () => {
  // GET https://api.notion.com/scim/v2/ServiceProviderConfig

  const { data } = await scim.get('ServiceProviderConfig');

  console.log(data);
})();
