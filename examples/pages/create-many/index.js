const { RateLimit } = require('async-sema');
const { notion, yargs } = require('../../shared');
const { createFromTemplate } = require('../../shared/create-from-template');
const titledDate = require('../../shared/titled-date');
const { log } = require('../../shared/utils');

const templateId = 'da29caf7fb84440f80f2a0ed9804b6e7';
const rpsUnit = 2000; // 1 request per 2000ms
const argv = yargs.default({
  rpsUnit,
  templateId,
}).argv;

// Writes to databases need a lot of time to settle, so we'll limit our requests
// to 1 per 2 seconds. In real scenario, we'd want to push these to some sort of
// background queuing system and allow them to be retried when they fail.
const limit = RateLimit(1, {
  timeUnit: argv.rpsUnit,
  uniformDistribution: true,
});

const startDate = new Date(2022, 0, 1);
const endDate = new Date(2022, 11, 31);
const dates = [];
const entryPrefix = 'Journal';

for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
  dates.push(new Date(d));
}

async function createPage(template, date) {
  process.stdout.write('.');

  const properties = titledDate(entryPrefix, date);

  return await createFromTemplate(template, properties);
}

async function createPages(template, dates) {
  return await Promise.all(
    dates.map(async (date) => {
      await limit();
      return await createPage(template, date);
    })
  );
}

(async () => {
  const template = await notion.pages.retrieve({ page_id: argv.templateId });
  const pages = await createPages(template, dates);

  log(pages);
})();
