/**
 * Add a new or existing Member to the "AW Alpha" group in Notion
 * and the "Architecting Workspaces" access group in Circle
 */

const { notion } = require('../shared');
const { findCircleMember, addToAccessGroup } = require('../shared/circle');
const { yargs, RED_COLOR } = require('../shared/scim');
const { findMember, addMemberToGroup } = require('./shared');

const argv = yargs
  .option('groupId', {
    alias: 'g',
    describe: 'The ID of the group to add the User to',
    demand: true,
    default: '2ebb373f-3023-4e43-a81d-a62cb3292f06',
  })
  .option('email', {
    alias: 'e',
    describe: "User's email address",
    demand: true,
  }).argv;

const dataSourceId = '527dfb28-a457-4b45-99d3-8ee18497a725';

async function findStudentByEmail(email) {
  const {
    results: [student],
  } = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: 'Email',
      email: {
        equals: email,
      },
    },
  });

  return student;
}

async function tagStudent(student) {
  const params = {
    page_id: student.id,
    properties: {
      Tags: {
        multi_select: [{ name: 'Architecting Workspaces' }],
      },
    },
  };

  await notion.pages.update(params);
}

(async () => {
  console.info(`Finding student <${argv.email}>...`);

  const student = await findStudentByEmail(argv.email);

  if (!student) {
    return console.log(RED_COLOR, `No student record by email <${argv.email}> found`);
  }

  console.info('Tagging student...');

  await tagStudent(student);

  let {
    Name: {
      title: [{ plain_text: name }],
    },
    Email: { email: email },
    NMID: {
      rich_text: [{ plain_text: NMID }],
    },
    'Circle Email': { email: circleEmail },
  } = student.properties;

  circleEmail = circleEmail || email;

  console.info(`Finding member with ID (${NMID})...`);

  const member = await findMember(NMID);

  if (!member) {
    return console.log(RED_COLOR, `Could not find ${name} <${email}> (${NMID})`);
  }

  console.info(`Adding member to group (${argv.groupId})...`);

  await addMemberToGroup(argv.groupId, NMID);

  console.info(`Looking up Circle member <${circleEmail}>...`);

  let circleMember = await findCircleMember(circleEmail);

  if (!circleMember) {
    return console.log(RED_COLOR, `Could not find Circle member <${circleEmail}>`);
  }

  console.info(`Adding to Circle access group...`);

  await addToAccessGroup(circleMember.email);

  console.log('Done!');
})();
