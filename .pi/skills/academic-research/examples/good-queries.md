# Good Query Examples

## Technical/Scientific Topics

### Excellent Queries (Focused, Specific)
- `"neural network pruning techniques"`
- `"quantum error correction codes"`
- `"CRISPR off-target effects"`
- `"transformer attention mechanisms"`
- `"federated learning privacy"`
- `"graph neural network interpretability"`

### Good Queries (Clear Boundaries)
- `"attention mechanisms in transformers"`
- `"protein folding prediction methods"`
- `"reinforcement learning exploration strategies"`
- `"adversarial robustness in computer vision"`
- `"energy-efficient neural architectures"`

### Marginal Queries (Too Broad)
- `"machine learning"` → Use: `"deep learning optimization methods"`
- `"climate change"` → Use: `"climate change attribution methods"`
- `"artificial intelligence"` → Use: `"neural architecture search"`

## Medical/Biological Topics

### Excellent
- `"mRNA vaccine immunogenicity"`
- `"gut microbiome and depression"`
- `"checkpoint inhibitor resistance mechanisms"`
- `"senolytic drugs in aging"`

### Good
- `"SARS-CoV-2 variant immune escape"`
- `"CAR-T cell therapy toxicity"`
- `"mitochondrial dysfunction in Parkinson's"`

## Social Science Topics

### Excellent
- `"social media echo chambers measurement"`
- `"remote work productivity effects"`
- `"income inequality and health outcomes"`
- `"police body camera effectiveness"`

### Good
- `"misinformation spread on social networks"`
- `"universal basic income pilot studies"`
- `"gender bias in hiring algorithms"`

## Query Construction Tips

### Use Specific Technical Terms
❌ `"making AI better"`  
✅ `"neural architecture search optimization"`

### Include Method or Context
❌ `"cancer treatment"`  
✅ `"immune checkpoint inhibitors in melanoma"`

### Narrow the Scope
❌ `"education technology"`  
✅ `"adaptive learning systems effectiveness"`

### Specify the Research Question
❌ `"blockchain"`  
✅ `"blockchain consensus mechanism scalability"`

## Multi-Word Queries

Best practice: **3-5 word queries** capture specific research areas without over-constraining

### Sweet Spot Examples
- `"transformer model compression"` (3 words)
- `"graph neural network explainability"` (4 words)
- `"federated learning differential privacy guarantees"` (5 words)

## Emerging vs Established Topics

### Emerging (Last 2-3 years)
Focus on recent papers with `--papers=15` for broader coverage:
- `"large language model alignment"`
- `"diffusion model training efficiency"`
- `"neural implicit representations"`

### Established (10+ years)
Focus on high-citation anchors with `--papers=10`:
- `"convolutional neural network architectures"`
- `"support vector machine kernels"`
- `"random forest feature importance"`

## Domain-Specific Queries

### Computer Science
- `"distributed system consensus protocols"`
- `"compiler optimization techniques"`
- `"program synthesis neural methods"`

### Physics
- `"topological insulators experimental signatures"`
- `"dark matter detection techniques"`
- `"quantum entanglement verification"`

### Chemistry
- `"metal-organic framework gas separation"`
- `"photocatalytic water splitting efficiency"`
- `"lithium-ion battery dendrite formation"`

### Economics
- `"inflation targeting monetary policy effectiveness"`
- `"carbon tax economic impacts"`
- `"cryptocurrency market microstructure"`

## What to Avoid

### Too Generic
❌ `"technology"`  
❌ `"science"`  
❌ `"research"`  

### Too Narrow (Unlikely to find papers)
❌ `"transformer attention in BERT with 12 layers for question answering on SQuAD"`

### Non-Academic Topics
❌ `"best pizza recipe"`  
❌ `"celebrity gossip"`  
❌ `"stock market predictions"`  
(System is optimized for academic research, not general web content)

## Testing Your Query

Before running the full pipeline, ask:

1. **Would this return academic papers?** ✓
2. **Is there active research in this area?** ✓
3. **Can I name 3 papers on this topic?** ✓
4. **Is it specific enough?** (3-5 words) ✓
5. **Does it include technical terms?** ✓

If all ✓, proceed!
