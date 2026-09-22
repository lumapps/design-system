import fs from 'node:fs';
import path from 'node:path';

const FRAMEWORKS = ['react', 'vue'];

/**
 * Dependency names that pin a project to a framework, grouped by how strong the signal is.
 * The LumX packages win outright; the bare framework packages are only a fallback, because a
 * React project can legitimately carry `vue` somewhere in its tooling.
 */
const SIGNAL_TIERS = [
    { react: '@lumx/react', vue: '@lumx/vue' },
    { react: 'react', vue: 'vue' },
];

/** Walk up from a directory looking for the nearest package.json. */
function findNearestPackageJson(startDir) {
    let dir = path.resolve(startDir);
    while (true) {
        const candidate = path.join(dir, 'package.json');
        if (fs.existsSync(candidate)) return candidate;
        const parent = path.dirname(dir);
        if (parent === dir) return null;
        dir = parent;
    }
}

/**
 * Work out which framework the consuming project uses, so the server only serves
 * components for that one.
 *
 * Resolution order:
 *  1. `LUMX_FRAMEWORK=react|vue` — explicit override, also the escape hatch for a
 *     project that uses both.
 *  2. `LUMX_FRAMEWORK=all` — serve both frameworks.
 *  3. The nearest `package.json` dependencies, from `cwd` upwards.
 *  4. No match: serve both frameworks.
 *
 * @param {string} cwd - Directory to detect from (the consuming project)
 * @returns {{framework: string|null, source: string}} - `framework` is null when unrestricted
 */
export function detectFramework(cwd = process.cwd()) {
    const override = process.env.LUMX_FRAMEWORK?.trim().toLowerCase();
    if (override === 'all') {
        return { framework: null, source: 'LUMX_FRAMEWORK=all' };
    }
    if (override) {
        if (!FRAMEWORKS.includes(override)) {
            throw new Error(`Invalid LUMX_FRAMEWORK="${override}". Expected one of: react, vue, all.`);
        }
        return { framework: override, source: `LUMX_FRAMEWORK=${override}` };
    }

    const packageJsonPath = findNearestPackageJson(cwd);
    if (!packageJsonPath) {
        return { framework: null, source: 'no package.json found' };
    }

    let packageJson;
    try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch {
        return { framework: null, source: `unreadable ${packageJsonPath}` };
    }

    const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies,
    };

    for (const tier of SIGNAL_TIERS) {
        const matched = FRAMEWORKS.filter((framework) => dependencies[tier[framework]]);
        if (matched.length === 1) {
            const [framework] = matched;
            return { framework, source: `${tier[framework]} in ${packageJsonPath}` };
        }
        if (matched.length > 1) {
            const names = matched.map((framework) => tier[framework]).join(' and ');
            return { framework: null, source: `both ${names} in ${packageJsonPath}` };
        }
    }

    return { framework: null, source: `no framework dependency in ${packageJsonPath}` };
}
