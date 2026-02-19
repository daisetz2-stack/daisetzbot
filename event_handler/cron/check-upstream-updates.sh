#!/bin/bash
# Upstream update checker for thepopebot
# Checks for new commits on upstream repo and triggers agent job if updates found

set -e

# Configuration
UPSTREAM_OWNER="${UPSTREAM_OWNER:-stephengpope}"
UPSTREAM_REPO="${UPSTREAM_REPO:-thepopebot}"
UPSTREAM_BRANCH="${UPSTREAM_BRANCH:-main}"
STATE_FILE="$(dirname "$0")/.upstream-state.json"
API_URL="https://api.github.com/repos/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/commits/${UPSTREAM_BRANCH}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
  echo -e "${GREEN}[UPSTREAM]${NC} $1"
}

error() {
  echo -e "${RED}[UPSTREAM ERROR]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[UPSTREAM WARN]${NC} $1"
}

# Initialize state file if it doesn't exist
if [ ! -f "$STATE_FILE" ]; then
  log "Initializing state file..."
  echo '{"last_commit":"","last_check":"","update_count":0}' > "$STATE_FILE"
fi

# Fetch latest upstream commit
log "Checking ${UPSTREAM_OWNER}/${UPSTREAM_REPO}@${UPSTREAM_BRANCH}..."

RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" != "200" ]; then
  error "GitHub API returned $HTTP_CODE"
  error "$BODY"
  exit 1
fi

# Parse response
LATEST_SHA=$(echo "$BODY" | grep -o '"sha":"[^"]*"' | head -1 | cut -d'"' -f4)
LATEST_DATE=$(echo "$BODY" | grep -o '"date":"[^"]*"' | head -1 | cut -d'"' -f4)
COMMIT_MSG=$(echo "$BODY" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4 | sed 's/\\n/ /g')
AUTHOR=$(echo "$BODY" | grep -o '"name":"[^"]*"' | head -2 | tail -1 | cut -d'"' -f4)

if [ -z "$LATEST_SHA" ]; then
  error "Could not parse commit SHA from GitHub API response"
  exit 1
fi

log "Latest commit: ${LATEST_SHA:0:7}"
log "Date: $LATEST_DATE"
log "Author: $AUTHOR"
log "Message: $COMMIT_MSG"

# Read last checked commit
LAST_SHA=$(grep -o '"last_commit":"[^"]*"' "$STATE_FILE" | cut -d'"' -f4)

# Compare commits
if [ "$LATEST_SHA" = "$LAST_SHA" ]; then
  log "No new updates (already at ${LATEST_SHA:0:7})"
  # Update last_check timestamp
  NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  sed -i "s/\"last_check\":\"[^\"]*\"/\"last_check\":\"$NOW\"/" "$STATE_FILE"
  exit 0
fi

# New updates available!
if [ -z "$LAST_SHA" ]; then
  log "First check - storing baseline commit"
else
  warn "New updates available!"
  log "Previous: ${LAST_SHA:0:7}"
  log "Latest: ${LATEST_SHA:0:7}"
  
  # Get commit count between versions
  COMPARE_URL="https://api.github.com/repos/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/compare/${LAST_SHA}...${LATEST_SHA}"
  COMPARE_RESPONSE=$(curl -s "$COMPARE_URL")
  COMMIT_COUNT=$(echo "$COMPARE_RESPONSE" | grep -o '"total_commits":[0-9]*' | cut -d':' -f2)
  
  log "Found $COMMIT_COUNT new commit(s)"
  
  # Trigger agent job to merge updates
  log "Triggering update job..."
  
  # Prepare job details JSON
  cat > /tmp/upstream-update-details.json <<EOF
{
  "from_commit": "$LAST_SHA",
  "to_commit": "$LATEST_SHA",
  "commit_count": $COMMIT_COUNT,
  "latest_message": "$COMMIT_MSG",
  "latest_author": "$AUTHOR",
  "latest_date": "$LATEST_DATE"
}
EOF
  
  # Call the event handler's webhook to create agent job
  JOB_RESPONSE=$(curl -s -X POST "http://localhost:${PORT:-3000}/webhook" \
    -H "Content-Type: application/json" \
    -H "x-api-key: ${API_KEY}" \
    -d "{
      \"job\": \"Read the file at operating_system/UPSTREAM_MERGE.md and complete the upstream merge task. Details: ${COMMIT_COUNT} new commits from ${LAST_SHA:0:7} to ${LATEST_SHA:0:7}\"
    }")
  
  JOB_ID=$(echo "$JOB_RESPONSE" | grep -o '"job_id":"[^"]*"' | cut -d'"' -f4)
  
  if [ -n "$JOB_ID" ]; then
    log "Update job created: $JOB_ID"
  else
    error "Failed to create update job"
    error "$JOB_RESPONSE"
    exit 1
  fi
fi

# Update state file
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
UPDATE_COUNT=$(grep -o '"update_count":[0-9]*' "$STATE_FILE" | cut -d':' -f2)
NEW_COUNT=$((UPDATE_COUNT + 1))

cat > "$STATE_FILE" <<EOF
{
  "last_commit": "$LATEST_SHA",
  "last_check": "$NOW",
  "update_count": $NEW_COUNT,
  "last_update_found": "$NOW"
}
EOF

log "State updated successfully"
exit 0
