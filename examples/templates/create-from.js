const notionAPI = require('../shared/notion-api');
const { yargs } = require('../shared');
const { log } = require('../shared/utils');

const databaseId = '1e7abab87ee8457799c1155cf69d502a';
const template = 'default';
const argv = yargs.default({ databaseId, template }).argv;

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
      type: 'database_id',
      database_id: argv.databaseId,
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

  const { data: page } = await notionAPI.post('/pages', params);

  log(page);
})();
