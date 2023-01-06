/**
 * "Duplicate" a database without content.
 *
 * See comments in code for explanation and limitations.
 *
 * Arguments:
 *
 * --database-id: ID of the database to duplicate
 * --parent-id: ID of page to add database to
 * --title: Title of the database to create (defaults to "<DATABASE_NAME> (Copy)")
 */

const { notion, yargs } = require('../../shared');
const { getPropertySchema, text } = require('../../shared/props');
const { log } = require('../../shared/utils');

// The database we are duplicating and the page to duplicate it into
const databaseId = 'b4e8a119a37342e099aa452274f78a70';
const parentId = '3925de9e4cb9446197bc45032125320c';
const argv = yargs.default({ databaseId, parentId }).argv;

(async () => {
  // Fetch the database we want to duplicate
  let { icon, properties, title } = await notion.databases.retrieve({
    database_id: argv.databaseId,
  });

  // Use title if supplied, otherwise...
  if (argv.title) {
    title = [text(argv.title)];
  } else {
    // ...add " (Copy)" to the new database title.
    title.push({
      type: 'text',
      text: {
        content: ' (Copy)',
      },
    });
  }

  // Using the existing database's properties, remove extraneous keys
  // and properties not yet supported by the API (status).
  properties = getPropertySchema(properties);

  // Prep database params, including copying over the icon
  const params = {
    icon,
    parent: {
      type: 'page_id',
      page_id: argv.parentId,
    },
    properties,
    title,
  };

  // Create the database
  const database = await notion.databases.create(params);

  log(database);
})();
