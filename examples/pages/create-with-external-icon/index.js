/**
 * Arguments:
 *
 * --database-id: ID of the database to create in
 */

const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const titledDate = require('../../shared/titled-date');
const { log } = require('../../shared/utils');

const databaseId = '688d410fd0e842a2ad399650d34842ba';
const argv = yargs.default({ databaseId }).argv;

const params = {
  parent: {
    database_id: argv.databaseId,
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
