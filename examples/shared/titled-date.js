const props = require('../shared/props');

function pad(n) {
  return n < 10 ? `0${n}` : n;
}

function titledDate(titlePrefix, date = new Date(), titleProp = 'Name', dateProp = 'Date') {
  const parts = date.toDateString().split(' ').slice(1);
  const dateTitle = `${parts[0]} ${parts[1]}, ${parts[2]}`;

  if (typeof date !== 'string') {
    date = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  return {
    [titleProp]: props.title(`${titlePrefix}: ${dateTitle}`),
    [dateProp]: props.date(date),
  };
}

module.exports = titledDate;
