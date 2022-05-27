/**
 * Creates a Wordle game instance.
 *
 * @see https://mariepoulin.gumroad.com/l/wordle-in-notion
 *
 * Arguments:
 *
 * --words-db-id: ID of the Wordle Words database
 * --games-db-id: ID of the Wordle Games database
 */

const { formatInTimeZone } = require('date-fns-tz');
const { notion, yargs } = require('../../shared');
const words = require('./words');

// The "Wordle Words" database ID
const wordsDbId = '6e9aa51b6e284a7280506b595f91bd9c';
// The "Wordle Games" database ID
const gamesDbId = '9e0d31a2f1bb41a1992b4e6f7f122a5f';

// Defaults can be supplied via the command line
const argv = yargs.default({
  gamesDbId,
  wordsDbId,
}).argv;

// Pick a word, any word...
const randomWord = words[Math.floor(Math.random() * words.length)];

(async () => {
  const {
    results: [word],
  } = await notion.databases.query({
    database_id: argv.wordsDbId,
    filter: {
      property: 'Word',
      title: {
        equals: randomWord,
      },
    },
  });

  if (!word) {
    throw new Error(`"${randomWord}" could not be found in the Wordle Words database`);
  }

  // Use date-fns to format our dates. Intl API is a nightmare.
  const date = new Date();
  const timeZone = 'America/Los_Angeles';
  const dateTitle = formatInTimeZone(date, timeZone, 'MMM do, yyyy');
  const dateValue = formatInTimeZone(date, timeZone, 'yyyy-MM-dd');

  const params = {
    parent: {
      database_id: argv.gamesDbId,
    },
    icon: {
      type: 'emoji',
      emoji: '🟩',
    },
    properties: {
      Name: {
        title: [
          {
            type: 'text',
            text: {
              content: `Wordle: ${dateTitle}`,
            },
          },
        ],
      },
      Date: {
        date: {
          start: dateValue,
          time_zone: null,
        },
      },
      "Today's Word": {
        relation: [
          {
            id: word.id,
          },
        ],
      },
    },
  };

  const page = await notion.pages.create(params);

  console.log(`Created game board at ${page.url}`);
})();
