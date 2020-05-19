const core = require("@actions/core");
const github = require("@actions/github");

try {
  const contextPullRequest = github.context.payload.pull_request;
  if (!contextPullRequest) {
    throw new Error(
      "This action can only be invoked in `pull_request` events. Otherwise the pull request can't be inferred."
    );
  }

  const prTitle = contextPullRequest.title;
  const prNumber = contextPullRequest.number;

  const patternToCheck = core.getInput("pattern");
  const label = core.getInput("label");

  const repoToken = core.getInput("repo-token");
  const octokit = new github.GitHub(repoToken);

  octokit.issues
    .addLabels({
      ...github.context.repo,
      number: prNumber,
      labels: label,
    })
    .then((result) => {
      console.log(result);
    });
} catch (error) {
  core.setFailed(error.message);
}
