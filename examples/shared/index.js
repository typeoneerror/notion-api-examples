const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
const yargs = require('yargs/yargs')(process.argv.slice(2));

dotenv.config();

const auth = yargs.argv.notionApiToken || process.env.NOTION_API_TOKEN;
const notion = new Client({ auth });

module.exports = {
  notion,
  yargs,
};
