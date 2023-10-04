const { notion } = require('../shared');
const { fetchAllPages, performWithAll } = require('../shared/fetch-pages');
const { log } = require('../shared/utils');
const { getCache } = require('./shared');

const studentsDbId = '9d29ced8e9ba467c84e74fabbbbacc01';

async function updateStudent(page, users) {
  const {
    properties: {
      Email: { email },
    },
  } = page;

  const user = users.find((m) => {
    return m['email'] == email;
  });

  let properties = {
    Missing: {
      checkbox: false,
    },
  };

  if (user) {
    properties = {
      ...properties,
      NMID: {
        rich_text: [
          {
            text: {
              content: user['id'],
            },
          },
        ],
      },
    };
  } else {
    properties.Missing.checkbox = true;
  }

  // log(page.properties.Name.title[0].plain_text);
  // log(properties);

  return await notion.pages.update({
    page_id: page.id,
    properties,
  });
}

(async () => {
  const users = await getCache('members');

  const pages = await fetchAllPages(studentsDbId, {
    filter: {
      and: [
        {
          property: 'NMID',
          rich_text: {
            is_empty: true,
          },
        },
        {
          property: 'Status',
          select: {
            equals: 'Active',
          },
        },
        {
          property: 'Missing',
          checkbox: {
            equals: false,
          },
        },
      ],
    },
  });

  // console.log(pages.length);

  await performWithAll(pages, updateStudent, [users]);
})();
