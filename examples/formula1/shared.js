const { default: axios } = require('axios');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

const {
  notion,
  yargs,
} = require('../shared');

const { log } = require('../shared/utils');
const props = require('../shared/props');

// https://www.notion.so/okidoki/Formula-n-af6bf67b991c4de5a607e10de99d7cf3
const dashboardId = 'af6bf67b991c4de5a607e10de99d7cf3';

const ergastBaseUrl = 'https://ergast.com/api/f1'
const tmpDir = path.join(__dirname, 'tmp');

async function ergast(resource, dataProp, params = {}) {
  const query = new URLSearchParams(params);
  const buff = Buffer.from(query.toString(), 'utf-8').toString('base64');
  const fileName = `${resource}.${buff}.json`
  const cachePath = path.join(tmpDir, fileName);

  if (fs.existsSync(cachePath)) {
    return JSON.parse(
      fs.readFileSync(cachePath, {
        encoding: 'utf-8',
        flag: 'r',
      })
    );
  }

  const url = new URL(`${ergastBaseUrl}/${resource}.json`);
  url.search = query;

  try {
    const { data: { MRData } } = await axios.get(url.href);
    const data = _.get(MRData, dataProp);

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    fs.writeFileSync(cachePath, JSON.stringify(data), 'utf-8');

    return data;
  } catch (error) {
    console.error(error.toString());
  }
}

module.exports = {
  dashboardId,
  ergast,
  log,
  notion,
  props,
  yargs,
}

