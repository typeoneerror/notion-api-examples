const { yargs } = require('../../shared');
const { createFromTemplate } = require('../../shared/create-from-template');
const titledDate = require('../../shared/titled-date');
const { log } = require('../../shared/utils');

const templateId = '2aff60e00a314bffb1a53971c9a756ff';
const argv = yargs.default({ templateId }).argv;

(async () => {
  const page = await createFromTemplate(argv.templateId, titledDate('Duty Crew'));

  log(page);
})();
