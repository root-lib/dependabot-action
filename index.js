const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs } = require('fs');
jira_body={
  "fields": {
     "project":
     {
        "key": "SEC"
     },
     "summary": "security ticket sample, report @security if you see this",
     "description": "well i was supposed to be replaced",
     "issuetype": {
        "name": "Bug"
     }
 }
}
jira_headers={
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': ''
}

const main = async () => {

  const path = core.getInput('path');
  console.log(`reading ${path}!....`);
  jira_headers.Authorization='Basic '+core.getInput('token');
  const url = core.getInput('jira_url');
  var config={
    method: 'POST',
    headers: jira_headers,
    body:''
  }
  let content = await fs.readFile(path, 'utf8');
  content = JSON.parse(content);
  resultSet=content.data.repository.vulnerabilityAlerts;
  totalAlerts=resultSet.totalCount;
  vulnList=resultSet.nodes;
  vulnList.forEach(async(element) => {
    createdDate=element.createdDate;
    packageName=element.securityVulnerability.package.packageName;
    var days =  Math.floor((Date.parse(new Date())-Date.parse(createdDate)  ) / 86400000);
    if(days===1) {
      console.log(`${packageName} created at ${createdDate}`);
      jira_body.summary="dependabot-"+packageName+"-"+createdDate;
      jira_body.description="Autocreated for dependabot alerts from github for"+packageName;
      config.body=jira_body;
      const rawResponse = await fetch(url,config);
      const jsonResponse = await rawResponse.json();
      console.log(jsonResponse);
    }
  });
  core.setOutput("ticketLists", content);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);

}
main().catch(err => core.setFailed(err.message))
