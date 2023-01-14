const orderBy = require('lodash/orderBy');
const { RateLimit } = require('async-sema');

const { dashboardId, ergast, log, notion, props } = require('./shared');

const DB_TITLE = 'F1 Circuits';

// Writes to databases need a lot of time to settle, so we'll
// limit our requests to 1 per 2 seconds. In real scenario, we'd want to push
// these to some sort of background queuing system and allow them to be retried
// when they fail.
const limit = RateLimit(1, { timeUnit: 2000, uniformDistribution: true });

async function createCircuitsDatabase() {
  const response = await notion.search({
    query: DB_TITLE,
  });

  if (response.results.length) {
    console.log(`Using existing database ${response.results[0].id}`);

    return response.results[0];
  }

  const properties = {
    'Circuit Name': { title: {} },
    'Circuit Id': { rich_text: {} },
    Locality: { select: {} },
    Country: { select: {} },
    Latitude: { number: {} },
    Longitude: { number: {} },
    URL: { url: {} },
    ...props.timestamps(),
  };

  console.log(`Creating "${DB_TITLE}" database`);

  return await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: dashboardId,
    },
    icon: props.emoji('🛤️'),
    title: [props.text(DB_TITLE)],
    properties,
  });
}

async function fetchCircuits() {
  console.log('Fetching circuits from ergast API');

  const circuits = await ergast('circuits', 'CircuitTable.Circuits', {
    limit: 100,
  });

  return orderBy(circuits, 'circuitName', 'desc');
}

async function createCircuit(database, circuit) {
  process.stdout.write('.');

  const {
    Location: { country, lat, locality, long },
  } = circuit;

  const properties = {
    'Circuit Name': props.pageTitle(circuit.circuitName),
    'Circuit Id': props.richText(circuit.circuitId),
    Locality: props.select(locality),
    Country: props.select(country),
    Latitude: props.number(lat),
    Longitude: props.number(long),
    URL: props.url(circuit.url),
  };

  return await notion.pages.create({
    parent: {
      database_id: database.id,
    },
    properties,
  });
}

async function createCircuits(database, circuits) {
  process.stdout.write('Creating circuits...');

  return await Promise.all(
    circuits.map(async (circuit) => {
      await limit();
      return await createCircuit(database, circuit);
    })
  );
}

(async () => {
  const circuitsDatabase = await createCircuitsDatabase();
  const ergastCircuits = await fetchCircuits();
  const circuits = await createCircuits(circuitsDatabase, ergastCircuits);

  log(circuits);
})();
