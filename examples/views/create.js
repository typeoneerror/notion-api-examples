/**
 * Creates a new table view for a data source with custom properties,
 * filters, sorts, and grouping configuration.
 *
 * Arguments:
 *
 * --data-source-id, -d: ID of the data source to create a view for
 * --database-id, -b: ID of the database to create a top-level view in (optional)
 */

const { notion, yargs } = require('../shared');
const { mergeViewProperties } = require('../shared/props');
const { log } = require('../shared/utils');

const dataSourceId = '45808fcd2698412a97df10e19c36cc21';
const databaseId = 'a48377a8442142f19d7ef89211fce07d';

const argv = yargs
  .option('dataSourceId', {
    alias: 'd',
    default: dataSourceId,
  })
  .option('databaseId', {
    alias: 'b',
    default: databaseId,
  }).argv;

(async () => {
  let { properties } = await notion.dataSources.retrieve({
    data_source_id: argv.dataSourceId,
  });

  const customProps = [
    {
      property_id: '}Ulu',
      visible: true,
      status_show_as: 'checkbox',
      width: 32,
    },
    {
      property_id: '~IY^',
      visible: true,
      width: 32,
    },
    {
      property_id: 'title',
      visible: true,
      wrap: true,
    },
    {
      property_id: 'k\\Sg',
      visible: true,
    },
    {
      property_id: '4]f9',
      visible: true,
      width: 300,
    },
  ];

  properties = mergeViewProperties(properties, customProps);

  const params = {
    data_source_id: argv.dataSourceId,
    name: 'My New View',
    type: 'table',
    position: {
      type: 'start',
    },
    filter: {
      // FIXME: ME?
      and: [
        {
          property: '}Ulu',
          status: {
            does_not_equal: 'Done',
          },
        },
      ],
    },
    quick_filters: {
      // FIXME: Today?
      Date: {
        date: {
          this_week: {},
        },
      },
      // FIXME: Me?
      // Owner: {
      //   people: { contains: '' },
      // },
    },
    sorts: [
      {
        property: 'Date',
        direction: 'ascending',
      },
    ],
    configuration: {
      type: 'table',
      properties,
      group_by: {
        type: 'relation',
        property_id: '4]f9',
        sort: {
          type: 'ascending',
        },
        hide_empty_groups: true,
      },
      subtasks: {
        display_mode: 'flattened',
        filter_scope: 'parents_and_subitems',
        toggle_column_id: 'title',
      },
      show_vertical_lines: false,
    },
  };

  // Add database_id if provided for top-level views
  if (argv.databaseId) {
    params.database_id = argv.databaseId;
  }

  const view = await notion.views.create(params);

  log(view);
})();
