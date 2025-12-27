/**
 * Arguments:
 *
 * --page-id (-p): ID of the page to move
 * --target-page-id (-t): ID of the page to move to
 * --target-data-source-id (-d): ID of the data source to move to
 */

const { notion, yargs } = require('../../shared');
const { log } = require('../../shared/utils');

// 2af1c1cce3f3802985bdecfa26194f94 (page)
// 2ae1c1cce3f3815a8140ce2cac1a27b8 (target page)
// 2ce1c1cce3f3800592fb000b3279a7d2 (target data source)

const argv = yargs
  .option('pageId', {
    alias: 'p',
    describe: 'The ID of the block to move',
    demand: true,
  })
  .option('targetPageId', {
    alias: 't',
    describe: 'The ID of the page to move the selected block to',
  })
  .option('targetDataSourceId', {
    alias: 'd',
    describe: 'The ID of the data source to move the selected block to',
  }).argv;

(async () => {
  let page = await notion.pages.retrieve({
    page_id: argv.pageId,
  });

  let type;
  let target;

  // Find the target
  if (argv.targetPageId) {
    type = 'page_id';
    target = await notion.pages.retrieve({
      page_id: argv.targetPageId,
    });
  } else {
    type = 'data_source_id';
    target = await notion.dataSources.retrieve({
      data_source_id: argv.targetDataSourceId,
    });
  }

  // Move the block
  // SEE: https://developers.notion.com/reference/move-page

  page = await notion.pages.move({
    page_id: page.id,
    parent: {
      type,
      [type]: target.id,
    },
  });

  log(page);
})();
