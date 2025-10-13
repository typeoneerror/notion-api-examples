const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const dataSourceId = 'acce37c4c4ee4b78aa786a944c2577cf';
const argv = yargs.default({ dataSourceId }).argv;

(async () => {
  const { templates } = await notion.dataSources.listTemplates({
    data_source_id: argv.dataSourceId,
  });

  log(templates);
})();
