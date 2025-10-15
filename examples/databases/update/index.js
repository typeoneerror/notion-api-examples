/**
 * Update a database.
 *
 * This example updates a formula, renames the database, and switches an icon.
 *
 * Works great when used with the database created with the ../create script!
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

const databaseId = '46956428bdf547bc8fc40263d854dabc';
const title = 'Updated Database Name';
const propId = 'f%5Csj';
const argv = yargs.default({ databaseId, propId, title }).argv;

const properties = {
  [argv.propId]: {
    name: 'X * Y',
    formula: {
      expression: 'prop("X") * prop("Y")',
    },
  },
};

const params = {
  database_id: argv.databaseId,
  icon: props.emoji('💽'),
  title: [props.text(argv.title)],
  properties,
};

(async () => {
  // FIXME: use data sources
  const database = await notion.databases.update(params);

  log(database);
})();
