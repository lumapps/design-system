#!/usr/bin/env bash
#
# Upload visual diff images to the wiki repo for inline display in PR comments.
#
# Required environment variables:
#   GITHUB_TOKEN    - Token with write access to the wiki repo
#   GITHUB_OUTPUT   - GitHub Actions output file
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

# Copy images, flattening the platform subdirectory out of the path.
# Artifact structure: vis-report-<label>/<platform>/<image-type>/.../*.png
# Wiki structure:     <label>/<image-type>/.../*.png
for report_dir in "$ARTIFACTS_DIR"/vis-report-*; do
  [ -d "$report_dir" ] || continue
  label=$(basename "$report_dir" | sed 's/vis-report-//')

  for image_type in __diffs__ __results__ __baselines__; do
    find "$report_dir" -path "*/${image_type}/*.png" 2>/dev/null | while read -r img; do
      rel_path="${img#*${image_type}/}"
      dest="${DEST_DIR}/${label}/${image_type}/${rel_path}"
      mkdir -p "$(dirname "$dest")"
      cp "$img" "$dest"
    done
  done
done

# Copy the report markdown (filename includes PR number for flat wiki URL resolution)
REPORT_FILE="$ARTIFACTS_DIR/visual-reports-pr-${PR_NUMBER}-report.md"
[ -f "$REPORT_FILE" ] && cp "$REPORT_FILE" "$DEST_DIR/visual-reports-pr-${PR_NUMBER}-report.md"

# Commit and push if there are changes
cd wiki-repo
git add -A
git diff --cached --quiet && echo "No changes to commit" && exit 0
git -c user.name="github-actions[bot]" \
    -c user.email="41898282+github-actions[bot]@users.noreply.github.com" \
    commit -m "Visual report for PR #${PR_NUMBER} (run ${RUN_ID})"
git push
