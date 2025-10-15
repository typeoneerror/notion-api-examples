/**
 * Search a database by query.
 *
 * Arguments:
 *
 * --database-id: database ID to search
 * --query: search string
 * --page-size: how many to fetch per page
 */

const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');

const dataSourceId = '668bd2e3-9307-4438-83b5-75b11376e8a3';

const argv = yargs.default({
  dataSourceId,
  query: '',
  pageSize: 100,
}).argv;

// Search the database for any pages that have a "Task" property (a title property)
// that contains the text "Hall". This is a non-exact match, so would find:
// "Hall of Fame" and "Hall 1 Lighting".
(async () => {
  const response = await notion.dataSources.query({
    data_source_id: argv.dataSourceId,
    query: argv.query,
    filter: {
      property: 'Task',
      rich_text: {
        contains: 'Hall',
      },
    },
    page_size: argv.pageSize,
  });

  log(response.results);
})();
