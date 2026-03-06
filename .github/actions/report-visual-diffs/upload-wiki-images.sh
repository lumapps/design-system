#!/usr/bin/env bash
#
# Upload the consolidated visual report to the wiki repo for inline display in PR comments.
#
# Required environment variables:
#   GITHUB_TOKEN    - Token with write access to the wiki repo
#
# Arguments:
#   $1 - output-dir      Path to the consolidated visual report directory
#   $2 - repository      GitHub repository (e.g. lumapps/design-system)
#   $3 - pr-number       Pull request number
#   $4 - run-id          GitHub Actions run ID
#
set -euo pipefail

OUTPUT_DIR="$1"
REPOSITORY="$2"
PR_NUMBER="$3"
RUN_ID="$4"

if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Output directory not found: $OUTPUT_DIR. Nothing to upload."
  exit 0
fi

# Clone wiki repo (shallow, single branch)
git clone --depth 1 \
  "https://x-access-token:${GITHUB_TOKEN}@github.com/${REPOSITORY}.wiki.git" \
  wiki-repo

DEST_DIR="wiki-repo/pr-${PR_NUMBER}/visual-diffs"

# Clean previous run data for this PR
rm -rf "${DEST_DIR}"
mkdir -p "${DEST_DIR}"

# Copy the entire consolidated visual report directory
cp -r "$OUTPUT_DIR"/* "${DEST_DIR}/"

# Commit and push if there are changes
cd wiki-repo
git add -A
git diff --cached --quiet && echo "No changes to commit" && exit 0
git -c user.name="github-actions[bot]" \
    -c user.email="41898282+github-actions[bot]@users.noreply.github.com" \
    commit -m "Visual report for PR #${PR_NUMBER} (run ${RUN_ID})"
git push
