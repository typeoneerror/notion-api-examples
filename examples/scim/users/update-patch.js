/**
 * Update a User via PATCH method
 *
 * NOTE: You can only update a member’s profile information if you have verified
 * ownership of the user’s email domain (this is typically the same as the
 * email domains you have configured for SAML Single Sign-On with Notion).
 *
 * SEE: https://www.notion.so/help/provision-users-and-groups-with-scim
 *
 * NOTE: this raises a 500 error if an email is provided and the email
 *       already exists in Notion as an account. This differs from the
 *       409 status raised by the POST API.
 *
 * --email, e:   Email of User
 * --user-id, u: ID of User to update
 */

const { scim, yargs, SCIM_SCHEMA_PATCH_OP } = require('../../shared/scim');

const userId = '1c401a11-086d-4814-b450-b794d5d75085';
const name = 'Updated Name';
const argv = yargs
  .options({
    e: {
      alias: 'email',
      string: true,
    },
    n: {
      alias: 'name',
      string: true,
    },
    u: {
      alias: 'user-id',
      string: true,
    },
  })
  .default({ name, userId }).argv;

(async () => {
  // PATCH https://api.notion.com/scim/v2/Users/{id}

  try {
    const { data: user } = await scim.patch(`Users/${argv.userId}`, {
      schemas: [SCIM_SCHEMA_PATCH_OP],
      Operations: [
        {
          op: 'Replace',
          path: 'userName',
          value: argv.email,
        },
      ],
    });

    console.log(user);
  } catch (e) {
    console.log('Error', e);
  }
})();
