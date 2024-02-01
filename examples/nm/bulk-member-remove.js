const { RateLimit } = require('async-sema');
const { findMember, getCache, removeMemberFromWorkspace } = require('./shared');
const { notion } = require('../shared');
const { findAndRemoveCircleMember } = require('../shared/circle');
const { findAndTagConvertkitSubscriber } = require('../shared/convertkit');
const { RED_COLOR, yargs } = require('../shared/scim');

const argv = yargs.option('i', {
  alias: 'id',
  type: 'string',
  describe: 'The ID of the Student in the Student database',
}).argv;

const RPS = 1;
const limit = RateLimit(RPS);
const DIV = '~~~~~~~~~~';

async function removeMember(user) {
  await limit();

  const memberName = user['Name'];
  const email = user['Email'];
  const NMID = user['NMID'];
  const OKID = user['OKID'];
  const previousEmail = user['Previous Email'];

  console.log(`Removing ${memberName} <${email}> (${NMID})`);

  const member = await findMember(NMID);
  if (member) {
    await removeMemberFromWorkspace(NMID);
    // await removeMemberFromGroup('7d3e5712-a873-43a8-a4b5-2ab138a9e2ea', NMID);
  } else {
    console.log(RED_COLOR, `Could not find ${memberName} <${email}> (${NMID})`);
  }

  await findAndRemoveCircleMember(email);
  if (previousEmail && previousEmail != email) {
    await findAndRemoveCircleMember(previousEmail);
  }

  await findAndTagConvertkitSubscriber(email);
  if (previousEmail && previousEmail != email) {
    await findAndTagConvertkitSubscriber(previousEmail);
  }

  return await notion.pages.update({
    page_id: OKID,
    properties: {
      Status: {
        select: {
          name: 'Removed',
        },
      },
    },
  });
}

(async () => {
  let users = [];

  if (argv.id) {
    const { properties } = await notion.pages.retrieve({
      page_id: argv.id,
    });

    let {
      Name: {
        title: [{ plain_text: Name }],
      },
      Email: { email: Email },
      NMID: {
        rich_text: [{ plain_text: NMID }],
      },
      'Previous Email': { email: previousEmail },
    } = properties;

    users = [
      {
        Name,
        Email,
        NMID,
        OKID: argv.id,
        'Previous Email': previousEmail,
      },
    ];
  } else {
    users = await getCache('members-expired');
  }

  console.log(`Removing ${users.length} members`);
  console.log(DIV);

  for (const user of users) {
    await removeMember(user);
    console.log(DIV);
  }

  console.log(`${users.length} removed`);
})();
