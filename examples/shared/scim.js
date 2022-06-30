const dotenv = require('dotenv');
const { default: axios } = require('axios');
const yargs = require('yargs/yargs')(process.argv.slice(2));

const SCIM_BASE_URL = 'https://api.notion.com/scim/v2/';
const SCIM_SCHEMA_BASE = 'urn:ietf:params:scim:schemas:core:2.0:';
const SCIM_SCHEMA_GROUP = `${SCIM_SCHEMA_BASE}Group`;
const SCIM_SCHEMA_USER = `${SCIM_SCHEMA_BASE}User`;
const SCIM_SCHEMA_PATCH_OP = 'urn:ietf:params:scim:api:messages:2.0:PatchOp';

dotenv.config();

const auth = yargs.argv.notionScimToken || process.env.NOTION_SCIM_TOKEN;

const scim = axios.create({
  baseURL: SCIM_BASE_URL,
  headers: {
    Authorization: `Bearer ${auth}`,
  },
});

module.exports = {
  SCIM_SCHEMA_GROUP,
  SCIM_SCHEMA_PATCH_OP,
  SCIM_SCHEMA_USER,
  scim,
  yargs,
};
