const { notion, yargs } = require('../shared');
const { log } = require('../shared/utils');

const dataSourceId = 'acce37c4c4ee4b78aa786a944c2577cf';
const template = 'default';
const argv = yargs.default({ dataSourceId, template }).argv;

(async () => {
  // Existing endpoint POST /v1/pages
  // template[type]=none (default behavior) doesn't use a template
  // template[type]=default uses the default template
  // template[type]=template_id; template[template_id]=... uses the provided template id

  const template = !['none', 'default'].includes(argv.template)
    ? { type: 'template_id', template_id: argv.template }
    : { type: argv.template };

  const params = {
    parent: {
      type: 'data_source_id',
      data_source_id: argv.dataSourceId,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: 'Example page',
            },
          },
        ],
      },
    },
    template,
  };

  const page = await notion.pages.create(params);

  log(page);
})();
