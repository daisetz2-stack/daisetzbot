#!/usr/bin/env node

/**
 * Example: Using Personal Context in a daisetz Job
 * 
 * This demonstrates how to load and use personal context
 * to provide personalized, contextually-aware responses.
 */

const { execSync } = require('child_process');

// Load personal context
function loadPersonalContext() {
  try {
    const result = execSync('node /job/.pi/skills/personal-context/load-context.js', {
      encoding: 'utf-8'
    });
    return JSON.parse(result);
  } catch (error) {
    console.error('Failed to load personal context:', error.message);
    return { available: false };
  }
}

// Example: Personalized greeting
function personalizedGreeting(contextResult) {
  if (contextResult.available && contextResult.context.name) {
    return `Hi ${contextResult.context.name}! 👋`;
  }
  return 'Hi there! 👋';
}

// Example: Respect communication style
function formatMessage(message, contextResult) {
  if (!contextResult.available) return message;
  
  const style = contextResult.context.preferences?.communication_style;
  
  switch (style) {
    case 'direct':
      // Keep it brief, remove pleasantries
      return message.split('\n')[0];
      
    case 'friendly':
      // Add warmth
      return message + '\n\nLet me know if you need anything else!';
      
    case 'technical':
      // Add technical details
      return message + '\n\n[Technical details available on request]';
      
    default:
      return message;
  }
}

// Example: Suggest tools based on expertise
function suggestTools(contextResult) {
  if (!contextResult.available) {
    return ['General purpose tools'];
  }
  
  const expertise = contextResult.context.background?.expertise || [];
  const suggestions = [];
  
  if (expertise.includes('Python')) {
    suggestions.push('Python-based solution');
  }
  if (expertise.includes('JavaScript') || expertise.includes('TypeScript')) {
    suggestions.push('Node.js solution');
  }
  if (expertise.includes('Rust')) {
    suggestions.push('Rust for performance');
  }
  
  return suggestions.length > 0 ? suggestions : ['Universal solution'];
}

// Example: Time-aware scheduling
function getPreferredWorkingHours(contextResult) {
  if (!contextResult.available) {
    return { start: 9, end: 17 }; // Default 9-5
  }
  
  const hours = contextResult.context.preferences?.notification_hours;
  if (hours) {
    // Parse something like "9am-6pm" or "10am-8pm JST"
    const match = hours.match(/(\d+).*?-.*?(\d+)/);
    if (match) {
      return { start: parseInt(match[1]), end: parseInt(match[2]) };
    }
  }
  
  return { start: 9, end: 17 };
}

// Example: Reference active projects
function findRelevantProjects(taskDescription, contextResult) {
  if (!contextResult.available || !contextResult.context.projects) {
    return [];
  }
  
  const activeProjects = contextResult.context.projects.filter(
    p => p.status === 'active'
  );
  
  // Simple keyword matching
  return activeProjects.filter(project => {
    const keywords = taskDescription.toLowerCase();
    return keywords.includes(project.name.toLowerCase()) ||
           (project.description && keywords.includes(project.description.toLowerCase()));
  });
}

// Main demo
function main() {
  console.log('=== Personal Context Usage Example ===\n');
  
  // Load context
  const ctx = loadPersonalContext();
  
  console.log('1. Loading context...');
  console.log(`   Available: ${ctx.available}`);
  if (ctx.available) {
    console.log(`   Name: ${ctx.context.name}`);
    console.log(`   Timezone: ${ctx.context.timezone || 'not set'}`);
  }
  console.log('');
  
  // Personalized greeting
  console.log('2. Personalized greeting:');
  console.log(`   ${personalizedGreeting(ctx)}`);
  console.log('');
  
  // Communication style
  const message = 'Task completed successfully.\nAll tests passing.\nReady for next step.';
  console.log('3. Respecting communication style:');
  console.log('   Original:', message.replace(/\n/g, ' '));
  console.log('   Formatted:', formatMessage(message, ctx).replace(/\n/g, ' '));
  console.log('');
  
  // Tool suggestions
  console.log('4. Tool suggestions based on expertise:');
  const tools = suggestTools(ctx);
  tools.forEach(tool => console.log(`   - ${tool}`));
  console.log('');
  
  // Working hours
  const hours = getPreferredWorkingHours(ctx);
  console.log('5. Preferred working hours:');
  console.log(`   ${hours.start}:00 - ${hours.end}:00`);
  console.log('');
  
  // Project relevance
  const taskDesc = 'Update the daisetz documentation';
  console.log('6. Finding relevant projects:');
  console.log(`   Task: "${taskDesc}"`);
  const projects = findRelevantProjects(taskDesc, ctx);
  if (projects.length > 0) {
    projects.forEach(p => console.log(`   - ${p.name} (${p.status})`));
  } else {
    console.log('   No matching active projects');
  }
  console.log('');
  
  console.log('=== Demo Complete ===');
}

// Run the demo
if (require.main === module) {
  main();
}

// Export functions for use in other scripts
module.exports = {
  loadPersonalContext,
  personalizedGreeting,
  formatMessage,
  suggestTools,
  getPreferredWorkingHours,
  findRelevantProjects
};
