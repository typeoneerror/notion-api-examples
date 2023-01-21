/**
 * Create categories mapped from the WordPress website.
 */

const { getPageBy, notion, wp, yargs } = require('./shared');
const { performWithAll } = require('../../../shared/fetch-pages');
const props = require('../../../shared/props');

const databaseId = '3fb1239524a94e7fac5403af482bae8a';
const argv = yargs.default({ databaseId }).argv;

async function createCategory(category) {
  process.stdout.write('.');

  const page = await getPageBy(argv.databaseId, category.name);
  const name = category.name.replace('&amp;', '&');

  const properties = {
    Name: props.pageTitle(category.name),
    'WordPress ID': props.number(category.id),
    'Parent ID': props.number(category.parent),
  };

  const params = {
    icon: props.icon('postcard', 'green'),
    properties,
  };

  if (!page) {
    params.parent = {
      database_id: argv.databaseId,
    };

    return await notion.pages.create(params);
  }

  const parent = await getPageBy(
    argv.databaseId,
    Number(category.parent),
    'WordPress ID',
    'number'
  );

  params.page_id = page.id;

  if (parent) {
    params.properties['Parent'] = {
      type: 'relation',
      relation: [
        {
          id: parent.id,
        },
      ],
    };
  }

  return await notion.pages.update(params);
}

(async () => {
  const { data: categories } = await wp.get('categories', {
    params: {
      per_page: 100,
    },
  });

  await performWithAll(categories, createCategory);
})();
