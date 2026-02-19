#!/bin/bash
# Test script for upstream update checking
# Validates configuration without creating actual jobs

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

pass() {
  echo -e "${GREEN}✓${NC} $1"
}

fail() {
  echo -e "${RED}✗${NC} $1"
}

warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

echo "================================================"
echo "  Upstream Update System - Configuration Test"
echo "================================================"
echo ""

# Test 1: Check script exists and is executable
echo "1. Checking update script..."
if [ -f "$SCRIPT_DIR/check-upstream-updates.sh" ]; then
  pass "Script exists"
else
  fail "Script not found at $SCRIPT_DIR/check-upstream-updates.sh"
  exit 1
fi

if [ -x "$SCRIPT_DIR/check-upstream-updates.sh" ]; then
  pass "Script is executable"
else
  warn "Script is not executable (running chmod +x)"
  chmod +x "$SCRIPT_DIR/check-upstream-updates.sh"
fi

# Test 2: Check environment variables
echo ""
echo "2. Checking environment variables..."

if [ -n "$API_KEY" ]; then
  pass "API_KEY is set"
else
  warn "API_KEY is not set (required for creating jobs)"
fi

if [ -n "$PORT" ]; then
  info "PORT is set to $PORT"
else
  info "PORT not set (will default to 3000)"
fi

# Test 3: Check Event Handler is accessible
echo ""
echo "3. Checking Event Handler connectivity..."
PORT=${PORT:-3000}

if curl -s -f "http://localhost:$PORT/health" > /dev/null 2>&1; then
  pass "Event Handler is accessible at localhost:$PORT"
else
  warn "Event Handler not accessible (is it running?)"
fi

# Test 4: Check CRONS.json configuration
echo ""
echo "4. Checking CRONS.json configuration..."

CUSTOM_CRONS="$SCRIPT_DIR/../../custom/operating_system/CRONS.json"
DEFAULT_CRONS="$SCRIPT_DIR/../../operating_system/CRONS.json"

if [ -f "$CUSTOM_CRONS" ]; then
  CRONS_FILE="$CUSTOM_CRONS"
  info "Using custom CRONS.json"
elif [ -f "$DEFAULT_CRONS" ]; then
  CRONS_FILE="$DEFAULT_CRONS"
  info "Using default CRONS.json"
else
  fail "No CRONS.json found"
  exit 1
fi

# Check if upstream-update-check exists
if grep -q '"name": "upstream-update-check"' "$CRONS_FILE"; then
  pass "upstream-update-check cron job found"
  
  # Check if enabled
  if grep -A 5 '"name": "upstream-update-check"' "$CRONS_FILE" | grep -q '"enabled": true'; then
    pass "Cron job is enabled"
  else
    warn "Cron job is disabled (enabled: false)"
  fi
  
  # Show schedule
  SCHEDULE=$(grep -A 2 '"name": "upstream-update-check"' "$CRONS_FILE" | grep "schedule" | cut -d'"' -f4)
  info "Schedule: $SCHEDULE"
else
  fail "upstream-update-check cron job not found in CRONS.json"
fi

# Test 5: Check state file
echo ""
echo "5. Checking state file..."

STATE_FILE="$SCRIPT_DIR/.upstream-state.json"

if [ -f "$STATE_FILE" ]; then
  pass "State file exists"
  
  # Validate JSON
  if python3 -m json.tool "$STATE_FILE" > /dev/null 2>&1; then
    pass "State file is valid JSON"
    
    # Show state
    LAST_COMMIT=$(grep -o '"last_commit":"[^"]*"' "$STATE_FILE" | cut -d'"' -f4)
    LAST_CHECK=$(grep -o '"last_check":"[^"]*"' "$STATE_FILE" | cut -d'"' -f4)
    
    if [ -n "$LAST_COMMIT" ]; then
      info "Last synced commit: ${LAST_COMMIT:0:7}"
    else
      info "No commits synced yet (first run pending)"
    fi
    
    if [ -n "$LAST_CHECK" ]; then
      info "Last check: $LAST_CHECK"
    fi
  else
    fail "State file is not valid JSON"
  fi
else
  info "State file doesn't exist yet (will be created on first run)"
fi

# Test 6: Test GitHub API connectivity
echo ""
echo "6. Testing GitHub API connectivity..."

UPSTREAM_OWNER="${UPSTREAM_OWNER:-stephengpope}"
UPSTREAM_REPO="${UPSTREAM_REPO:-thepopebot}"
API_URL="https://api.github.com/repos/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/commits/main"

RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
  pass "GitHub API is accessible"
  
  BODY=$(echo "$RESPONSE" | sed '$d')
  LATEST_SHA=$(echo "$BODY" | grep -o '"sha":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  if [ -n "$LATEST_SHA" ]; then
    info "Latest upstream commit: ${LATEST_SHA:0:7}"
  fi
elif [ "$HTTP_CODE" = "404" ]; then
  fail "Upstream repository not found ($UPSTREAM_OWNER/$UPSTREAM_REPO)"
elif [ "$HTTP_CODE" = "403" ]; then
  warn "GitHub API rate limit exceeded"
else
  fail "GitHub API error: $HTTP_CODE"
fi

# Test 7: Check merge instructions
echo ""
echo "7. Checking merge instructions..."

MERGE_INSTRUCTIONS="$SCRIPT_DIR/../../operating_system/UPSTREAM_MERGE.md"

if [ -f "$MERGE_INSTRUCTIONS" ]; then
  pass "UPSTREAM_MERGE.md exists"
else
  fail "UPSTREAM_MERGE.md not found"
fi

# Test 8: Check upstream remote
echo ""
echo "8. Checking git upstream remote..."

cd "$SCRIPT_DIR/../.."

if git remote | grep -q "^upstream$"; then
  pass "Upstream remote exists"
  
  UPSTREAM_URL=$(git remote get-url upstream)
  info "Upstream URL: $UPSTREAM_URL"
else
  warn "Upstream remote not configured (will be added on first run)"
  info "Add with: git remote add upstream https://github.com/stephengpope/thepopebot.git"
fi

# Test 9: Dry run test
echo ""
echo "9. Running dry-run test..."

info "Fetching latest upstream commit..."

LATEST_SHA=$(curl -s "$API_URL" | grep -o '"sha":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$LATEST_SHA" ]; then
  if [ -f "$STATE_FILE" ]; then
    LAST_SHA=$(grep -o '"last_commit":"[^"]*"' "$STATE_FILE" | cut -d'"' -f4)
    
    if [ "$LATEST_SHA" = "$LAST_SHA" ]; then
      pass "No updates available (already at latest)"
    else
      info "Updates would be triggered (${LAST_SHA:0:7} → ${LATEST_SHA:0:7})"
    fi
  else
    info "First run would establish baseline at ${LATEST_SHA:0:7}"
  fi
else
  fail "Could not fetch latest commit"
fi

# Summary
echo ""
echo "================================================"
echo "  Test Summary"
echo "================================================"

if [ -n "$API_KEY" ] && [ "$HTTP_CODE" = "200" ] && grep -q '"enabled": true' "$CRONS_FILE" 2>/dev/null; then
  echo ""
  pass "Automatic update system is configured correctly!"
  echo ""
  info "Next steps:"
  echo "  1. Ensure Event Handler is running"
  echo "  2. Wait for scheduled check (or run manually)"
  echo "  3. Monitor via: cat $STATE_FILE"
else
  echo ""
  warn "Some issues detected. Review warnings above."
  echo ""
  info "Common fixes:"
  echo "  • Set API_KEY in environment"
  echo "  • Start Event Handler"
  echo "  • Enable cron job in CRONS.json"
fi

echo ""
echo "Manual check command:"
echo "  cd event_handler/cron && bash check-upstream-updates.sh"
echo ""
echo "View state:"
echo "  cat event_handler/cron/.upstream-state.json | python3 -m json.tool"
echo ""
