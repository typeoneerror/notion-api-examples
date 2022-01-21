const { RateLimit } = require('async-sema');
const _ = require('lodash');
const { argv } = require('yargs');
const { notion } = require('./index');
const { log } = require('../shared/utils');

const limit = RateLimit(3);

// Properties we do not want to try to copy from template
const INVALID_PROP_TYPES = ['formula', 'rollup', 'title'];

// Blocks not supported for creation in the Notion API yet
const INVALID_BLOCK_TYPES = ['child_database'];

function pickValidTypes(objects, invalid_types, checkPresence = true) {
  return _.pickBy(objects, (object) => {
    return (
      !invalid_types.includes(object.type) && !(checkPresence && _.isEmpty(object[object.type]))
    );
  });
}

function getTemplateProperties(properties) {
  return _.reduce(
    pickValidTypes(properties, INVALID_PROP_TYPES),
    (props, prop, name) => {
      props[name] = _.pick(prop, [prop.type]);
      return props;
    },
    {}
  );
}

function getBlockValues(blocks) {
  return _.map(pickValidTypes(blocks, INVALID_BLOCK_TYPES, false), (block) => {
    const definition = {
      type: block.type,
      [block.type]: block[block.type],
    };

    if (block.children) {
      definition.children = getBlockValues(block.children);
    }

    return definition;
  });
}

async function fetchBlockChildren(blockId, startCursor = null) {
  log(`fetchBlockChildren: ${blockId}, ${startCursor}`);

  const params = {
    block_id: blockId,
    page_size: 100,
  };

  if (startCursor) {
    params.start_cursor = startCursor;
  }

  return await notion.blocks.children.list(params);
}

async function fetchAllBlockChildren(blockId) {
  log(`fetchAllBlockChildren: ${blockId}`);

  let blocks = [];
  let hasMore = true;
  let startCursor = null;

  while (hasMore) {
    await limit();
    const response = await fetchBlockChildren(blockId, startCursor);

    blocks = blocks.concat(response.results);

    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }

  for (const block of blocks) {
    if (block.has_children) {
      await limit();
      block.children = await fetchAllBlockChildren(block.id);
    }
  }

  return blocks;
}

async function createFromTemplate(template, properties, includeBlocks = true) {
  if (typeof template === 'string') {
    template = await notion.pages.retrieve({ page_id: template });
  }

  const templateProperties = getTemplateProperties(template.properties);
  properties = _.assign(templateProperties, properties);

  const params = {
    parent: { database_id: template.parent.database_id },
    icon: template.icon,
    properties,
  };
  // log(template);

  if (includeBlocks) {
    const blocks = await fetchAllBlockChildren(template.id);

    if (!_.isEmpty(blocks)) {
      params.children = getBlockValues(blocks);
    }

    // log(blocks);
    log(params.children);

    // return params;
  }

  return await notion.pages.create(params);
}

module.exports = {
  createFromTemplate,
  getBlockValues,
  getTemplateProperties,
};
