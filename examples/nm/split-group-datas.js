const { getCache, setCache } = require('./shared');

(async () => {
  const data = await getCache('members-nm-groups');
  const nm = data['nm']['found'];
  const legacy = data['legacy']['found'];

  await setCache('members-import-nm', nm);
  await setCache('members-import-legacy', legacy);
})();
