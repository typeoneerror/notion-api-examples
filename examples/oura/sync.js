const { parseISO, subDays } = require('date-fns');
const { formatInTimeZone } = require('date-fns-tz');
const { notion, oura, yargs } = require('./oura');

const argv = yargs.argv;

// ID of our Journal database
const databaseId = argv.databaseId || process.env.OURA_JOURNAL_DATABASE_ID;

// Property for lookups and creation
const nameProperty = argv.nameProperty || process.env.OURA_JOURNAL_NAME_PROP || 'Name';
const dateProperty = argv.dateProperty || process.env.OURA_JOURNAL_DATE_PROP || 'Date';

// Prefix entries when creating journal
const namePrefix = argv.namePrefix || process.env.OURA_JOURNAL_NAME_PREFIX || 'Journal: ';

// Date formats
const dateTitleFormat = argv.dateTitleFormat || process.env.OURA_DATE_TITLE_FORMAT || 'MMM d, yyyy';
const dateIsoFormat = 'yyyy-MM-dd';

// Use date-fns to format our dates. Intl API is a nightmare.
let date = new Date();
let timeZone = argv.timezone || process.env.OURA_TIMEZONE || 'America/Los_Angeles';

if (argv.date) {
  date = parseISO(argv.date);
  timeZone = 'UTC';
}

const dateTitle = formatInTimeZone(date, timeZone, dateTitleFormat);
const dateValue = formatInTimeZone(date, timeZone, dateIsoFormat);

/**
 * Finds the most recent day's score for a type (Readiness, Sleep, Activity).
 *
 * We could sent through a single date for the range, but Activity seems to return
 * slightly different results that Readiness and Sleep (which return yesterday AND today)
 * whereas Activity has one result for yesterday.
 *
 * So perhaps you run this script twice a day to make sure you get Activity later!
 *
 * @param {String} type  One of 'readiness', 'sleep', or 'activity'
 *
 * @returns {Number}  Latest score by type
 */
async function fetchOuraScore(type) {
  // GET https://api.ouraring.com/v2/usercollection/daily_<type>?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD

  const endDate = dateValue;
  const startDate = formatInTimeZone(subDays(date, 1), timeZone, dateIsoFormat);

  const uri = `usercollection/daily_${type}?start_date=${startDate}&end_date=${endDate}`;

  const {
    data: { data: entries },
  } = await oura.get(uri);

  if (entries.length) {
    return Number(entries.slice(-1)[0].score);
  }
}

async function fetchOuraScores() {
  return await ['readiness', 'sleep', 'activity'].reduce(async (scores, type) => {
    const score = await fetchOuraScore(type);

    return {
      ...(await scores),
      [type]: score,
    };
  }, {});
}

async function fetchOrCreateJournal() {
  // Query journal by date
  let {
    results: [today],
  } = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: dateProperty,
      date: {
        equals: dateValue,
      },
    },
  });

  // No today? Create it.
  if (!today) {
    const properties = {
      [nameProperty]: {
        title: [
          {
            type: 'text',
            text: {
              content: `${namePrefix}${dateTitle}`,
            },
          },
        ],
      },
      [dateProperty]: {
        date: {
          start: dateValue,
          time_zone: null,
        },
      },
    };

    today = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: databaseId,
      },
      icon: {
        type: 'external',
        external: { url: `https://www.notion.so/icons/drafts_gray.svg` },
      },
      properties,
    });
  }

  return today;
}

async function addOuraProperties({ parent: { database_id: databaseId }, properties }) {
  const requiredProps = ['Readiness', 'Sleep', 'Activity'];
  const newProps = requiredProps.reduce((props, prop) => {
    if (!properties.hasOwnProperty(prop)) {
      props[prop] = { number: {} };
    }
    return props;
  }, {});

  if (Object.keys(newProps).length) {
    await notion.databases.update({
      database_id: databaseId,
      properties: newProps,
    });
  }
}

function ouraProperty(value) {
  return {
    number: Number(value),
  };
}

async function updateJournal(today, scores) {
  const { readiness, sleep, activity } = scores;

  const properties = {
    Readiness: ouraProperty(readiness),
    Sleep: ouraProperty(sleep),
    Activity: ouraProperty(activity),
  };

  return await notion.pages.update({
    page_id: today.id,
    properties,
  });
}

(async function () {
  // Fetch our three Oura scores for Readiness, Sleep, and Activity
  const scores = await fetchOuraScores();

  // Find or create today's journal entry
  const today = await fetchOrCreateJournal();

  // Add number properties for Readiness, Sleep, and Activity (if they don't exist yet)
  await addOuraProperties(today);

  // Update today's journal with Oura statistics
  await updateJournal(today, scores);

  console.log(today.url);
  console.log(scores);
})();
