const { default: axios } = require('axios');
const { notion, yargs } = require('../../../shared');
const { log } = require('../../../shared/utils');

const BASE_URL = 'https://www.epicgardening.com/';
const SLUG_MATCH = /https?:\/\/www\.epicgardening\.com\/(.*)\//;

const wp = axios.create({
  baseURL: `${BASE_URL}wp-json/wp/v2/`,
});

async function getPageBy(databaseId, search, property = 'Name', type = 'title') {
  const {
    results: [page],
  } = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property,
      [type]: {
        equals: search,
      },
    },
  });

  return page;
}

async function getWordPressPost(slug) {
  const {
    data: [data],
  } = await wp.get('posts', {
    params: {
      slug,
    },
  });

  return data;
}

module.exports = {
  BASE_URL,
  getPageBy,
  getWordPressPost,
  log,
  notion,
  SLUG_MATCH,
  wp,
  yargs,
};
