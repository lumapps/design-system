/**
 * Match a pattern in the PR body, replace with a replace pattern.
 *
 * See `action.yml` for details on the params in `inputs`.
 */
async function main({ inputs, github, context }) {
    const { pattern: patternString, replace, whenNotFound, skipReplaceIf, keepLastMatch } = inputs;
    const pattern = new RegExp(`(?<=\n)${patternString}`, 'g');

    const { owner, repo } = context.repo;
    const pull_number = context.issue.number;

    // Fetch current PR body from API to avoid stale data in parallel workflows
    const { data: pullRequest } = await github.rest.pulls.get({
        owner,
        repo,
        pull_number,
    });
    const body = pullRequest.body || '';
    const matches = Array.from(body.matchAll(pattern));
    const lastMatch = matches[matches.length - 1];

    let updatedBody = body;
    if (!lastMatch) {
        // No match
        console.log(`Pattern ${pattern} does not match`);
        if (whenNotFound === 'append') {
            console.log('> Appending replace string to the end of the body');
            updatedBody += `\n\n${replace}`;
        } else if (whenNotFound !== 'ignore') {
            throw new Error(`> No match found for pattern '${pattern}'`);
        }
        console.log('> Nothing to do', { whenNotFound });
    } else {
        console.log(`Pattern \`${pattern}\` has ${matches.length} match(es)`);

        // Replace each match one by one.
        updatedBody = body.replaceAll(
            pattern,
            (...groups) => {
                // Remove last arg (the body)
                groups.pop();
                // Get match offset (second to last arg)
                const offset = groups.pop();

                if (keepLastMatch === 'true' && offset !== lastMatch.index) {
                    console.log(`Removing non-last match (\`keepLastMatch: true\`)`);
                    // Not the last occurrence => removing it
                    return '';
                }

                const [match, ...captureGroups] = groups;
                // Skip if condition met
                if (skipReplaceIf && eval(skipReplaceIf)) {
                    console.log(`Condition met in \`skipReplaceIf: ${skipReplaceIf.replace(/\n/g, ' ').trim()}\``);
                    console.log(`> Skipping the replacement of match "${match}"`);
                    return match;
                }
                // Replace $1, $2, etc. with captured elements
                const replaceText = captureGroups.reduce((a, b, i) => a.replace(`$${i + 1}`, b), replace);
                console.log(`Replacing match: "${match}"`);
                console.log(`> With replace pattern: "${replace}"`);
                if (replaceText !== replace)
                    console.log(`> Replace pattern resolved as: "${replaceText}"`);
                return replaceText;
            },
        );
    }

    // Update PR body
    await github.rest.pulls.update({
        owner,
        repo,
        pull_number,
        body: updatedBody,
    });
}

module.exports = main;
