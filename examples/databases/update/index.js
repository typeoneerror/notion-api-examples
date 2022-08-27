/**
 * Update a database.
 *
 * This example updates a formula, renames the database, and switches an icon.
 *
 * Arguments:
 *
 * --database-id: ID of the database to update
 * --prop-id: ID of property to update
 * --title: Title of the database to change to
 */

const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const { log } = require('../../shared/utils');

const databaseId = '6ecfa7cbd6f44298b74147e5adf98082';
const title = 'Updated Database Name';
const propId = 'F%5D%5CZ';
const argv = yargs.default({ databaseId, propId, title }).argv;

const properties = {
  [propId]: {
    name: 'X * Y',
    formula: {
      expression: 'prop("X") * prop("Y")',
    },
  },
};

const params = {
  database_id: argv.databaseId,
  icon: props.icon('💽'),
  title: props.text(argv.title),
  properties,
};

(async () => {
  const database = await notion.databases.update(params);

  log(database);
})();
