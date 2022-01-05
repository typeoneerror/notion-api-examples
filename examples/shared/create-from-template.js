const { notion } = require('./index');
const _ = require('lodash');

// Properties we do not want to try to copy from template
const INVALID_PROP_TYPES = ['formula', 'rollup', 'title'];

function getTemplateProperties(properties) {
  return _.reduce(
    _.pickBy(properties, (prop) => {
      return !INVALID_PROP_TYPES.includes(prop.type) && !_.isEmpty(prop[prop.type]);
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
