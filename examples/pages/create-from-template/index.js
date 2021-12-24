const { yargs } = require('../../shared');
const { createFromTemplate } = require('../../shared/create-from-template');
const titledDate = require('../../shared/titled-date');
const { log } = require('../../shared/utils');

const templateId = 'da29caf7fb84440f80f2a0ed9804b6e7';
const argv = yargs.default({ templateId }).argv;

(async () => {
  const page = await createFromTemplate(argv.templateId, titledDate('Duty Crew'));

  log(page);
})();
