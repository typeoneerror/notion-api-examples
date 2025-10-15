const { notion } = require('.');
const { RateLimit } = require('async-sema');

const rateLimiter = RateLimit(1, {
  timeUnit: 2000,
  uniformDistribution: true,
});

async function fetchPages(dataSourceId, query = null, startCursor = undefined, pageSize = 100) {
  if (startCursor) {
    console.log(`Fetching pages starting at ${startCursor}`);
  }

  let params = {
    data_source_id: dataSourceId,
    page_size: pageSize,
    start_cursor: startCursor,
  };

  if (query) {
    params = { ...params, ...query };
  }

  return await notion.dataSources.query(params);
}

async function fetchAllPages(dataSourceId, query = undefined, limit = rateLimiter) {
  let pages = [];
  let hasMore = true;
  let startCursor = undefined;

  while (hasMore) {
    await limit();

    const response = await fetchPages(dataSourceId, query, startCursor);

    pages = pages.concat(response.results);

    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }

  return pages;
}

async function performWithAll(pages, method, args = [], limit = rateLimiter) {
  return await Promise.all(
    pages.map(async (page) => {
      await limit();

      return await method.call(null, page, ...args);
    })
  );
}

module.exports = {
  fetchAllPages,
  fetchPages,
  performWithAll,
  rateLimiter,
};
