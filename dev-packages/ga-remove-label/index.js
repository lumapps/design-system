/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable prettier/prettier
const github = require('@actions/github');

const githubToken = process.env.GITHUB_TOKEN;
const label = process.env.LABEL;

const client = new github.GitHub(githubToken);
const { context } = github;
const pr = context.payload.pull_request;

client.issues
    .removeLabel({
        ...context.repo,
        issue_number: pr.number,
        name: label,
    })
    .catch((e) => {
        console.log(e.message);
    });
