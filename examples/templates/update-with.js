const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const pageId = '28e1c1cce3f3801fb861f1cf847a861a';
const template = 'default';
const argv = yargs.boolean('eraseContent').default({ pageId, template, eraseContent: false }).argv;

(async () => {
  // template[type]=default uses the default template
  // template[type]=template_id; template[template_id]=... uses the provided template id
  const template =
    argv.template != 'default'
      ? { type: 'template_id', template_id: argv.template }
      : { type: argv.template };

  const params = {
    page_id: argv.pageId,
    template,
    erase_content: argv.eraseContent,
  };

  const page = await notion.pages.update(params);

  log(page);
})();
