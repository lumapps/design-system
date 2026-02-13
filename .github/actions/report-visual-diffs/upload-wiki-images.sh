#!/usr/bin/env bash
#
# Upload visual diff images and report to the wiki repo for inline display in PR comments.
#
# Required environment variables:
#   GITHUB_TOKEN    - Token with write access to the wiki repo
#
# Arguments:
#   $1 - artifacts-dir   Path to the downloaded artifacts directory (e.g. vis-artifacts)
#   $2 - repository      GitHub repository (e.g. lumapps/design-system)
#   $3 - pr-number       Pull request number
#   $4 - run-id          GitHub Actions run ID
#
set -euo pipefail

ARTIFACTS_DIR="$1"
REPOSITORY="$2"
PR_NUMBER="$3"
RUN_ID="$4"

# Clone wiki repo (shallow, single branch)
git clone --depth 1 \
  "https://x-access-token:${GITHUB_TOKEN}@github.com/${REPOSITORY}.wiki.git" \
  wiki-repo

DEST_DIR="wiki-repo/pr-${PR_NUMBER}/visual-reports"

# Clean previous run data for this PR
rm -rf "${DEST_DIR}"
mkdir -p "${DEST_DIR}"

# Copy per-package images (flattening the linux/ platform subdirectory)
for label in react vue; do
  src="$ARTIFACTS_DIR/vis-report-${label}/linux"
  [ -d "$src" ] || continue
  mkdir -p "${DEST_DIR}/${label}"
  cp -r "$src"/* "${DEST_DIR}/${label}/"
done

# Copy cross-framework diff images
CROSS_FW_DIR="$ARTIFACTS_DIR/cross-framework-diffs"
if [ -d "$CROSS_FW_DIR" ]; then
  mkdir -p "${DEST_DIR}/cross-framework"
  cp -r "$CROSS_FW_DIR"/__*__/ "${DEST_DIR}/cross-framework/"
fi

# Copy the report markdown
for report_file in "$ARTIFACTS_DIR"/*.md; do
  [ -f "$report_file" ] && cp "$report_file" "${DEST_DIR}/"
done

# Commit and push if there are changes
cd wiki-repo
git add -A
git diff --cached --quiet && echo "No changes to commit" && exit 0
git -c user.name="github-actions[bot]" \
    -c user.email="41898282+github-actions[bot]@users.noreply.github.com" \
    commit -m "Visual report for PR #${PR_NUMBER} (run ${RUN_ID})"
git push
