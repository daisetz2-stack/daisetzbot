#!/bin/bash

# Test suite for personal context system
# Usage: bash test.sh

set -e

echo "========================================="
echo "Personal Context System Test Suite"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_case() {
  TESTS_RUN=$((TESTS_RUN + 1))
  echo -e "${YELLOW}Test $TESTS_RUN:${NC} $1"
}

pass() {
  TESTS_PASSED=$((TESTS_PASSED + 1))
  echo -e "${GREEN}✓ PASS${NC}"
  echo ""
}

fail() {
  TESTS_FAILED=$((TESTS_FAILED + 1))
  echo -e "${RED}✗ FAIL${NC}: $1"
  echo ""
}

# Clean up from previous tests
rm -f /tmp/test-profile.json /tmp/test-updates.jsonl
rm -f /job/logs/personal-context/updates.jsonl

# Test 1: Load context when none available
test_case "Load context when PERSONAL_CONTEXT not set"
unset PERSONAL_CONTEXT
RESULT=$(node /job/.pi/skills/personal-context/load-context.js)
if echo "$RESULT" | jq -e '.available == false' > /dev/null; then
  pass
else
  fail "Expected available=false, got: $RESULT"
fi

# Test 2: Load context with minimal data
test_case "Load context with minimal data"
export PERSONAL_CONTEXT='{"name":"Test User"}'
RESULT=$(node /job/.pi/skills/personal-context/load-context.js)
if echo "$RESULT" | jq -e '.available == true and .context.name == "Test User"' > /dev/null; then
  pass
else
  fail "Expected available=true with name='Test User', got: $RESULT"
fi

# Test 3: Load context with full data
test_case "Load context with comprehensive data"
export PERSONAL_CONTEXT='{
  "name": "Alex Chen",
  "timezone": "America/Los_Angeles",
  "preferences": {
    "communication_style": "direct"
  },
  "background": {
    "expertise": ["JavaScript", "Python"]
  }
}'
RESULT=$(node /job/.pi/skills/personal-context/load-context.js)
if echo "$RESULT" | jq -e '.available == true and .context.preferences.communication_style == "direct"' > /dev/null; then
  pass
else
  fail "Expected full context to load, got: $RESULT"
fi

# Test 4: Invalid JSON handling
test_case "Handle invalid JSON gracefully"
export PERSONAL_CONTEXT='{"name": invalid json}'
RESULT=$(node /job/.pi/skills/personal-context/load-context.js)
if echo "$RESULT" | jq -e '.available == false and .error == true' > /dev/null; then
  pass
else
  fail "Expected error handling for invalid JSON, got: $RESULT"
fi

# Test 5: Profile file creation
test_case "Profile file is created with valid context"
export PERSONAL_CONTEXT='{"name":"File Test"}'
node /job/.pi/skills/personal-context/load-context.js > /dev/null
if [ -f "/job/logs/personal-context/profile.json" ]; then
  PROFILE_NAME=$(jq -r '.name' /job/logs/personal-context/profile.json)
  if [ "$PROFILE_NAME" = "File Test" ]; then
    pass
  else
    fail "Profile file has wrong content: $PROFILE_NAME"
  fi
else
  fail "Profile file was not created"
fi

# Test 6: Update context script
test_case "Update context script records updates"
# Clean updates file for this test
rm -f /job/logs/personal-context/updates.jsonl
sleep 0.1  # Ensure file is deleted
/job/.pi/skills/personal-context/update-context.sh test key value > /dev/null
if [ -f "/job/logs/personal-context/updates.jsonl" ]; then
  UPDATE_CATEGORY=$(jq -r '.category' /job/logs/personal-context/updates.jsonl)
  if [ "$UPDATE_CATEGORY" = "test" ]; then
    pass
  else
    fail "Update has wrong category: $UPDATE_CATEGORY"
  fi
else
  fail "Updates file was not created"
fi

# Test 7: Multiple updates append correctly
test_case "Multiple updates append to updates.jsonl"
/job/.pi/skills/personal-context/update-context.sh test2 key2 value2 > /dev/null
LINE_COUNT=$(wc -l < /job/logs/personal-context/updates.jsonl)
if [ "$LINE_COUNT" -eq 2 ]; then
  pass
else
  fail "Expected 2 updates, found $LINE_COUNT"
fi

# Test 8: Schema examples are valid JSON
test_case "All template files contain valid JSON"
ALL_VALID=true
for template in /job/logs/personal-context/templates/*.json; do
  if ! jq empty "$template" 2>/dev/null; then
    ALL_VALID=false
    fail "Invalid JSON in $template"
    break
  fi
done
if [ "$ALL_VALID" = true ]; then
  pass
fi

# Test 9: Context directory structure
test_case "Context directory structure is correct"
if [ -d "/job/logs/personal-context" ] && \
   [ -d "/job/logs/personal-context/templates" ] && \
   [ -d "/job/logs/personal-context/notes" ] && \
   [ -f "/job/logs/personal-context/README.md" ]; then
  pass
else
  fail "Directory structure is incomplete"
fi

# Test 10: Skill is registered
test_case "Personal context skill is discoverable"
if [ -f "/job/.pi/skills/personal-context/SKILL.md" ]; then
  pass
else
  fail "SKILL.md not found"
fi

# Summary
echo "========================================="
echo "Test Summary"
echo "========================================="
echo "Tests run:    $TESTS_RUN"
echo -e "${GREEN}Passed:       $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
  echo -e "${RED}Failed:       $TESTS_FAILED${NC}"
else
  echo "Failed:       $TESTS_FAILED"
fi
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed.${NC}"
  exit 1
fi
