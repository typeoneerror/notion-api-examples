const { notion } = require('../../shared');
const { log } = require('../../shared/utils');

(async () => {
  const user = await notion.users.me();

  log(user);
})();
