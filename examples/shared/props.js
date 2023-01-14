const _ = require('lodash');

function date(start = new Date(), end = null, time_zone = null) {
  const date = {
    start,
    time_zone,
  };

  if (end) {
    date.end = date;
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

module.exports = {
  date,
  emoji,
  getPropertySchema,
  icon,
  number,
  pageTitle,
  richText,
  select,
  timestamps,
  text,
  url,
};
