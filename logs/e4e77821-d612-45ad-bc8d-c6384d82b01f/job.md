Create a "/5levels" slash command system for thepopebot with bilingual support and a modern web interface matching the provided design reference.

Design System to Replicate:
- Typography: Copernicus Trial serif for headings, Hanken Grotesk sans-serif for body
- Color palette: Warm neutrals (#F9F9F9 backgrounds, #111111 text) with level-specific accent colors
- Level color coding: #E3B341 (Level 1), #E07A3F (Level 2), #C06C84 (Level 3), #4C78A8 (Level 4), #2A8F87 (Level 5)
- Fixed language toggle (top-right) with pill-style active state
- Centered layout with max-width 800px container
- Card-based design with subtle shadows and rounded corners (24px radius)
- Level preview dots using the color-coded system

System Components:

1. Bilingual Slash Command Handler
   - Add "/5levels [keyword]" command recognition to Telegram chat
   - Support both English and Japanese keyword inputs
   - Automatically trigger research jobs with language context

2. Enhanced Research Pipeline
   - Web search across English and Japanese sources
   - Wikipedia, educational sites, news, X/Twitter discourse in both languages
   - Academic/industry sources with regional perspectives
   - Focus on unsolved problems and cultural context differences

3. Bilingual 5-Level Content Structure
   - Generate content in both English and Japanese for each level
   - Use the exact color coding system from reference design
   - Level 1-5 progression with appropriate complexity and cultural examples

4. Website Implementation
   - Exact replication of the provided HTML/CSS design system
   - Responsive design with the same typography and spacing
   - Fixed language toggle with smooth transitions
   - Archive system showing all researched topics as cards
   - Search and filtering functionality
   - Individual topic pages with full 5-level breakdowns

5. Technical Features
   - React-based frontend with the exact color variables and styling
   - JSON data structure supporting bilingual content
   - Font loading (Hanken Grotesk from Google Fonts + local Copernicus Trial fallback)
   - Mobile-responsive with the same clamp() approach for typography
   - SEO optimization for both languages

6. Integration
   - Modify CHATBOT.md for bilingual "/5levels" command recognition
   - Automated job creation with language detection
   - Quality translation and cultural adaptation
   - Source citation system matching the clean aesthetic

The system should produce a website that looks exactly like your reference design but populated with 5-level research content, complete with the language toggle and archive functionality.