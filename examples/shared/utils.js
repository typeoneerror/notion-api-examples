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

function emoji(emoji) {
  return {
    type: 'emoji',
    emoji,
  }
}

function log(object) {
  console.log(JSON.stringify(object, undefined, 2));
}

function title(title) {
  return {
    title: [
      {
        text: {
          content: title,
        }
      },
    ],
  };
}

module.exports = {
  date,
  emoji,
  log,
  title,
}
