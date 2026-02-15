#!/usr/bin/env node

/**
 * Rebuild the topics index from all topic JSON files
 * Usage: node rebuild-index.js
 */

const fs = require('fs');
const path = require('path');

function main() {
  const topicsDir = path.join(__dirname, '..', 'public', 'data', 'topics');

  if (!fs.existsSync(topicsDir)) {
    console.error('Error: Topics directory not found:', topicsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(topicsDir).filter((f) => f.endsWith('.json'));
  const topics = [];

  console.log(`Found ${files.length} topic files`);

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(topicsDir, file), 'utf-8');
      const topic = JSON.parse(content);
      topics.push({
        id: topic.id,
        keyword: topic.keyword,
        created: topic.created,
        colors: topic.colors || {
          level1: '#E3B341',
          level2: '#E07A3F',
          level3: '#C06C84',
          level4: '#4C78A8',
          level5: '#2A8F87',
        },
      });
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  // Sort by created date (newest first)
  topics.sort((a, b) => new Date(b.created) - new Date(a.created));

  const indexPath = path.join(path.dirname(topicsDir), 'topics-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(topics, null, 2));

  console.log(`\n✓ Rebuilt index with ${topics.length} topics`);
  console.log(`  Written to: ${indexPath}`);
}

main();
