#!/bin/bash
# View upstream update status and pending changes

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATE_FILE="$SCRIPT_DIR/.upstream-state.json"
UPSTREAM_OWNER="${UPSTREAM_OWNER:-stephengpope}"
UPSTREAM_REPO="${UPSTREAM_REPO:-thepopebot}"
UPSTREAM_BRANCH="${UPSTREAM_BRANCH:-main}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

success() {
  echo -e "${GREEN}✓${NC} $1"
}

warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

echo "================================================"
echo "  Upstream Update Status"
echo "================================================"
echo ""

# Read state file
if [ -f "$STATE_FILE" ]; then
  LAST_COMMIT=$(grep -o '"last_commit":"[^"]*"' "$STATE_FILE" | cut -d'"' -f4)
  LAST_CHECK=$(grep -o '"last_check":"[^"]*"' "$STATE_FILE" | cut -d'"' -f4)
  UPDATE_COUNT=$(grep -o '"update_count":[0-9]*' "$STATE_FILE" | cut -d':' -f2)
  LAST_UPDATE_FOUND=$(grep -o '"last_update_found":"[^"]*"' "$STATE_FILE" | cut -d'"' -f4)
  
  echo "Current State:"
  echo "  Last synced commit: ${LAST_COMMIT:0:7}"
  echo "  Last check: $LAST_CHECK"
  echo "  Total updates found: $UPDATE_COUNT"
  [ -n "$LAST_UPDATE_FOUND" ] && echo "  Last update found: $LAST_UPDATE_FOUND"
else
  warn "State file not found - updates not yet tracked"
  exit 1
fi

echo ""
echo "================================================"
echo "  Upstream Repository"
echo "================================================"
echo ""
echo "  Owner: $UPSTREAM_OWNER"
echo "  Repo: $UPSTREAM_REPO"
echo "  Branch: $UPSTREAM_BRANCH"
echo ""

# Fetch latest commit from GitHub API
info "Fetching latest upstream commit..."
API_URL="https://api.github.com/repos/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/commits/${UPSTREAM_BRANCH}"
RESPONSE=$(curl -s "$API_URL")

if echo "$RESPONSE" | grep -q '"sha"'; then
  LATEST_SHA=$(echo "$RESPONSE" | grep -o '"sha":"[^"]*"' | head -1 | cut -d'"' -f4)
  LATEST_DATE=$(echo "$RESPONSE" | grep -o '"date":"[^"]*"' | head -1 | cut -d'"' -f4)
  COMMIT_MSG=$(echo "$RESPONSE" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4 | sed 's/\\n/ /g')
  AUTHOR=$(echo "$RESPONSE" | grep -o '"name":"[^"]*"' | head -2 | tail -1 | cut -d'"' -f4)
  
  echo "Latest Upstream Commit:"
  echo "  SHA: ${LATEST_SHA:0:7}"
  echo "  Date: $LATEST_DATE"
  echo "  Author: $AUTHOR"
  echo "  Message: $COMMIT_MSG"
else
  warn "Could not fetch upstream commit from GitHub API"
  exit 1
fi

echo ""
echo "================================================"
echo "  Update Status"
echo "================================================"
echo ""

# Compare commits
if [ "$LATEST_SHA" = "$LAST_COMMIT" ]; then
  success "Up to date! No pending updates."
else
  warn "Updates available!"
  echo ""
  echo "  From: ${LAST_COMMIT:0:7}"
  echo "  To: ${LATEST_SHA:0:7}"
  
  # Try to get commit count
  COMPARE_URL="https://api.github.com/repos/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/compare/${LAST_COMMIT}...${LATEST_SHA}"
  COMPARE_RESPONSE=$(curl -s "$COMPARE_URL")
  
  if echo "$COMPARE_RESPONSE" | grep -q '"total_commits"'; then
    COMMIT_COUNT=$(echo "$COMPARE_RESPONSE" | grep -o '"total_commits":[0-9]*' | cut -d':' -f2)
    echo "  New commits: $COMMIT_COUNT"
  fi
  
  # Try to get commit list if git repo available
  cd "$SCRIPT_DIR/../.."
  if git remote | grep -q "^upstream$"; then
    echo ""
    info "Fetching details from git..."
    git fetch upstream $UPSTREAM_BRANCH 2>/dev/null || true
    
    if git rev-parse $LAST_COMMIT >/dev/null 2>&1 && git rev-parse upstream/$UPSTREAM_BRANCH >/dev/null 2>&1; then
      echo ""
      echo "Recent commits:"
      git log --oneline --no-merges $LAST_COMMIT..upstream/$UPSTREAM_BRANCH | head -10
      
      echo ""
      echo "Files changed:"
      git diff --stat $LAST_COMMIT..upstream/$UPSTREAM_BRANCH | head -20
    fi
  fi
fi

echo ""
echo "================================================"
echo "  Actions"
echo "================================================"
echo ""
echo "Check for updates now:"
echo "  cd event_handler/cron && bash check-upstream-updates.sh"
echo ""
echo "View detailed state:"
echo "  cat event_handler/cron/.upstream-state.json | python3 -m json.tool"
echo ""
echo "Reset state (force next check to trigger):"
echo "  echo '{\"last_commit\":\"\",\"last_check\":\"\",\"update_count\":0}' > event_handler/cron/.upstream-state.json"
echo ""
