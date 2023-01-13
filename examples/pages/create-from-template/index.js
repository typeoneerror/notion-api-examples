/**
 * Arguments:
 *
 * Note that this only copies over the template's properties.
 *
 * Body copying is in an open PR and there are API limitations
 * which prevent a full example.
 *
 * --template-id: ID of the template to create from
 */

const { yargs } = require('../../shared');
const { createFromTemplate } = require('../../shared/create-from-template');
const titledDate = require('../../shared/titled-date');
const { log } = require('../../shared/utils');

const templateId = '21d0fdf87ed64a938cd4d53245eea43e';
const argv = yargs.default({ templateId }).argv;

(async () => {
  const page = await createFromTemplate(argv.templateId, titledDate('Entry'));

  log(page);
})();
