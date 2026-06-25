import { execSync } from 'node:child_process';
import { createProjectGraphAsync } from 'nx/src/project-graph/project-graph.js';
import { filterAffected } from 'nx/src/project-graph/affected/affected-project-graph.js';
import { calculateFileChanges } from 'nx/src/project-graph/file-utils.js';
import { parseFiles } from 'nx/src/utils/command-line-utils.js';
import * as core from '@actions/core';

async function main() {
    const graph = await createProjectGraphAsync();

    const base = execSync('git merge-base origin/master HEAD').toString().trim();
    const nxArgs = { base, head: 'HEAD' };
    const { files: changedFiles } = parseFiles(nxArgs);
    const touchedFiles = changedFiles.length > 0 ? calculateFileChanges(changedFiles, nxArgs) : [];

    const affectedGraph =
        changedFiles.length > 0 ? await filterAffected(graph, touchedFiles) : graph;
    const affectedNames = Object.keys(affectedGraph.nodes);

    const modified = [];
    for (const [name, node] of Object.entries(graph.nodes)) {
        const root = node.data.root;
        const prefix = root + '/';
        if (changedFiles.some((f) => f === root || f.startsWith(prefix))) {
            modified.push(name);
        }
    }

    // Affected projects that have a test target (to avoid running tests on non-testable packages).
    const affectedWithTests = affectedNames.filter((name) => {
        const node = graph.nodes[name];
        return node?.data?.targets?.test != null;
    });

    console.log('affected', affectedNames);
    core.setOutput('affected', JSON.stringify(affectedNames));

    console.log('modified', modified);
    core.setOutput('modified', JSON.stringify(modified));

    console.log('affected-test', affectedWithTests);
    core.setOutput('affected-test', JSON.stringify(affectedWithTests));

    // Affected projects that have a test:storybook target.
    const affectedWithStorybook = affectedNames.filter((name) => {
        const node = graph.nodes[name];
        return node?.data?.targets?.['test:storybook'] != null;
    });

    console.log('affected-test-storybook', affectedWithStorybook);
    core.setOutput('affected-test-storybook', JSON.stringify(affectedWithStorybook));
}

main().catch((err) => {
    core.setFailed(err.message);
});
