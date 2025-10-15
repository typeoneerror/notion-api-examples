/**
 * Sort a multi-select's options alphabetically.
 *
 * Note: you can only sort up to 100 options like this!
 *
 * Arguments:
 *
 * --data-source-id: ID of the database to create in
 * --sort-prop: name of multi-select to sort
 * --[no-]case-sensitive: whether to sort ABCabc (default or --case-sensitive) or AaBbCc (--no-case-sensitive)
 */

const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');
const _ = require('lodash');

const dataSourceId = '1cf71d94-0107-4560-a702-a41cb5d90aea';
const sortProp = 'Feeling';
const argv = yargs
  .boolean('case-sensitive')
  .default({ dataSourceId, sortProp, caseSensitive: true }).argv;

(async () => {
  let dataSource = await notion.dataSources.retrieve({
    data_source_id: argv.dataSourceId,
  });

  const propId = dataSource.properties[argv.sortProp].id;
  const iteratee = argv.caseSensitive ? 'name' : [(option) => option.name.toLowerCase()];

  // Sort the options and remove color since it cannot be updated via API
  const sortedOptions = _.map(
    _.orderBy(dataSource.properties[argv.sortProp].multi_select.options, iteratee),
    (option) => {
      return _.omit(option, 'color');
    }
  );

  const properties = {
    data_source_id: argv.dataSourceId,
    properties: {
      [propId]: {
        multi_select: {
          options: sortedOptions,
        },
      },
    },
  };

  dataSource = await notion.dataSources.update(properties);

  log(dataSource.properties[argv.sortProp]);
})();
