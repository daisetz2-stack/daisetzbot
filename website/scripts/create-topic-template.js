#!/usr/bin/env node

/**
 * Create a blank topic template
 * Usage: node create-topic-template.js <keyword-en> <keyword-ja>
 */

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node create-topic-template.js <keyword-en> <keyword-ja>');
    console.error('Example: node create-topic-template.js "Quantum Computing" "量子コンピューティング"');
    process.exit(1);
  }

  const keywordEn = args[0];
  const keywordJa = args[1];
  const id = slugify(keywordEn);

  const template = {
    id,
    keyword: {
      en: keywordEn,
      ja: keywordJa,
    },
    created: new Date().toISOString(),
    colors: {
      level1: '#E3B341',
      level2: '#E07A3F',
      level3: '#C06C84',
      level4: '#4C78A8',
      level5: '#2A8F87',
    },
    levels: {
      en: [
        {
          level: 1,
          title: 'Child (Age 5-10)',
          content: 'TODO: Write child-level explanation...',
        },
        {
          level: 2,
          title: 'Teen (Age 13-17)',
          content: 'TODO: Write teen-level explanation...',
        },
        {
          level: 3,
          title: 'Undergraduate Student',
          content: 'TODO: Write undergraduate-level explanation...',
        },
        {
          level: 4,
          title: 'Graduate Student',
          content: 'TODO: Write graduate-level explanation...',
        },
        {
          level: 5,
          title: 'Expert',
          content: 'TODO: Write expert-level explanation...',
        },
      ],
      ja: [
        {
          level: 1,
          title: '子ども（5〜10歳）',
          content: 'TODO: 子どもレベルの説明を書く...',
        },
        {
          level: 2,
          title: 'ティーンエイジャー（13〜17歳）',
          content: 'TODO: ティーンレベルの説明を書く...',
        },
        {
          level: 3,
          title: '大学生',
          content: 'TODO: 大学生レベルの説明を書く...',
        },
        {
          level: 4,
          title: '大学院生',
          content: 'TODO: 大学院生レベルの説明を書く...',
        },
        {
          level: 5,
          title: '専門家',
          content: 'TODO: 専門家レベルの説明を書く...',
        },
      ],
    },
    sources: [
      {
        title: 'TODO: Add source title',
        url: 'https://example.com',
        language: 'en',
      },
    ],
  };

  const filename = `${id}.json`;
  console.log(JSON.stringify(template, null, 2));
  console.log(`\nSave this to: website/public/data/topics/${filename}`);
  console.log(`Then run: node scripts/add-topic.js public/data/topics/${filename}`);
}

main();
