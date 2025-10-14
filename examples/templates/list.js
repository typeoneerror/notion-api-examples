const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const databaseId = '1e7abab87ee8457799c1155cf69d502a';
const argv = yargs.default({ databaseId }).argv;

(async () => {
  const { data_sources: dataSources } = await notion.databases.retrieve({
    database_id: argv.databaseId,
  });

  const dataSource = await notion.dataSources.retrieve({
    data_source_id: dataSources.at(0).id,
  });

  const { templates } = await notion.dataSources.listTemplates({
    data_source_id: dataSource.id,
  });

  log(templates);
})();
