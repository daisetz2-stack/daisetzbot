/**
 * OpenAlex API Client
 * Primary source for academic abstracts and metadata
 * https://docs.openalex.org/
 */

import fetch from 'node-fetch';

const BASE_URL = 'https://api.openalex.org';
const EMAIL = 'polite@pool.request'; // Polite pool access

export async function searchPapers(query, options = {}) {
  const {
    limit = 50,
    sortBy = 'cited_by_count:desc', // High-citation anchors first
    publicationYearMin = null,
    publicationYearMax = null,
    openAccessOnly = false
  } = options;

  const params = new URLSearchParams({
    search: query,
    per_page: limit,
    sort: sortBy,
    mailto: EMAIL
  });

  if (publicationYearMin) {
    params.append('filter', `publication_year:${publicationYearMin}-${publicationYearMax || new Date().getFullYear()}`);
  }

  if (openAccessOnly) {
    params.append('filter', 'is_oa:true');
  }

  const url = `${BASE_URL}/works?${params}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results.map(formatPaper);
  } catch (error) {
    console.error('OpenAlex search failed:', error.message);
    return [];
  }
}

export async function getRecentPapers(query, yearsBack = 2, limit = 20) {
  const currentYear = new Date().getFullYear();
  return searchPapers(query, {
    limit,
    sortBy: 'publication_date:desc',
    publicationYearMin: currentYear - yearsBack
  });
}

export async function getSurveyPapers(query, limit = 10) {
  // Look for review papers and surveys
  const surveyQuery = `${query} (review OR survey OR "systematic review")`;
  return searchPapers(surveyQuery, {
    limit,
    sortBy: 'cited_by_count:desc'
  });
}

function formatPaper(work) {
  const abstract = work.abstract_inverted_index 
    ? reconstructAbstract(work.abstract_inverted_index)
    : null;

  return {
    id: work.id,
    title: work.title,
    abstract,
    authors: work.authorships?.map(a => a.author?.display_name).filter(Boolean) || [],
    year: work.publication_year,
    citations: work.cited_by_count || 0,
    url: work.doi ? `https://doi.org/${work.doi.replace('https://doi.org/', '')}` : work.id,
    venue: work.primary_location?.source?.display_name || 'Unknown',
    openAccess: work.open_access?.is_oa || false,
    concepts: work.concepts?.map(c => ({ name: c.display_name, score: c.score })) || [],
    source: 'openalex'
  };
}

function reconstructAbstract(invertedIndex) {
  // OpenAlex stores abstracts as inverted index: {word: [positions]}
  // Reconstruct the original text
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  return words.join(' ');
}

export async function getCoreSet(query, options = {}) {
  const {
    highCitationCount = 4,
    recentCount = 4,
    surveyCount = 2
  } = options;

  console.log(`📚 Fetching academic sources for: "${query}"`);
  
  // Parallel fetch for efficiency
  const [highCitation, recent, surveys] = await Promise.all([
    searchPapers(query, { limit: highCitationCount * 2, sortBy: 'cited_by_count:desc' }),
    getRecentPapers(query, 2, recentCount * 2),
    getSurveyPapers(query, surveyCount * 2)
  ]);

  // Filter for quality: must have abstract
  const filtered = {
    highCitation: highCitation.filter(p => p.abstract).slice(0, highCitationCount),
    recent: recent.filter(p => p.abstract).slice(0, recentCount),
    surveys: surveys.filter(p => p.abstract).slice(0, surveyCount)
  };

  const total = filtered.highCitation.length + filtered.recent.length + filtered.surveys.length;
  console.log(`  ✓ High-citation: ${filtered.highCitation.length}`);
  console.log(`  ✓ Recent frontier: ${filtered.recent.length}`);
  console.log(`  ✓ Surveys: ${filtered.surveys.length}`);
  console.log(`  Total: ${total} papers with abstracts\n`);

  return {
    ...filtered,
    all: [...filtered.highCitation, ...filtered.recent, ...filtered.surveys]
  };
}
