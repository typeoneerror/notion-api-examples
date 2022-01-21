const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const titledDate = require('../../shared/titled-date');
const { log } = require('../../shared/utils');

const databaseId = '9e0d31a2f1bb41a1992b4e6f7f122a5f';
const argv = yargs.default({ databaseId }).argv;

const params = {
  parent: {
    database_id: argv.databaseId,
  },
  icon: props.icon('👨‍🚒'),
  properties: titledDate('Duty Crew'),
  children: [
    {
      type: 'paragraph',
      paragraph: {
        text: [
          {
            type: 'text',
            text: {
              content: 'Level 1',
            },
          },
        ],
        children: [
          {
            type: 'paragraph',
            text: [
              {
                type: 'text',
                text: {
                  content: 'Level 2',
                },
              },
            ],
          },
        ],
      },
    },
  ],
};

(async () => {
  const page = await notion.pages.create(params);

  log(page);
})();
