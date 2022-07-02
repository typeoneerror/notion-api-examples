/**
 * Provision a Notion User
 *
 * --email, -e: User's email
 * --name, -n:  Full name of the User
 */

const { scim, yargs, SCIM_SCHEMA_USER } = require('../../shared/scim');

const argv = yargs
  .option('email', {
    alias: 'e',
    describe: "User's email address",
  })
  .option('name', {
    alias: 'n',
    describe: "User's full name",
  })
  .demandOption('email').argv;

(async () => {
  // POST https://api.notion.com/scim/v2/Users

  try {
    const args = {
      userName: argv.email,
    };

    if (argv.name) {
      args.name = {
        formatted: argv.name,
      };
    }

    // Note this will raise a 409 error if user already exists
    const { data: user } = await scim.post('Users', {
      schemas: [SCIM_SCHEMA_USER],
      ...args,
    });

    console.log(user);
  } catch (e) {
    console.log(e);
  }
})();
