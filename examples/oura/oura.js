const { default: axios } = require('axios');
const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
const yargs = require('yargs/yargs')(process.argv.slice(2));

dotenv.config();

// Set up a Notion client
const auth = yargs.argv.notionApiToken || process.env.NOTION_API_TOKEN;
const notion = new Client({ auth });

// Set up an Oura client
const token = yargs.argv.ouraRingToken || process.env.OURA_RING_TOKEN;
const oura = axios.create({
  baseURL: 'https://api.ouraring.com/v2',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

module.exports = {
  notion,
  oura,
  yargs,
};
