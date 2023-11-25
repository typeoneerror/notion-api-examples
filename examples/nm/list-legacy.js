/**
 * Fetch all legacy customers from the "NM Student Database".
 */

const { RateLimit } = require('async-sema');
const { fetchAllPages } = require('../shared/fetch-pages');
const { log } = require('../shared/utils');
const { setCache } = require('./shared');

const rateLimiter = RateLimit(5);

(async () => {
  const query = {
    filter: {
      and: [
        {
          property: 'Lifetime (A)',
          checkbox: {
            equals: true,
          },
        },
        {
          property: 'Status',
          select: {
            equals: 'Active',
          },
        },
      ],
    },
  };

  const students = await fetchAllPages('9d29ced8e9ba467c84e74fabbbbacc01', query, rateLimiter);

  await setCache('members-legacy', students);

  log(students.length);
})();
