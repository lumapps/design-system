/* eslint-disable */
// Run from repo root: node --test dev-packages/changelog-utils/index.test.js

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { extractUnreleasedSection, extractLatestVersionSection, detectReleaseType } = require('./index');

const HEADER = `# Changelog\n\nAll notable changes will be documented in this file.\n\n`;
const PREV_VERSION = `\n## [1.0.0][] - 2026-01-01\n\n### Fixed\n\n-   Some old fix\n`;

function makeChangelog(unreleasedBody) {
    return `${HEADER}## [Unreleased]\n${unreleasedBody}\n${PREV_VERSION}`;
}

describe('extractUnreleasedSection', () => {
    it('throws when no [Unreleased] section exists', () => {
        const content = `${HEADER}## [1.0.0][] - 2026-01-01\n\n### Fixed\n\n-   fix\n`;
        assert.throws(() => extractUnreleasedSection(content), /No \[Unreleased\] section found/);
    });

    it('returns empty string when [Unreleased] section has no content', () => {
        const content = makeChangelog('');
        const result = extractUnreleasedSection(content);
        assert.equal(result, '');
    });

    it('extracts content between [Unreleased] and next version header', () => {
        const content = makeChangelog('\n### Added\n\n-   New feature\n');
        const result = extractUnreleasedSection(content);
        assert.ok(result.includes('### Added'));
        assert.ok(result.includes('-   New feature'));
        assert.ok(!result.includes('1.0.0'));
    });

    it('extracts content when [Unreleased] is the last section', () => {
        const content = `${HEADER}## [Unreleased]\n\n### Added\n\n-   Initial feature\n`;
        const result = extractUnreleasedSection(content);
        assert.ok(result.includes('### Added'));
        assert.ok(result.includes('-   Initial feature'));
    });
});

describe('extractLatestVersionSection', () => {
    it('throws when fewer than two version headers exist', () => {
        const content = `${HEADER}## [Unreleased]\n\n## [1.0.0][] - 2026-01-01\n\n### Fixed\n\n-   fix\n`;
        assert.throws(() => extractLatestVersionSection(content), /Could not find at least two version headers/);
    });

    it('extracts latest version section between two version headers', () => {
        const content = [
            HEADER,
            '## [Unreleased]\n\n### Added\n\n-   Upcoming\n\n',
            '## [2.0.0][] - 2026-06-01\n\n### Changed\n\n-   Breaking change\n\n',
            '## [1.0.0][] - 2026-01-01\n\n### Fixed\n\n-   Old fix\n',
        ].join('');
        const result = extractLatestVersionSection(content);
        assert.equal(result.version, '2.0.0');
        assert.ok(result.text.includes('### Changed'));
        assert.ok(result.text.includes('-   Breaking change'));
        assert.ok(!result.text.includes('1.0.0'));
    });

    it('returns correct version string', () => {
        const content = [
            HEADER,
            '## [Unreleased]\n\n',
            '## [4.6.1][] - 2026-03-01\n\n### Fixed\n\n-   Fix\n\n',
            '## [4.6.0][] - 2026-02-01\n\n### Added\n\n-   Feature\n',
        ].join('');
        const result = extractLatestVersionSection(content);
        assert.equal(result.version, '4.6.1');
    });
});

describe('detectReleaseType', () => {
    it('throws when no [Unreleased] section exists', () => {
        const content = `${HEADER}## [1.0.0][] - 2026-01-01\n\n### Fixed\n\n-   fix\n`;
        assert.throws(() => detectReleaseType(content), /No \[Unreleased\] section found/);
    });

    it('throws when [Unreleased] section is empty', () => {
        const content = makeChangelog('');
        assert.throws(() => detectReleaseType(content), /No entries found/);
    });

    it('throws when [Unreleased] has only section headers but no entries', () => {
        const content = makeChangelog('\n### Added\n\n### Fixed\n');
        assert.throws(() => detectReleaseType(content), /No entries found/);
    });

    it('returns patch when only ### Fixed has entries', () => {
        const content = makeChangelog('\n### Fixed\n\n-   Fix a bug\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'patch');
        assert.deepEqual(Object.keys(result.sections), ['Fixed']);
    });

    it('returns patch when only ### Security has entries', () => {
        const content = makeChangelog('\n### Security\n\n-   Patch a vulnerability\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'patch');
        assert.deepEqual(Object.keys(result.sections), ['Security']);
    });

    it('returns patch when both Fixed and Security have entries', () => {
        const content = makeChangelog('\n### Fixed\n\n-   Fix bug\n\n### Security\n\n-   Patch vulnerability\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'patch');
    });

    it('returns minor when ### Added has entries', () => {
        const content = makeChangelog('\n### Added\n\n-   New feature\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'minor');
    });

    it('returns minor when ### Changed has entries', () => {
        const content = makeChangelog('\n### Changed\n\n-   Changed behavior\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'minor');
    });

    it('returns minor when ### Deprecated has entries', () => {
        const content = makeChangelog('\n### Deprecated\n\n-   Deprecated old API\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'minor');
    });

    it('returns minor when Fixed and Added both have entries (minor wins)', () => {
        const content = makeChangelog('\n### Fixed\n\n-   Fix a bug\n\n### Added\n\n-   New feature\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'minor');
    });

    it('returns major when _[BREAKING]_ appears in a Fixed entry', () => {
        const content = makeChangelog('\n### Fixed\n\n-   _[BREAKING]_ Changed error format\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'major');
    });

    it('returns major when _[BREAKING]_ appears in a Changed entry', () => {
        const content = makeChangelog('\n### Changed\n\n-   _[BREAKING]_ Drop support for Node 16\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'major');
    });

    it('returns major when _[BREAKING]_ appears in a sub-entry', () => {
        const content = makeChangelog('\n### Changed\n\n-   `@lumx/react`:\n    -   _[BREAKING]_ Removed src folder\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'major');
    });

    it('returns major when ### Removed has entries', () => {
        const content = makeChangelog('\n### Removed\n\n-   Removed deprecated API\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'major');
    });

    it('returns major when ### Removed has entries even with other sections', () => {
        const content = makeChangelog('\n### Added\n\n-   New feature\n\n### Removed\n\n-   Removed old API\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'major');
    });

    it('returns major when _[BREAKING]_ overrides minor sections', () => {
        const content = makeChangelog(
            '\n### Added\n\n-   New feature\n\n### Changed\n\n-   _[BREAKING]_ Changed API\n',
        );
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'major');
    });

    it('handles real-world changelog format with scoped packages and sub-entries', () => {
        const content = makeChangelog(`
### Changed

-   \`@lumx/core\`:
    -   Moved \`Uploader\` stories and tests from \`@lumx/react\`
`);
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'minor');
        assert.deepEqual(Object.keys(result.sections), ['Changed']);
    });

    it('handles current project CHANGELOG.md unreleased section', () => {
        const fs = require('fs');
        const path = require('path');
        const changelogPath = path.resolve(__dirname, '../../CHANGELOG.md');
        const content = fs.readFileSync(changelogPath, 'utf8');
        const result = detectReleaseType(content);
        assert.ok(
            ['patch', 'minor', 'major'].includes(result.releaseType),
            `unexpected releaseType: ${result.releaseType}`,
        );
    });

    it('ignores unknown section headers', () => {
        const content = makeChangelog('\n### CustomSection\n\n-   Something\n\n### Fixed\n\n-   Fix a bug\n');
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'patch');
        assert.deepEqual(Object.keys(result.sections), ['Fixed']);
    });

    it('works when [Unreleased] is the last section (no previous version)', () => {
        const content = `${HEADER}## [Unreleased]\n\n### Added\n\n-   Initial feature\n`;
        const result = detectReleaseType(content);
        assert.equal(result.releaseType, 'minor');
    });
});
