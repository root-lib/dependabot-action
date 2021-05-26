const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs } = require('fs')

const main = async () => {

  const path = core.getInput('path');
  console.log(`reading ${path}!....`);
  let content = await fs.readFile(path, 'utf8');
  resultSet=content.data.repository.vulnerabilityAlerts;
  totalAlerts=resultSet.totalCount;
  vulnList=resultSet.nodes;
  vulnList.forEach(element => {
    createdDate=element.createdDate;
    packageName=element.securityVulnerability.package.packageName;
    var days =  Math.floor((Date.parse(new Date())-Date.parse(createdDate)  ) / 86400000);
    if(days===0) {
      console.log(`${packageName} created at ${createdDate}`);
    }
  });
  for (const key in resultSet.nodes) {
    if (Object.hasOwnProperty.call(object, key)) {
      const element = object[key];
      
    }
  }
  core.setOutput("ticketLists", content);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);

}
main().catch(err => core.setFailed(err.message))
