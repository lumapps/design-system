import { execSync } from 'node:child_process';
import { createProjectGraphAsync } from 'nx/src/project-graph/project-graph.js';
import { filterAffected } from 'nx/src/project-graph/affected/affected-project-graph.js';
import { WholeFileChange } from 'nx/src/project-graph/file-utils.js';
import * as core from '@actions/core';

async function main() {
    const changedFiles = execSync('git diff --name-only origin/master...HEAD --diff-filter=AM')
        .toString()
        .trim()
        .split('\n')
        .filter(Boolean);

    const graph = await createProjectGraphAsync();

    const touchedFiles = changedFiles.map((file) => ({
        file,
        getChanges: () => [new WholeFileChange()],
    }));

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

    console.log('affected', affectedNames);
    core.setOutput('affected', JSON.stringify(affectedNames));
    console.log('modified', modified);
    core.setOutput('modified', JSON.stringify(modified));
}

main().catch((err) => {
    core.setFailed(err.message);
});
