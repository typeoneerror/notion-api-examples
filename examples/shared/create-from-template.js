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

const ID_PICKER = (value, type, keys = ['id']) => {
  return {
    [type]: value[type].map((object) => _.pick(object, keys)),
  };
};

const PROP_TYPE_MUTATIONS = {
  people: ID_PICKER,
  relation: ID_PICKER,
  none: (value) => value,
};

function getTemplateProperties(
  properties,
  invalid_types = INVALID_PROP_TYPES,
  mutations = PROP_TYPE_MUTATIONS
) {
  return _.reduce(
    _.pickBy(properties, (prop) => {
      return !invalid_types.includes(prop.type);
    }),
    (props, prop, name) => {
      const mutation = mutations[prop.type] ?? mutations['none'];
      props[name] = mutation(_.pick(prop, [prop.type]), prop.type);
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
    parent: { data_source_id: template.parent.data_source_id },
    icon: template.icon,
    properties,
  };

  return await notion.pages.create(params);
}

module.exports = {
  createFromTemplate,
  getTemplateProperties,
};
