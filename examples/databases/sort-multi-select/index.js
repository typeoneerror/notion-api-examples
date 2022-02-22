const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');
const _ = require('lodash');

const databaseId = 'f91e66f29d63457894be7c91b132f345';
const argv = yargs.default({ databaseId }).argv;

(async () => {
  let database = await notion.databases.retrieve({
    database_id: databaseId,
  });

  const sortProp = 'Feeling';
  const propId = database.properties[sortProp].id;

  // Sort the options and remove color since it cannot be updated via API
  const sortedOptions = _.map(
    _.orderBy(database.properties[sortProp].multi_select.options, 'name'),
    (option) => {
      return _.omit(option, 'color');
    }
  );

  const properties = {
    database_id: databaseId,
    properties: {
      [propId]: {
        multi_select: {
          options: sortedOptions,
        },
      },
    },
  };

  database = await notion.databases.update(properties);

  log(database);
})();
