#!/bin/bash

# Update personal context storage
# Usage: ./update-context.sh <category> <key> <value>

set -e

CONTEXT_DIR="/job/logs/personal-context"
UPDATES_FILE="$CONTEXT_DIR/updates.jsonl"

# Ensure directory exists
mkdir -p "$CONTEXT_DIR"

# Get arguments
CATEGORY="${1:-unknown}"
KEY="${2:-unknown}"
VALUE="${3:-}"

# Create update record (compact JSON for JSONL format)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
UPDATE_RECORD=$(jq -n -c \
  --arg ts "$TIMESTAMP" \
  --arg cat "$CATEGORY" \
  --arg key "$KEY" \
  --arg val "$VALUE" \
  '{timestamp: $ts, category: $cat, key: $key, value: $val}')

# Append to updates file (one line per record)
echo "$UPDATE_RECORD" >> "$UPDATES_FILE"

echo "✓ Context update recorded: $CATEGORY/$KEY"
echo "$UPDATE_RECORD" | jq .
