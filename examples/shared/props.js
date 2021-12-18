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

function icon(emoji) {
  return {
    type: 'emoji',
    emoji,
  };
}

function number(number) {
  return {
    number: Number(number),
  };
}

function richText(content) {
  return {
    rich_text: [
      {
        type: 'text',
        text: {
          content,
        },
      },
    ],
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

function text(content) {
  return [
    {
      type: 'text',
      text: {
        content,
      },
    },
  ];
}

function title(content) {
  return {
    title: text(content),
  };
}

function url(url) {
  return {
    url,
  };
}

module.exports = {
  date,
  icon,
  number,
  richText,
  select,
  timestamps,
  text,
  title,
  url,
};
