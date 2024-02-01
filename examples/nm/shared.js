const path = require('path');
const fs = require('fs');
const { RED_COLOR, scim, SCIM_SCHEMA_PATCH_OP, SCIM_SCHEMA_USER } = require('../shared/scim');

async function addMemberToGroup(groupId, userId) {
  // PATCH https://api.notion.com/scim/v2/Groups/{id}

  try {
    const { status, statusText } = await scim.patch(`Groups/${groupId}`, {
      schemas: [SCIM_SCHEMA_PATCH_OP],
      Operations: [
        {
          op: 'Add',
          path: 'members',
          value: [
            {
              value: userId,
            },
          ],
        },
      ],
    });

    console.log(`${status}: ${statusText} - ${userId}`);
  } catch (e) {
    console.log('Error', e);
  }
}

async function removeMemberFromGroup(groupId, userId) {
  // PATCH https://api.notion.com/scim/v2/Groups/{id}

  try {
    const { status, statusText } = await scim.patch(`Groups/${groupId}`, {
      schemas: [SCIM_SCHEMA_PATCH_OP],
      Operations: [
        {
          op: 'Remove',
          path: 'members',
          value: [
            {
              value: userId,
            },
          ],
        },
      ],
    });

    console.log(`${status}: ${statusText} - ${userId}`);
  } catch (e) {
    console.log(RED_COLOR, 'Error', e);
  }
}

async function findMember(userId) {
  try {
    const { data: user } = await scim.get(`Users/${userId}`);

    return {
      id: user.id,
      name: user.name.formatted,
      email: user.userName,
    };
  } catch {
    return;
  }
}

async function findMemberByEmail(email) {
  console.log(`Finding member by email <${email}>`);

  try {
    let {
      data: {
        Resources: [user],
      },
    } = await scim.get('Users', {
      params: {
        filter: `email eq "${email}"`,
        count: 1,
      },
    });

    return user;
  } catch (e) {
    console.log(e);
  }
}

async function findOrProvisionUser(email) {
  let user = await findMemberByEmail(email);

  if (!user) {
    const args = { userName: email };

    // POST https://api.notion.com/scim/v2/Users
    // Note this will raise a 409 error if user already exists
    try {
      const { data } = await scim.post('Users', {
        schemas: [SCIM_SCHEMA_USER],
        ...args,
      });

      user = data;
    } catch ({ response: { status } }) {
      console.log(status);
    }
  }

  return user;
}

async function removeMemberFromWorkspace(userId) {
  try {
    // DELETE https://api.notion.com/scim/v2/Users/{id}
    const { status, statusText } = await scim.delete(`Users/${userId}`);

    console.log(`Removed member (${status}): ${statusText} - ${userId}`);
  } catch ({ response: { status, statusText } }) {
    console.log(RED_COLOR, `Failed to remove member (${status}): ${statusText}`);
  }
}

async function getCache(fileName) {
  const tmpDir = path.join(__dirname, 'data');
  const cachePath = path.join(tmpDir, `${fileName}.json`);

  if (fs.existsSync(cachePath)) {
    return JSON.parse(
      fs.readFileSync(cachePath, {
        encoding: 'utf-8',
        flag: 'r',
      })
    );
  }
}

async function setCache(fileName, data) {
  const tmpDir = path.join(__dirname, 'data');
  const cachePath = path.join(tmpDir, `${fileName}.json`);

  try {
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2), 'utf-8');

    return data;
  } catch (error) {
    console.error(error.toString());
  }
}

module.exports = {
  addMemberToGroup,
  findMember,
  findMemberByEmail,
  findOrProvisionUser,
  removeMemberFromGroup,
  removeMemberFromWorkspace,
  getCache,
  setCache,
};
