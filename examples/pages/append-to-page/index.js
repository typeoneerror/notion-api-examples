/**
 * Append a block to a page.
 *
 * NOTE: this example is broken intentionally as "to_do" blocks
 * raise an error in the API as of Sep 13, 2023.
 *
 * Arguments:
 *
 * --block-id: ID of the parent page to append to.
 */

const { notion, yargs } = require('../../shared');
const props = require('../../shared/props');
const { log } = require('../../shared/utils');

const blockId = 'c8a2020164d843f59ab23a59e5353ace';
const argv = yargs.default({ blockId }).argv;

const params = {
  block_id: blockId,
  children: [
    {
      to_do: {
        rich_text: [
          {
            text: {
              content: 'Finish goals',
            },
          },
        ],
      },
    },
  ],
};

(async () => {
  const block = await notion.blocks.children.append(params);

  log(block);
})();
