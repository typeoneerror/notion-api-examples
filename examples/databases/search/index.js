/**
 * Search a database by query.
 *
 * Arguments:
 *
 * --query: search string
 * --page-size: how many to fetch per page
 */

const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');
const orderBy = require('lodash/orderBy');

const argv = yargs.default({
  query: '',
  pageSize: 100,
}).argv;

(async () => {
  const response = await notion.search({
    query: argv.query,
    filter: {
      property: 'object',
      value: 'database',
    },
    page_size: argv.pageSize,
  });

  let databases = response.results.reduce((prev, curr) => {
    prev.push({
      id: curr.id,
      title: curr.title[0].plain_text,
      url: curr.url,
    });

    return prev;
  }, []);

  databases = orderBy(databases, 'title');

  log(databases);
})();
