/**
 * Create a database.
 *
 * Simple example to test creating Formulas via the API.
 *
 * Arguments:
 *
 * --parent-id: ID of page to add database to
 * --title: Title of the database to change to
 */

const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const { log } = require('../../shared/utils');

const title = 'Database Name';
const parentId = 'b9daa4dc5a984e4d92e8f203bdd99749';
const argv = yargs.default({ parentId, title }).argv;

const properties = {
  Name: { title: {} },
  X: { number: {} },
  Y: { number: {} },
  'X + Y': {
    formula: {
      expression: 'prop("X") + prop("Y")',
    },
  },
};

const params = {
  parent: {
    type: 'page_id',
    page_id: argv.parentId,
  },
  icon: props.icon('📀'),
  title: [props.text(argv.title)],
  properties,
};

(async () => {
  const database = await notion.databases.create(params);

  log(database);
})();
