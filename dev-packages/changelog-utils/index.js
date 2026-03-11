/* eslint-disable */

const VALID_SECTIONS = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'];
const MAJOR_SECTIONS = ['Removed'];
const MINOR_SECTIONS = ['Added', 'Changed', 'Deprecated'];

/**
 * Extract the raw content of the [Unreleased] section from a CHANGELOG.md string.
 *
 * @param {string} content Full content of CHANGELOG.md
 * @returns {string} The trimmed text between `## [Unreleased]` and the next `## [` header
 * @throws {Error} If no `[Unreleased]` section is found
 */
function extractUnreleasedSection(content) {
    const match = /^## \[Unreleased\]/m.exec(content);
    if (!match) {
        throw new Error('No [Unreleased] section found in CHANGELOG.md');
    }
    const afterHeader = content.slice(match.index + match[0].length);
    const nextVersion = afterHeader.search(/^## \[/m);
    return (nextVersion !== -1 ? afterHeader.slice(0, nextVersion) : afterHeader).trim();
}

/**
 * Extract the latest versioned section from a CHANGELOG.md string.
 * Looks for `## [x.y.z][]` headers (Keep a Changelog format).
 *
 * @param {string} content Full content of CHANGELOG.md
 * @returns {{ version: string, text: string }}
 * @throws {Error} If fewer than two version headers are found
 */
function extractLatestVersionSection(content) {
    const VERSION_HEADER_REGEXP = /^## \[(.*?)\]\[\]/gm;
    const matches = [...content.matchAll(VERSION_HEADER_REGEXP)];
    if (matches.length < 2) {
        throw new Error('Could not find at least two version headers in CHANGELOG.md');
    }
    const [matchLatestVersion, matchVersionBefore] = matches;
    const version = matchLatestVersion[1];
    const startIndex = content.indexOf('\n', matchLatestVersion.index);
    const text = content.substring(startIndex, matchVersionBefore.index).trim();
    return { version, text };
}

/**
 * Parse subsections (### Added, ### Fixed, etc.) from an unreleased block.
 *
 * @param {string} unreleasedBlock Raw text of the [Unreleased] section
 * @returns {Record<string, string[]>} Map of section name to list of entries
 */
function parseSections(unreleasedBlock) {
    const sections = {};
    const parts = unreleasedBlock.split(/^### /m);

    for (const part of parts) {
        if (!part.trim()) continue;

        const newlineIndex = part.indexOf('\n');
        if (newlineIndex === -1) continue;

        const sectionName = part.slice(0, newlineIndex).trim();
        if (!VALID_SECTIONS.includes(sectionName)) continue;

        const sectionContent = part.slice(newlineIndex);
        const entries = sectionContent.split('\n').filter((line) => line.trim().startsWith('-'));

        if (entries.length > 0) {
            sections[sectionName] = entries.map((e) => e.trim());
        }
    }

    return sections;
}

/**
 * Parse the [Unreleased] section of a Keep a Changelog formatted CHANGELOG.md
 * and detect the appropriate semver release type.
 *
 * @param {string} content Full content of CHANGELOG.md
 * @returns {{ releaseType: 'major' | 'minor' | 'patch', sections: Record<string, string[]> }}
 * @throws {Error} If no [Unreleased] section or no entries are found
 */
function detectReleaseType(content) {
    const unreleasedBlock = extractUnreleasedSection(content);
    const sections = parseSections(unreleasedBlock);

    const allEntries = Object.values(sections).flat();
    if (allEntries.length === 0) {
        throw new Error('No entries found in [Unreleased] section of CHANGELOG.md');
    }

    // Priority 1: Breaking changes (_[BREAKING]_ marker in any entry)
    if (allEntries.some((entry) => entry.includes('[BREAKING]'))) {
        return { releaseType: 'major', sections };
    }

    // Priority 2: Removed section with entries
    if (MAJOR_SECTIONS.some((s) => sections[s])) {
        return { releaseType: 'major', sections };
    }

    // Priority 3: Added, Changed, or Deprecated sections
    if (MINOR_SECTIONS.some((s) => sections[s])) {
        return { releaseType: 'minor', sections };
    }

    // Priority 4: Fixed, Security, or anything else
    return { releaseType: 'patch', sections };
}

module.exports = { extractUnreleasedSection, extractLatestVersionSection, detectReleaseType };
