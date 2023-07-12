const { RateLimit } = require('async-sema');
const { addDays, format } = require('date-fns');
const { notion } = require('../shared');
const { fetchAllPages } = require('../shared/fetch-pages');
const config = require('./config');

const { databases } = config;

const limit = RateLimit(1, {
  timeUnit: 2000,
  uniformDistribution: true,
});

const ISO_FORMAT = 'yyyy-MM-dd';

async function updateDates(page, dateProp, startDate, endDate = null) {
  const dateValue = format(startDate, ISO_FORMAT);
  let dateString = dateValue;
  const date = {
    start: dateValue,
    time_zone: null,
  };

  if (endDate) {
    const endDateValue = format(endDate, ISO_FORMAT);
    dateString = `${dateString}—${endDateValue}`;

    date.end = endDateValue;
  }

  const properties = {
    [dateProp]: {
      date,
    },
  };

  const title = page.properties.Name.title[0].plain_text;
  console.log(`\t"${title}" -> ${dateString}`);

  return await notion.pages.update({
    page_id: page.id,
    properties,
  });
}

function getDate(page, prop = 'Date') {
  let {
    [prop]: {
      date: { start: date },
    },
  } = page.properties;

  return new Date(date);
}

function validDateConfig(part, defaultValue = 1) {
  if (typeof part === 'number' && !isNaN(part) && isFinite(part)) {
    return part;
  }
  return defaultValue;
}

(async function () {
  const entries = Object.entries(databases).filter(([, db]) => 'date' in db);

  for (const [key, conf] of entries) {
    let {
      id,
      date: { property: dateProp, range, overlap, filter },
      title: dbTitle,
    } = conf;

    console.log(`Updating ${dbTitle} dates (${id})...`);

    const database = await notion.databases.retrieve({ database_id: id });
    const query = filter ? { filter } : null;
    const pages = await fetchAllPages(id, query);

    const sortedPages = pages.sort((a, b) => {
      return getDate(a, dateProp) - getDate(b, dateProp);
    });

    range = validDateConfig(range, 1);
    overlap = validDateConfig(overlap, 0);

    let increment = range - overlap;
    let counter = 0;

    for (const page of sortedPages) {
      await limit();

      let startDate = addDays(new Date(), counter);
      let endDate = increment > 1 ? addDays(startDate, range) : null;

      await updateDates(page, dateProp, startDate, endDate);

      counter += increment;
    }
  }
})();
