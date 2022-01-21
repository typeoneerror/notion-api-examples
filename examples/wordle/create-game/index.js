const { notion, yargs } = require('../../shared');
const { createFromTemplate } = require('../../shared/create-from-template');
const titledDate = require('../../shared/titled-date');
const { log } = require('../../shared/utils');
const words = require('./words');

// The "Wordle Words" database ID
const wordsDbId = '6e9aa51b6e284a7280506b595f91bd9c';
// The "Wordle Games" database ID
const gamesDbId = '9e0d31a2f1bb41a1992b4e6f7f122a5f';
// The "-> Wordle Game" template in the same database
const templateId = '2aff60e00a314bffb1a53971c9a756ff';

// Defaults can be supplied via the command line
const argv = yargs.default({
  gamesDbId,
  templateId,
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
      text: {
        equals: randomWord,
      },
    },
  });

  if (!word) {
    throw new Error(`"${randomWord}" could not be found in the Wordle Words database`);
  }

  const params = {
    ...titledDate('Wordle'),
    "Today's Word": {
      relation: [
        {
          id: word.id,
        },
      ],
    },
  };

  const page = await createFromTemplate(argv.templateId, params);

  log(page);
})();
