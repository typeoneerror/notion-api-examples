const _ = require('lodash');

function date(start = new Date(), end = null, time_zone = null) {
  const date = {
    start,
    time_zone,
  };

  if (end) {
    date.end = end;
  }

  return { date };
}

function emoji(name) {
  return {
    type: 'emoji',
    emoji: name,
  };
}

function icon(name, color = 'gray') {
  return {
    type: 'external',
    external: { url: `https://www.notion.so/icons/${name}_${color}.svg` },
  };
}

function number(number) {
  return {
    number: Number(number),
  };
}

function pageTitle(content) {
  return {
    title: [text(content)],
  };
}

function richText(content, link = null) {
  return {
    rich_text: [text(content, link)],
  };
}

function select(name) {
  return {
    select: {
      name,
    },
  };
}

function timestamps() {
  return {
    'Created At': { created_time: {} },
    'Updated At': { last_edited_time: {} },
  };
}

function text(content, link = null) {
  return {
    type: 'text',
    text: {
      content,
      link,
    },
  };
}

function url(url) {
  return {
    url,
  };
}

/**
 * From an existing database, create a schema that can be
 * used to create a new database from the source database.
 */
function getPropertySchema(properties, omitKeys = ['id']) {
  // Cannot create Status with API yet :(
  // Other API limitations include the fact that the database creation
  // end point does not observe the order you supply the properties. They
  // will always be alphabetical after creation. Yet returning the properties
  // in the API will give you neither the order present in the app NOR
  // alphabetical, so that's fun.
  //
  // FIXME: remove status omission when API supports
  return _.pickBy(omitProps(properties, omitKeys), (prop) => prop.type !== 'status');
}

/**
 * Recursively remove properties by key.
 */
function omitProps(properties, keys = 'id') {
  keys = _.keyBy(Array.isArray(keys) ? keys : [keys]);

  function omit(props) {
    return _.transform(props, function (result, value, key) {
      if (key in keys) {
        return;
      }

      result[key] = _.isObject(value) ? omit(value) : value;
    });
  }

  return omit(properties);
}

/**
 * Merge property configurations for views.
 * Takes all properties from a data source and merges them with custom
 * property configurations, maintaining the order of customProps.
 *
 * @param {Object} properties - Properties object from data source
 * @param {Array} customProps - Array of custom property configurations
 * @returns {Array} Merged array with customProps first, then remaining properties
 */
function mergeViewProperties(properties, customProps = []) {
  // Convert all properties to view property format with visible: false
  const allProps = Object.values(properties).map((prop) => ({
    property_id: decodeURIComponent(prop.id),
    visible: false,
  }));

  // Start with customProps to maintain their order, then add remaining props
  const propsMap = new Map(customProps.map((p) => [p.property_id, p]));
  allProps.forEach((p) => {
    if (!propsMap.has(p.property_id)) {
      propsMap.set(p.property_id, p);
    }
  });

  return Array.from(propsMap.values());
}

module.exports = {
  date,
  emoji,
  getPropertySchema,
  icon,
  mergeViewProperties,
  number,
  pageTitle,
  richText,
  select,
  timestamps,
  text,
  url,
};
