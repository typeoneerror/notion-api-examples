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
const parentId = '6ee29653d0bf418e8f68b4b9a5a81d88';
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
  icon: props.emoji('📀'),
  title: [props.text(argv.title)],
  properties,
};

(async () => {
  const database = await notion.databases.create(params);

  log(database);
})();
