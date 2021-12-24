const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const { log } = require('../../shared/utils');

const databaseId = '7b71eb300cbf4f4998f8c2208d733ee2';
const argv = yargs.default({ databaseId }).argv;

const params = {
  parent: {
    database_id: argv.databaseId,
  },
  icon: props.icon('👨‍🚒'),
  properties: {
    Name: props.title('Duty Crew'),
    Date: props.date('2021-12-11'),
  },
};

(async () => {
  const page = await notion.pages.create(params);

  log(page);
})();