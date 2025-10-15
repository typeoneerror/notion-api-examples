/**
 * Update a data source.
 *
 * This example updates a formula, renames the data source, and switches an icon.
 *
 * Arguments:
 *
 * --data-source-id: ID of the database to update
 * --prop-id: ID of property to update
 * --title: Title of the data source to change to
 */

const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const { log } = require('../../shared/utils');

const dataSourceId = 'bb23cc5b-70e1-4b11-ad4c-d92a97c43717';
const title = 'Updated Data Source Name';
const propId = 'f%5Csj';
const argv = yargs.default({ dataSourceId, propId, title }).argv;

const properties = {
  [argv.propId]: {
    name: 'X * Y',
    formula: {
      expression: 'prop("X") * prop("Y")',
    },
  },
};

const params = {
  data_source_id: argv.dataSourceId,
  icon: props.emoji('🐞'),
  title: [props.text(argv.title)],
  properties,
};

(async () => {
  const dataSource = await notion.dataSources.update(params);

  log(dataSource);
})();
