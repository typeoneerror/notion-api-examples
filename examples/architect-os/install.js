const { RateLimit } = require('async-sema');
const _ = require('lodash');

const { notion } = require('../shared');
const { performWithAll } = require('../shared/fetch-pages');
const { log } = require('../shared/utils');

const client = require('./client');
const config = require('./config');

function buildIcon(name, color) {
  return {
    type: 'icon',
    icon: {
      name,
      color,
    },
  };
}

async function updateDatabase(id) {
  const database = await notion.databases.retrieve({
    database_id: id,
  });

  const title = database.title[0].plain_text;
  const updatedTitle = title.startsWith('OS ') ? `${client.prefix} ${title.substring(3)}` : title;

  let icon = database.icon?.icon.name;

  if (!icon) {
    // Perhaps we can get the icon from the underlying data source?
    // FIXME: remove once database API works properly.
    const ds = await notion.dataSources.retrieve({
      data_source_id: database.data_sources[0].id,
    });
    icon = ds.icon.icon.name;
  }

  const params = {
    database_id: database.id,
    title: [{ text: { content: updatedTitle } }],
    icon: buildIcon(icon, client.color),
  };

  return await notion.databases.update(params);
}

async function updateDashboard(id) {
  const page = await notion.pages.retrieve({
    page_id: id,
  });

  const icon = page.icon.icon.name;
  const title = page.properties.title.title[0].plain_text;

  return await notion.pages.update({
    page_id: page.id,
    icon: buildIcon(icon, client.color),
  });
}

async function updatePage([id, type]) {
  if (type === 'dashboard') {
    return await updateDashboard(id);
  }
  return await updateDatabase(id);
}

(async () => {
  const template = await notion.pages.retrieve({
    page_id: client.template_id,
  });

  const { results: blocks } = await notion.blocks.children.list({
    block_id: template.id,
    start_cursor: undefined,
    page_size: 100,
  });

  const isTeamspaceHeading = (block) =>
    block.type === 'heading_2' &&
    block.heading_2.rich_text[0]?.plain_text.startsWith('Teamspace: ');

  const isItem = (block) => block.type === 'child_page' || block.type === 'child_database';

  const groups = _.reduce(
    blocks,
    (acc, block) => {
      if (isTeamspaceHeading(block)) {
        acc.current = block.heading_2.rich_text[0].plain_text
          .replace('Teamspace: ', '')
          .toLowerCase();
        acc.groups[acc.current] = acc.groups[acc.current] || {};
      } else if (block.type === 'heading_1') {
        acc.current = null;
      } else if (acc.current && isItem(block)) {
        const title = block.child_page?.title ?? block.child_database?.title;
        acc.groups[acc.current][block.id] = {
          title,
          type: block.type,
        };
      }
      return acc;
    },
    { current: null, groups: {} },
  ).groups;

  const nonSystemBlocks = _.omit(groups, 'system');
  const systemBlocks = groups.system;

  const ids = _.flatMap(nonSystemBlocks, (group) => _.toPairs(_.mapValues(group, (v) => v.type)));

  performWithAll(ids, updatePage);
})();
