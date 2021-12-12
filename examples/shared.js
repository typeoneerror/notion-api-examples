const dotenv = require('dotenv');
const { Client } = require("@notionhq/client");
const yargs = require('yargs/yargs')(process.argv.slice(2));

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

module.exports = {
  notion,
  yargs,
}
