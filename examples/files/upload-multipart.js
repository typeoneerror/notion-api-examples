const path = require('path');
const { notion, yargs } = require('../shared');
const { uploadFileAttachment, attachFileToPage } = require('../shared/files');
const props = require('../shared/props');
const titledDate = require('../shared/titled-date');
const { log } = require('../shared/utils');

const argv = yargs.argv;
const databaseId = argv.databaseId || process.env.OURA_JOURNAL_DATABASE_ID;

const filePath = path.join(__dirname, 'data/example.mp4');
const properties = titledDate('Uploaded Video');

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
  const upload = await uploadFileAttachment(filePath, page, 'Daily Photo', 'Video File');

  // Upload a video to the page's body
  // Block type is inferred from the file's content type
  await attachFileToPage(upload, page);

  log(page);
})();
