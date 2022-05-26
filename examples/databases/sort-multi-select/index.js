const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');
const _ = require('lodash');

const databaseId = 'f91e66f29d63457894be7c91b132f345';
const sortProp = 'Feeling';
const argv = yargs
  .boolean('case-sensitive')
  .default({ databaseId, sortProp, caseSensitive: true }).argv;

(async () => {
  let database = await notion.databases.retrieve({
    database_id: argv.databaseId,
  });

  const propId = database.properties[argv.sortProp].id;
  const iteratee = argv.caseSensitive ? 'name' : [(option) => option.name.toLowerCase()];

  // Sort the options and remove color since it cannot be updated via API
  const sortedOptions = _.map(
    _.orderBy(database.properties[argv.sortProp].multi_select.options, iteratee),
    (option) => {
      return _.omit(option, 'color');
    }
  );

  const properties = {
    database_id: argv.databaseId,
    properties: {
      [propId]: {
        multi_select: {
          options: sortedOptions,
        },
      },
    },
  };

  database = await notion.databases.update(properties);

  log(database.properties[argv.sortProp]);
})();
