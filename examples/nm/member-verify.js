const { RateLimit } = require('async-sema');
const { notion } = require('../shared');
const {
  findCircleMember,
  addToAccessGroup,
  CIRCLE_ACCESS_GROUP_AW,
  CIRCLE_ACCESS_GROUP_NM,
} = require('../shared/circle');
const { GREEN_COLOR, RED_COLOR, scim, yargs, GREEN } = require('../shared/scim');
const { log } = require('../shared/utils');
const { addMemberToGroup, groupKeyToId } = require('./shared');

const DATA_SOURCE_ID = '527dfb28-a457-4b45-99d3-8ee18497a725';
const RPS = 2;
const DIV = '~~~~~~~~~~';

const limit = RateLimit(RPS);
const groupKeys = Object.keys(groupKeyToId);

const argv = yargs
  .option('memberId', {
    alias: 'i',
    describe: 'The ID of the member to verify',
  })
  .option('groupId', {
    alias: 'g',
    describe: 'The ID of the group of members to verify',
  })
  .option('groupKey', {
    alias: 'k',
    describe: `Group key (${groupKeys.join(' or ')})`,
    choices: groupKeys,
  }).argv;

async function findStudent(NMID) {
  const {
    results: [student],
  } = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      and: [
        {
          property: 'NMID',
          rich_text: {
            equals: NMID,
          },
        },
        {
          property: 'Status',
          select: {
            equals: 'Active',
          },
        },
        {
          property: 'Program',
          formula: {
            string: {
              equals: 'Notion Mastery',
            },
          },
        },
      ],
    },
  });

  return student;
}

async function verifyMember(NMID) {
  await limit();

  const student = await findStudent(NMID);

  if (!student) {
    const { data: user } = await scim.get(`Users/${NMID}`);
    const email = user.emails.filter((e) => e.primary).map((e) => e.value);

    console.log(RED_COLOR, `No student record by ID <${NMID}> found - ${user.userName} <${email}>`);
    return false;
  }

  let {
    Name: {
      title: [{ plain_text: name }],
    },
    Email: { email: email },
    'Active Membership?': {
      formula: { boolean: activeMembership },
    },
    'Access Expired?': {
      formula: { boolean: accessExpired },
    },
    'Access Expires On': {
      formula: { date: accessExpiresOn },
    },
    Status: {
      select: { name: status },
    },
    'Lifetime (A)': { checkbox: lifetime },
    OKID: {
      formula: { string: OKID },
    },
  } = student.properties;

  const verified = status === 'Active' && (activeMembership || !accessExpired) && !lifetime;

  if (verified) {
    // console.log(GREEN_COLOR, `Verified ${name} with ID ${NMID}`);
    return student;
  } else {
    console.log(RED_COLOR, `Could not verify ${name} with ID ${NMID}`);
    console.log({
      name,
      email,
      accessExpired,
      accessExpiresOn,
      activeMembership,
      status,
      lifetime,
      OKID,
    });
    return false;
  }
}

async function updateCircleEmail(student, circleEmail) {
  return await notion.pages.update({
    page_id: student.id,
    properties: {
      'Circle Email': {
        email: circleEmail,
      },
    },
  });
}

async function grantMemberAccess(student) {
  await limit();

  let {
    Email: { email: email },
    'Circle Email': { email: circleEmail },
    'Previous Email': { email: oldEmail },
    NMID: {
      rich_text: [{ plain_text: NMID }],
    },
  } = student.properties;

  // Add to Architecting Workspaces group in Notion
  await addMemberToGroup(groupKeyToId.aw, NMID);

  const emails = [circleEmail, email, oldEmail].filter(Boolean);

  let circleMember = null;
  for (const circleEmail of emails) {
    circleMember = await findCircleMember(circleEmail);
    if (circleMember) {
      break;
    }
  }

  if (!circleMember) {
    console.log(RED_COLOR, `${NMID} Could not find Circle member <${email}>}`);
  } else {
    // Add to Circle access groups
    await addToAccessGroup(circleMember.email, CIRCLE_ACCESS_GROUP_NM);
    await addToAccessGroup(circleMember.email, CIRCLE_ACCESS_GROUP_AW);
  }
}

(async () => {
  let members = [];

  if (argv.memberId) {
    members = [{ value: argv.memberId }];
  } else {
    const groupKey = argv.groupKey || 'nm';
    const groupId = argv.groupId || groupKeyToId[groupKey];

    // GET https://api.notion.com/scim/v2/Groups/{id}
    const { data: group } = await scim.get(`Groups/${groupId}`);
    members = group.members;
    // members = members.slice(300);
  }

  console.log(`Verifying ${members.length} members...`);

  let vc = 0;
  let fc = 0;

  for (const member of members) {
    const NMID = member.value;

    const verified = await verifyMember(NMID);

    if (verified) {
      vc++;

      await grantMemberAccess(verified);
    } else {
      fc++;
    }
  }

  console.log(GREEN_COLOR, `Verified: ${vc}`);
  console.log(RED_COLOR, `Failed: ${fc}`);
})();
