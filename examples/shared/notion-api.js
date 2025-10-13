
const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const NOTION_VERSION = '2025-09-03'

const NOTION_HEADERS = {
  Authorization: `Bearer ${process.env.NOTION_API_TOKEN}`,
  'Notion-Version': NOTION_VERSION,
};

const JSON_HEADERS = {
  ...NOTION_HEADERS,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const notionAPI = axios.create({
  baseURL: 'https://api.notion.com/v1',
  headers: NOTION_HEADERS,
});

module.exports = notionAPI;
