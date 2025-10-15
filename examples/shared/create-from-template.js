const { notion } = require('./index');
const _ = require('lodash');

// Properties we do not want to try to copy from template
const INVALID_PROP_TYPES = [
  'created_by',
  'created_time',
  'last_edited_by',
  'last_edited_time',
  'formula',
  'rollup',
  'title',
];

function getTemplateProperties(properties, invalid_types = INVALID_PROP_TYPES) {
  return _.reduce(
    _.pickBy(properties, (prop) => {
      return !invalid_types.includes(prop.type);
    }),
    (props, prop, name) => {
      props[name] = _.pick(prop, [prop.type]);
      return props;
    },
    {}
  );
}

async function createFromTemplate(template, properties) {
  if (typeof template === 'string') {
    template = await notion.pages.retrieve({ page_id: template });
  }

  const templateProperties = getTemplateProperties(template.properties);
  properties = _.assign(templateProperties, properties);

  // FIXME: use data sources
  const params = {
    parent: { database_id: template.parent.database_id },
    icon: template.icon,
    properties,
  };

  return await notion.pages.create(params);
}

module.exports = {
  createFromTemplate,
  getTemplateProperties,
};
