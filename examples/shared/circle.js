const dotenv = require('dotenv');
const { default: axios } = require('axios');
const yargs = require('yargs/yargs')(process.argv.slice(2));

const CIRCLE_BASE_URI = 'https://app.circle.so/api/v1/';

dotenv.config();

const token = yargs.argv.circleToken || process.env.CIRCLE_API_TOKEN;
const communityId = yargs.argv.communityId || process.env.CIRCLE_COMMUNITY_ID || 493;

const circle = axios.create({
  baseURL: CIRCLE_BASE_URI,
  headers: {
    Authorization: `Token ${token}`,
  },
});

async function findCircleMember(email) {
  // GET https://app.circle.so/api/v1/community_members/search

  const { data } = await circle.get('community_members/search', {
    params: {
      community_id: communityId,
      email,
    },
  });

  if (data.success === false) {
    return false;
  }

  return data;
}

async function removeCircleMember(email) {
  // DELETE https://app.circle.so/api/v1/community_members
  const { data } = await circle.delete('community_members', {
    params: {
      community_id: communityId,
      email,
    },
  });

  return data.success;
}

async function findAndRemoveCircleMember(email) {
  const circleMember = await findCircleMember(email);

  if (circleMember) {
    console.log(`CIRCLE: Removing circle member <${email}>`);

    await removeCircleMember(email);
  } else {
    console.log(`CIRCLE: No circle member for <${email}>`);
  }
}

module.exports = {
  circle,
  findAndRemoveCircleMember,
  findCircleMember,
  removeCircleMember,
};
