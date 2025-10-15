const path = require('path');
const { notion, yargs } = require('../shared');
const { uploadCoverImage } = require('../shared/files');
const props = require('../shared/props');
const titledDate = require('../shared/titled-date');
const { log } = require('../shared/utils');

const argv = yargs
  .option('pageId', {
    alias: 'p',
    describe: 'The ID of the page to add the cover to',
  })
  .option('dataSourceId', {
    alias: 'd',
    describe: 'The ID of the data source to create the page in',
    default: process.env.OURA_JOURNAL_DATA_SOURCE_ID,
  }).argv;

const filePath = path.join(__dirname, 'data/example.png');

(async () => {
  let page;

  if (!argv.pageId) {
    // Create a new page
    page = await notion.pages.create({
      parent: {
        type: 'data_source_id',
        data_source_id: argv.dataSourceId,
      },
      icon: props.emoji('📄'),
      properties: titledDate('Journal'),
    });
  } else {
    // Get the existing page
    page = await notion.pages.retrieve({
      page_id: argv.pageId,
    });
  }

  // Upload a file to the page in the "Daily Photo" property
  const upload = await uploadCoverImage(filePath, page);

  log(page);
})();
