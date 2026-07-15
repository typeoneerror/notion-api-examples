/**
 * Change access from one email to another.
 */

const { notion } = require('../shared');
const { RED_COLOR, yargs } = require('../shared/scim');

const {
  addMemberToGroup,
  findMemberByEmail,
  findOrProvisionUser,
  groupKeyToId,
  removeMemberFromWorkspace,
} = require('./shared');

const groupKeys = Object.keys(groupKeyToId);

const argv = yargs
  .option('groupId', {
    alias: 'g',
    describe: 'The ID of the group to add the User to',
  })
  .option('groupKey', {
    alias: 'k',
    describe: `Group key (${groupKeys.join(' or ')})`,
    choices: groupKeys,
  })
  .option('old', {
    alias: 'o',
    describe: "User's current email address",
    demand: true,
  })
  .option('new', {
    alias: 'n',
    describe: "User's new email address",
    demand: true,
  })
  .boolean('aw')
  .default({ aw: true }).argv;

const dataSourceId = '527dfb28-a457-4b45-99d3-8ee18497a725';

(async () => {
  const groupKey = argv.groupKey || 'nm';
  const groupId = argv.groupId || groupKeyToId[groupKey];
  const { old: oldEmail, new: newEmail, aw: includeAW } = argv;

  // Find the old member
  const oldMember = await findMemberByEmail(oldEmail);
  if (!oldMember) {
    return console.log(RED_COLOR, `No member by email <${oldEmail}> found`);
  }

  // Provision the new member
  const user = await findOrProvisionUser(newEmail);
  if (!user.id) {
    return console.log(RED_COLOR, 'Could not find or provision user');
  }

  // Add new user to groups
  await addMemberToGroup(groupId, user.id);
  if (includeAW) {
    await addMemberToGroup(groupKeyToId.aw, user.id);
  }

  // Remove old user from workspace
  await removeMemberFromWorkspace(oldMember.id);

  // Fetch the record in the student database by the previous email
  const {
    results: [student],
  } = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: 'Email',
      email: {
        equals: oldEmail,
      },
    },
  });

  if (!student) {
    return console.log(RED_COLOR, `No student record by email <${oldEmail}> found`);
  }

  // Update the emails and NMID in student database
  await notion.pages.update({
    page_id: student.id,
    properties: {
      Email: {
        email: newEmail,
      },
      'Previous Email': {
        email: oldEmail,
      },
      'Circle Email': {
        email: oldEmail,
      },
      'CK Email': {
        email: oldEmail,
      },
      NMID: {
        rich_text: [
          {
            text: {
              content: user.id,
            },
          },
        ],
      },
    },
  });

  // Comment on student record noting the change
  await notion.comments.create({
    parent: {
      type: 'page_id',
      page_id: student.id,
    },
    rich_text: [{ text: { content: `${oldEmail} - ${oldMember.id}` } }],
  });
})();
