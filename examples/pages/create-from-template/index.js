const { yargs } = require('../../shared');
const { createFromTemplate } = require('../../shared/create-from-template');
const props = require('../../shared/props');
const { log } = require('../../shared/utils');

const templateId = 'da29caf7fb84440f80f2a0ed9804b6e7';
const argv = yargs.default({ templateId }).argv;

(async () => {
  const page = await createFromTemplate(argv.templateId, {
    Name: props.title('Duty Crew: Dec 23, 2021'),
    Date: props.date('2021-12-23'),
  });

  log(page);
})();
