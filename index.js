const core = require("@actions/core");
const github = require("@actions/github");

const DLM = ";";

try {
  const contextPullRequest = github.context.payload.pull_request;
  if (!contextPullRequest) {
    throw new Error(
      "This action can only be invoked in `pull_request` events. Otherwise the pull request can't be inferred."
    );
  }

  const prTitle = contextPullRequest.title;
  const prTitleLowerCase = prTitle.toLowerCase();
  const prNumber = contextPullRequest.number;

  // Get injected inputs
  const words = core.getInput("words").split(DLM);
  const labels = core.getInput("labels").split(DLM);
  const repoToken = core.getInput("repo-token");

  const octokit = new github.GitHub(repoToken);

  const labelsToAdd = [];
  
  console.log(prTitleLowerCase)
  words.forEach((word, index) => {
    const testRegex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'gi');
    testRegex.lastIndex = 0
    console.log(word.toLowerCase())
    console.log(testRegex.test(prTitleLowerCase))
    if (testRegex.test(prTitleLowerCase)) {
      console.log('label TO ADD', labels[index])
      labelsToAdd.push(labels[index]);
    }
  });

  console.log(labelsToAdd, 'labels to add')

  if (labelsToAdd.length > 0) {
    octokit.issues
      .addLabels({
        ...github.context.repo,
        issue_number: prNumber,
        labels: labelsToAdd,
      })
      .then(() => {
        console.log(
          `These labels were added automatically: ${labelsToAdd.join(", ")}.`
        );
      });
  } else {
    console.log("No label was added.");
  }
} catch (error) {
  core.setFailed(error.message);
}
