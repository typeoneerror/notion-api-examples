const { notion } = require('.');
const { RateLimit } = require('async-sema');

const rateLimiter = RateLimit(1, {
  timeUnit: 2000,
  uniformDistribution: true,
});

async function fetchPages(databaseId, query = null, startCursor = undefined, pageSize = 100) {
  let params = {
    database_id: databaseId,
    page_size: pageSize,
    start_cursor: startCursor,
  };

  if (query) {
    params = { ...params, ...query };
  }

  return await notion.databases.query(params);
}

async function fetchAllPages(databaseId, query = undefined, limit = rateLimiter) {
  let pages = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    await limit();

    const response = await fetchPages(databaseId, query, startCursor);

    pages = pages.concat(response.results);

    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }

  return pages;
}

async function performWithAll(pages, method, limit = rateLimiter) {
  return await Promise.all(
    pages.map(async (page) => {
      await limit();

      return await method(page);
    })
  );
}

module.exports = {
  fetchAllPages,
  fetchPages,
  performWithAll,
  rateLimiter,
};
