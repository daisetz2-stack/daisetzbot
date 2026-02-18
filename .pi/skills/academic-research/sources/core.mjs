/**
 * CORE API Client (Fallback)
 * Used when OpenAlex doesn't have sufficient abstracts
 * https://core.ac.uk/services/api
 */

import fetch from 'node-fetch';

const BASE_URL = 'https://api.core.ac.uk/v3';
const API_KEY = process.env.CORE_API_KEY || null; // Optional, better with key

export async function searchPapers(query, limit = 20) {
  if (!API_KEY) {
    console.warn('⚠️  CORE_API_KEY not set - using unauthenticated access (rate limited)');
  }

  const params = new URLSearchParams({
    q: query,
    limit,
    sort: 'citationCount:desc'
  });

  const url = `${BASE_URL}/search/works?${params}`;
  const headers = API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {};

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`CORE API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return (data.results || []).map(formatPaper).filter(p => p.abstract);
  } catch (error) {
    console.error('CORE search failed:', error.message);
    return [];
  }
}

function formatPaper(work) {
  return {
    id: work.id,
    title: work.title,
    abstract: work.abstract || null,
    authors: work.authors?.map(a => a.name) || [],
    year: work.yearPublished || null,
    citations: work.citationCount || 0,
    url: work.downloadUrl || work.sourceFulltextUrls?.[0] || `https://core.ac.uk/display/${work.id}`,
    venue: work.publisher || 'Unknown',
    openAccess: true, // CORE only indexes OA content
    source: 'core'
  };
}

export async function supplementWithCORE(query, existingPapers, targetCount = 10) {
  if (existingPapers.length >= targetCount) {
    return existingPapers; // Already have enough
  }

  const needed = targetCount - existingPapers.length;
  console.log(`📚 Supplementing with CORE (need ${needed} more papers)`);

  const corePapers = await searchPapers(query, needed * 2);
  
  // Deduplicate by title (simple approach)
  const existingTitles = new Set(existingPapers.map(p => p.title?.toLowerCase()));
  const newPapers = corePapers.filter(p => !existingTitles.has(p.title?.toLowerCase()));

  console.log(`  ✓ Added ${Math.min(needed, newPapers.length)} papers from CORE\n`);
  
  return [...existingPapers, ...newPapers.slice(0, needed)];
}
