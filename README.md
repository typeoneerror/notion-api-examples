# Notion API Examples

This is a Notion API playground.

You can find some Notion API examples in the aptly named "examples" directory.

## Set up

If you're using nvm, you can `nvm install` and then `nvm use`, otherwise, you will need to [install node](https://nodejs.org/en/download/) to run these example scripts. If you're not sure, download the LTS version for your platform.

Once you've done this, make sure the following command outputs the node version when run inside this project's directory:

```
node --version
```

From the root directory of this project, run:

```
npm install
```

Create a _.env_ file in the root directory of this project and add your Notion API Token there (after the `=` in the example below).

```
NOTION_API_TOKEN=secret_abc123
```

Now all the scripts in the examples folder will use your token.

**Be very careful not to commit your Notion API token to the repository if you create a fork of this repository.**

## Running Examples

In general, you will select a file in the _examples_ directory and run it with `node`:

```
node examples/databases/sort-multi-select/index.js
```

Most scripts have parameters that can be passed via the command line. The defaults of these are all using _my_ stuff, so you will either have to change them in the code, or use the command line arguments.

Example:

```
node examples/databases/sort-multi-select/index.js --database-id=DATABASE_ID --sort-prop=PROPERTY_NAME --no-case-sensitive
```

### Parameters

I will add comments to the top of each script indicating parameters that can be specified (WIP), but the following are always available to all scripts:

- `--notion-api-token` overrides the var `NOTION_API_TOKEN` if specified in .env file. Must be provided for all scripts if not set in .env file.

## Caveats

There is very little error handling in these examples. Mostly because I want to fail hard and see the errors. So you will see very few `try...catch` statements throughout. You will want to handle errors gracefully in real-world scenarios.
