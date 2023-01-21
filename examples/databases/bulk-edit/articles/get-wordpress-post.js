const { wp, yargs } = require('./shared');

const slug = 'building-an-urban-farming-business-the-setup-and-numbers';
const argv = yargs.default({ slug }).argv;

(async () => {
  const {
    data: [data],
  } = await wp.get('posts', {
    params: {
      slug: argv.slug,
    },
  });

  const {
    title: { rendered: title },
    yoast_head_json: { description },
  } = data;

  console.log(title);
  console.log(description);
})();
