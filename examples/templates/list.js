const notionAPI = require('../shared/notion-api');
const { log } = require('../shared/utils');

(async () => {
  // Fetch data source from database
  const { data: database } = await notionAPI.get('/databases/1e7abab87ee8457799c1155cf69d502a');
  const { data_sources: [data_source] } = database;

  // Fetch templates
  const { data: { templates } } = await notionAPI.get(`/data_sources/${data_source.id}/templates`);

  log(templates);
})();
