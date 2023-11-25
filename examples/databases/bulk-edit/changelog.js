/**
 * Arguments:
 *
 * --database-id: ID of the database to create in
 */

const _ = require('lodash');
const { notion, yargs } = require('../../shared');
const { fetchAllPages, performWithAll } = require('../../shared/fetch-pages');
const { emoji } = require('../../shared/props');
const { log } = require('../../shared/utils');

const databaseId = 'e8a07b67d28a432fbd9029f18f3a27b7';
const argv = yargs.default({ databaseId }).argv;

async function editPage(page) {
  process.stdout.write('.');

  let {
    Lesson: { title },
    Date: { date },
  } = page.properties;

  const [dateMentions, otherTitles] = _.partition(
    title,
    (part) => part.type === 'mention' && part.mention.type === 'date'
  );

  if (!(date || _.isEmpty(dateMentions))) {
    [{ mention: date }] = dateMentions;
  } else {
    date = { date };
  }

  const lessonTitles = _.reject(otherTitles, ({ type, plain_text: plainText }) => {
    return type === 'text' && _.isEmpty(plainText.replace(/\s/g, ''));
  });

  const properties = { Lesson: { title: lessonTitles } };
  if (date) {
    properties.Date = date;
  }

  const args = {
    page_id: page.id,
    icon: emoji('🆕'),
    properties,
  };

  return await notion.pages.update(args);
}

(async () => {
  const pages = await fetchAllPages(databaseId);

  await performWithAll(pages, editPage);
})();
