const {
  notion,
  yargs,
} = require('../../shared');

const { log } = require('../../shared/utils');

const pageId = '25f49fa5f4c7410e80b544bb0714856b';
const argv = yargs.default({ pageId }).argv;

(async () => {
  const page = await notion.pages.retrieve({
    page_id: argv.pageId,
  });

  log(page);
})();
