Overhaul Research System for Grounded Academic Intelligence

The current research system produces too much meta-commentary and not enough substantive research content. Replace the entire research pipeline to prioritize concrete findings over process descriptions.

CORE OBJECTIVE: Transform from academic process commentary into dense knowledge synthesis that actually educates users about research findings.

IMPLEMENTATION PLAN:

1. Replace Current Research Pipeline
- Implement the lightweight academic intelligence system exactly as specified in the user's plan
- Multi-source abstract retrieval (OpenAlex primary, CORE fallback)
- Evidence object extraction with atomic knowledge units (claim, finding_direction, method, domain_context, uncertainty_flag, evidence_strength)
- Deterministic claim grouping with 60% similarity threshold
- Tension detection for disputes vs consensus
- Knowledge gap & risk signal detection

2. Implement 5-Level Synthesis Framework
Replace verbose pipeline descriptions with focused synthesis:
- FUNDAMENTALS: What is widely accepted
- CURRENT STATE: Dominant approaches and prevailing methods  
- CUTTING EDGE: Where disagreement or experimentation exists
- IMPLICATIONS: Why disagreements matter in practice
- META: What remains unknown and why

3. Enforce Strict Token Discipline
- Final output ≤ 300 tokens maximum
- Choose 8-12 evidence objects strategically (3-4 high-citation anchors, 3-4 recent frontier, 1-2 surveys, remainder for gaps)
- If token limit exceeded → truncate prose, preserve evidence snapshot

4. Update Output Template Contract
🔬 Research Map format:
- FUNDAMENTALS (dense knowledge, not process)
- CURRENT STATE (actual research findings)
- CUTTING EDGE (specific disagreements/experiments)
- IMPLICATIONS (practical consequences)
- META (concrete unknowns)
- 3-sentence synthesis
- Evidence Snapshot (top 6 with specific claims)

5. Quality Guardrails
- Every synthesis statement must reference ≥1 evidence ID
- Traceability: all claims traceable to source papers
- Prioritize substance over methodology commentary
- Include methodological red flags as signals, not conclusions
- Focus on teaching actual subject matter

6. Remove Meta-Commentary
- Eliminate redundant process descriptions
- Replace "how we studied" with "what we learned"
- Convert generic research gaps into specific actionable directions
- Maximize information density at each synthesis level

DELIVERABLES:
- Updated research pipeline code implementing the lightweight system
- New output template focused on grounded insights
- Token discipline enforcement mechanisms  
- Evidence object extraction and synthesis logic
- Updated prompts that prioritize substantive content over process description

The result should be a system that produces research summaries users can actually read and learn from, rather than meta-analysis of research processes.