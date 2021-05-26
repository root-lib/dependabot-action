const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs } = require('fs')

const main = async () => {
  // `who-to-greet` input defined in action metadata file
  const path = core.getInput('path');
  console.log(`reading ${path}!....`);
  let content = await fs.readFile(path, 'utf8')
  core.setOutput("ticketLists", content);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

}
main().catch(err => core.setFailed(err.message))
