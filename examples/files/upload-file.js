const path = require('path');
const { notion, yargs } = require('../shared');
const { uploadFileAttachment, attachFileToPage } = require('../shared/files');
const props = require('../shared/props');
const titledDate = require('../shared/titled-date');
const { log } = require('../shared/utils');

const argv = yargs.argv;
const databaseId = argv.databaseId || process.env.OURA_JOURNAL_DATABASE_ID;

const filePath = path.join(__dirname, 'data/example.txt');
const properties = titledDate('Uploaded File');

const params = {
  parent: {
    type: 'database_id',
    database_id: databaseId,
  },
  icon: props.emoji('📄'),
  properties,
};

(async () => {
  // Create a new page
  const page = await notion.pages.create(params);

  // Upload a file to the page in the "Daily Photo" property
  const upload = await uploadFileAttachment(filePath, page, 'Daily Photo', 'Example File');

  // Upload a file to the page's body
  await attachFileToPage(upload, page, 'Example File');

  log(page);
})();
