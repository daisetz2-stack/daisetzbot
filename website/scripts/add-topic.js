#!/usr/bin/env node

/**
 * Add a new topic to the 5levels website
 * Usage: node add-topic.js <topic-json-file>
 */

const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function validateTopic(topic) {
  const required = ['id', 'keyword', 'created', 'levels'];
  for (const field of required) {
    if (!topic[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!topic.keyword.en || !topic.keyword.ja) {
    throw new Error('keyword must have both "en" and "ja" properties');
  }

  if (!topic.levels.en || !topic.levels.ja) {
    throw new Error('levels must have both "en" and "ja" properties');
  }

  if (topic.levels.en.length !== 5 || topic.levels.ja.length !== 5) {
    throw new Error('Each language must have exactly 5 levels');
  }

  for (let i = 0; i < 5; i++) {
    const enLevel = topic.levels.en[i];
    const jaLevel = topic.levels.ja[i];

    if (!enLevel.level || !enLevel.title || !enLevel.content) {
      throw new Error(`English level ${i + 1} is missing required fields`);
    }

    if (!jaLevel.level || !jaLevel.title || !jaLevel.content) {
      throw new Error(`Japanese level ${i + 1} is missing required fields`);
    }

    if (enLevel.level !== i + 1 || jaLevel.level !== i + 1) {
      throw new Error(`Level numbers must be 1-5 in order`);
    }
  }

  return true;
}

function rebuildIndex(topicsDir) {
  const files = fs.readdirSync(topicsDir).filter((f) => f.endsWith('.json'));
  const topics = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(topicsDir, file), 'utf-8');
    const topic = JSON.parse(content);
    topics.push({
      id: topic.id,
      keyword: topic.keyword,
      created: topic.created,
      colors: topic.colors,
    });
  }

  // Sort by created date (newest first)
  topics.sort((a, b) => new Date(b.created) - new Date(a.created));

  const indexPath = path.join(path.dirname(topicsDir), 'topics-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(topics, null, 2));
  console.log(`✓ Rebuilt index with ${topics.length} topics`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node add-topic.js <topic-json-file>');
    process.exit(1);
  }

  const inputFile = args[0];

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  try {
    // Read and validate topic
    const content = fs.readFileSync(inputFile, 'utf-8');
    const topic = JSON.parse(content);
    
    console.log('Validating topic...');
    validateTopic(topic);
    console.log('✓ Topic is valid');

    // Ensure ID is slugified
    if (!topic.id.match(/^[a-z0-9-]+$/)) {
      const newId = slugify(topic.keyword.en);
      console.log(`Warning: ID should be slugified. Changing "${topic.id}" to "${newId}"`);
      topic.id = newId;
    }

    // Write to data directory
    const dataDir = path.join(__dirname, '..', 'public', 'data', 'topics');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const outputFile = path.join(dataDir, `${topic.id}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(topic, null, 2));
    console.log(`✓ Wrote topic to: ${outputFile}`);

    // Rebuild index
    rebuildIndex(dataDir);

    console.log('\n✓ Topic added successfully!');
    console.log(`  View at: /topic/${topic.id}`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
