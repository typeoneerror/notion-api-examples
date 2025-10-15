/**
 * Arguments:
 *
 * --data-source-id: ID of the database to create in
 */

const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const titledDate = require('../../shared/titled-date');
const { log } = require('../../shared/utils');

const dataSourceId = 'dd25a489-2480-46c8-afa4-d56cf22c04c6';
const argv = yargs.default({ dataSourceId }).argv;

const params = {
  parent: {
    type: 'data_source_id',
    data_source_id: argv.dataSourceId,
  },
  icon: {
    type: 'external',
    external: {
      url: 'https://www.notion.so/cdn-cgi/image/format=auto,width=640,quality=100/front-static/pages/product/home-page-hero-refreshed-v3.png',
    },
  },
  properties: {
    Name: {
      title: [
        {
          text: {
            content: 'External Icon',
          },
        },
      ],
    },
  },
};

(async () => {
  const page = await notion.pages.create(params);

  log(page);
})();
