#!/usr/bin/env node

/**
 * Verify 5levels system is properly installed
 */

const fs = require('fs');
const path = require('path');

let errors = 0;
let warnings = 0;

function check(name, condition, message, isWarning = false) {
  if (!condition) {
    if (isWarning) {
      console.log(`⚠️  ${name}: ${message}`);
      warnings++;
    } else {
      console.log(`❌ ${name}: ${message}`);
      errors++;
    }
    return false;
  }
  console.log(`✅ ${name}`);
  return true;
}

console.log('🔍 Verifying 5Levels System Installation\n');

// Check skill file
const skillPath = path.join(__dirname, '../../.pi/skills/5levels/SKILL.md');
check(
  'Skill file',
  fs.existsSync(skillPath),
  'SKILL.md not found at .pi/skills/5levels/'
);

// Check CHATBOT.md has /5levels
const chatbotPath = path.join(__dirname, '../../operating_system/CHATBOT.md');
if (fs.existsSync(chatbotPath)) {
  const content = fs.readFileSync(chatbotPath, 'utf-8');
  check(
    'CHATBOT.md integration',
    content.includes('/5levels'),
    'CHATBOT.md does not mention /5levels command'
  );
}

// Check website structure
const websitePath = path.join(__dirname, '..');
check('Website directory', fs.existsSync(websitePath), 'website/ not found');

const srcPath = path.join(websitePath, 'src');
check('Source directory', fs.existsSync(srcPath), 'website/src/ not found');

const componentsPath = path.join(srcPath, 'components');
check(
  'Components directory',
  fs.existsSync(componentsPath),
  'website/src/components/ not found'
);

// Check key components
const components = [
  'Header.jsx',
  'LanguageToggle.jsx',
  'TopicCard.jsx',
  'LevelSection.jsx',
];
components.forEach((comp) => {
  const compPath = path.join(componentsPath, comp);
  check(
    `Component: ${comp}`,
    fs.existsSync(compPath),
    `${comp} not found in components/`
  );
});

// Check pages
const pagesPath = path.join(srcPath, 'pages');
check('Pages directory', fs.existsSync(pagesPath), 'website/src/pages/ not found');

['Archive.jsx', 'TopicDetail.jsx'].forEach((page) => {
  const pagePath = path.join(pagesPath, page);
  check(`Page: ${page}`, fs.existsSync(pagePath), `${page} not found in pages/`);
});

// Check styles
const stylesPath = path.join(srcPath, 'styles');
check('Styles directory', fs.existsSync(stylesPath), 'website/src/styles/ not found');

['variables.css', 'global.css'].forEach((style) => {
  const stylePath = path.join(stylesPath, style);
  check(`Style: ${style}`, fs.existsSync(stylePath), `${style} not found in styles/`);
});

// Check App and main
check('App.jsx', fs.existsSync(path.join(srcPath, 'App.jsx')), 'App.jsx not found');
check('main.jsx', fs.existsSync(path.join(srcPath, 'main.jsx')), 'main.jsx not found');

// Check scripts
const scriptsPath = path.join(websitePath, 'scripts');
check('Scripts directory', fs.existsSync(scriptsPath), 'website/scripts/ not found');

['add-topic.js', 'rebuild-index.js', 'create-topic-template.js'].forEach((script) => {
  const scriptPath = path.join(scriptsPath, script);
  check(`Script: ${script}`, fs.existsSync(scriptPath), `${script} not found in scripts/`);
});

// Check data structure
const dataPath = path.join(websitePath, 'public/data');
check('Data directory', fs.existsSync(dataPath), 'website/public/data/ not found');

const topicsPath = path.join(dataPath, 'topics');
check(
  'Topics directory',
  fs.existsSync(topicsPath),
  'website/public/data/topics/ not found'
);

const indexPath = path.join(dataPath, 'topics-index.json');
check(
  'Topics index',
  fs.existsSync(indexPath),
  'topics-index.json not found'
);

// Check example topic
const examplePath = path.join(topicsPath, 'example-quantum-computing.json');
if (check('Example topic', fs.existsSync(examplePath), 'example topic not found')) {
  try {
    const example = JSON.parse(fs.readFileSync(examplePath, 'utf-8'));
    check('Example has id', example.id, 'Example topic missing id');
    check('Example has keywords', example.keyword, 'Example topic missing keyword');
    check(
      'Example has EN keyword',
      example.keyword?.en,
      'Example topic missing English keyword'
    );
    check(
      'Example has JA keyword',
      example.keyword?.ja,
      'Example topic missing Japanese keyword'
    );
    check('Example has levels', example.levels, 'Example topic missing levels');
    check(
      'Example has EN levels',
      example.levels?.en,
      'Example topic missing English levels'
    );
    check(
      'Example has JA levels',
      example.levels?.ja,
      'Example topic missing Japanese levels'
    );
    check(
      'Example has 5 EN levels',
      example.levels?.en?.length === 5,
      'Example topic should have 5 English levels'
    );
    check(
      'Example has 5 JA levels',
      example.levels?.ja?.length === 5,
      'Example topic should have 5 Japanese levels'
    );
    check('Example has sources', example.sources, 'Example topic missing sources');
  } catch (err) {
    check('Example JSON valid', false, `Invalid JSON: ${err.message}`);
  }
}

// Check configuration files
check(
  'package.json',
  fs.existsSync(path.join(websitePath, 'package.json')),
  'package.json not found'
);
check(
  'vite.config.js',
  fs.existsSync(path.join(websitePath, 'vite.config.js')),
  'vite.config.js not found'
);
check(
  'index.html',
  fs.existsSync(path.join(websitePath, 'index.html')),
  'index.html not found'
);

// Check documentation
const docsPath = path.join(__dirname, '../../docs');
[
  '5LEVELS.md',
  'QUICKSTART_5LEVELS.md',
  '5LEVELS_TESTING.md',
  '5LEVELS_DEPLOYMENT.md',
].forEach((doc) => {
  const docPath = path.join(docsPath, doc);
  check(`Documentation: ${doc}`, fs.existsSync(docPath), `${doc} not found in docs/`);
});

// Check color values in variables.css
const variablesPath = path.join(stylesPath, 'variables.css');
if (fs.existsSync(variablesPath)) {
  const variables = fs.readFileSync(variablesPath, 'utf-8');
  const requiredColors = {
    '--color-level-1': '#E3B341',
    '--color-level-2': '#E07A3F',
    '--color-level-3': '#C06C84',
    '--color-level-4': '#4C78A8',
    '--color-level-5': '#2A8F87',
  };

  Object.entries(requiredColors).forEach(([varName, color]) => {
    check(
      `Color: ${varName}`,
      variables.includes(color),
      `${varName} should be ${color}`,
      true
    );
  });
}

// Check node_modules
const nodeModulesPath = path.join(websitePath, 'node_modules');
check(
  'Dependencies installed',
  fs.existsSync(nodeModulesPath),
  'Run "npm install" in website/',
  true
);

// Summary
console.log('\n' + '='.repeat(50));
if (errors === 0 && warnings === 0) {
  console.log('🎉 All checks passed! System is ready.');
} else {
  console.log(`\n📊 Results:`);
  if (errors > 0) {
    console.log(`   ❌ Errors: ${errors}`);
  }
  if (warnings > 0) {
    console.log(`   ⚠️  Warnings: ${warnings}`);
  }

  if (errors > 0) {
    console.log('\n❗ Please fix errors before using the system.');
    process.exit(1);
  } else {
    console.log('\n✅ System is functional (warnings are optional).');
  }
}

console.log('='.repeat(50));
