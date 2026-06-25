import { execSync } from 'node:child_process';
import { createProjectGraphAsync } from 'nx/src/project-graph/project-graph.js';
import { filterAffected } from 'nx/src/project-graph/affected/affected-project-graph.js';
import { calculateFileChanges } from 'nx/src/project-graph/file-utils.js';
import { parseFiles } from 'nx/src/utils/command-line-utils.js';
import * as core from '@actions/core';

async function main() {
    // Full Nx project dependency graph
    const graph = await createProjectGraphAsync();

    // Diff range: common ancestor of master..HEAD
    const base = execSync('git merge-base origin/master HEAD').toString().trim();
    const nxArgs = { base, head: 'HEAD' };
    const { files: changedFiles } = parseFiles(nxArgs);
    const touchedFiles = changedFiles.length > 0 ? calculateFileChanges(changedFiles, nxArgs) : [];

    const affectedGraph = changedFiles.length > 0 ? await filterAffected(graph, touchedFiles) : graph;

    // Affected projects
    const affectedNames = Object.keys(affectedGraph.nodes);
    // Projects with at least one modified file
    const modified = [];
    // Affected projects filtered by targets
    const affectedByTarget = {
        test: [],
        'test:storybook': [],
    };

    // Collect modified projects and projects with targets in affectedByTarget
    for (const [name, node] of Object.entries(graph.nodes)) {
        const root = node.data.root;
        const prefix = root + '/';
        // Collect projects listed in `changedFiles`
        if (changedFiles.some((f) => f === root || f.startsWith(prefix))) {
            modified.push(name);
        }

        // Collect affected projects per target, skipping projects that don't define it
        if (affectedNames.includes(name)) {
            for (const target of Object.keys(affectedByTarget)) {
                if (node?.data?.targets?.[target]) {
                    affectedByTarget[target].push(name);
                }
            }
        }
    }

    console.log('affected', affectedNames);
    core.setOutput('affected', JSON.stringify(affectedNames));

    console.log('modified', modified);
    core.setOutput('modified', JSON.stringify(modified));

    console.log('affected-test', affectedByTarget.test);
    core.setOutput('affected-test', JSON.stringify(affectedByTarget.test));

    console.log('affected-test-storybook', affectedByTarget['test:storybook']);
    core.setOutput('affected-test-storybook', JSON.stringify(affectedByTarget['test:storybook']));
}

main().catch((err) => {
    core.setFailed(err.message);
});
