const dotenv = require('dotenv');
const { default: axios } = require('axios');
const yargs = require('yargs/yargs')(process.argv.slice(2));

const CK_BASE_URI = 'https://api.convertkit.com/v3/';

dotenv.config();

const api_token = yargs.argv.ckToken || process.env.CONVERTKIT_API_TOKEN;
const api_secret = yargs.argv.ckSecret || process.env.CONVERTKIT_API_SECRET;

const ck = axios.create({
  baseURL: CK_BASE_URI,
});

ck.interceptors.request.use((config) => {
  // use config.params if it has been set
  config.params = config.params || {};
  // add any client instance specific params to config
  config.params['api_secret'] = api_secret;
  return config;
});

async function findConvertkitSubscriber(email) {
  const {
    data: {
      subscribers: [subscriber],
    },
  } = await ck.get('subscribers', {
    params: {
      email_address: email,
    },
  });

  return subscriber;
}

async function tagConvertkitSubscriber(email, tagId = 4461817) {
  const tag = await ck.post(`tags/${tagId}/subscribe`, {
    email,
  });

  return tag;
}

async function findAndTagConvertkitSubscriber(email) {
  const subscriber = await findConvertkitSubscriber(email);

  if (subscriber) {
    console.log(`CK: Tagging subscriber <${email}>`);

    await tagConvertkitSubscriber(email);
  } else {
    console.log(`CK: No subscriber for <${email}>`);
  }
}

module.exports = {
  ck,
  findAndTagConvertkitSubscriber,
  findConvertkitSubscriber,
  tagConvertkitSubscriber,
};
