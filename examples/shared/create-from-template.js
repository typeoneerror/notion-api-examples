const { notion } = require('./index');
const _ = require('lodash');

function getTemplateProperties(properties) {
  return _.reduce(
    _.pickBy(properties, (prop) => {
      return prop.type !== 'title' && !_.isEmpty(prop[prop.type]);
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
