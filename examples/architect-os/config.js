const config = {
  dashboards: {
    hq: {
      title: 'HQ',
      source: 'a0386c317e09461cb70902ac46d590ff',
    },
  },
  databases: {
    calendar: {
      title: 'Calendar',
      id: '37abd6a829a64606a1809fc43e8a31d9',
      date: { property: 'Date' },
    },
    docs: { title: 'Docs', id: '70c5ecb429b44e8982bd1838a2d3ba4e' },
    locations: { title: 'Locations', id: '55689b6a9cb54555b39241f85d744584' },
    people: { title: 'People', id: 'df0959f7f8e947ac9d019ac2f8992df6' },
    projects: {
      title: 'Projects',
      id: '5bdcff6258b246788536d5c642b2fe55',
      date: {
        property: 'Date(s)',
        range: 30,
        overlap: 10,
        filter: { property: 'Status', status: { does_not_equal: 'Done' } },
      },
    },
    resources: { title: 'Resources', id: '5e6a4a95edd544388cf0bf8521175b3b' },
    tasks: {
      title: 'Tasks',
      id: '7da00e0d214448a4ba517f68eb6fee61',
      date: {
        property: 'Date',
        filter: { property: 'Status', status: { does_not_equal: 'Done' } },
      },
    },
    teams: { title: 'Teams', id: '7342bb3680aa431a85759ccc0eb94171' },
    tensions: { title: 'Tensions', id: '566dcc1ac06440d3a0f00a1343b5e215' },
    updates: { title: 'Updates', id: '27cf7cf442aa46388a1f9769d448d57f' },
  },
};

module.exports = config;
