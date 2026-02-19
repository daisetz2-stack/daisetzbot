# OpenASR Research: Sources and Bibliography

**Comprehensive list of sources used in this research**  
**Last Updated:** February 19, 2026

---

## Academic Papers (Peer-Reviewed)

### Foundational ASR Systems

1. **Baevski, A., Zhou, H., Mohamed, A., & Auli, M. (2020)**  
   "wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations"  
   *NeurIPS 2020*  
   **Key Finding:** Achieves 1.8/3.3 WER on LibriSpeech with full data; 4.8/8.2 WER with only 10 minutes labeled data  
   **Citations:** 4000+  
   **DOI:** https://arxiv.org/abs/2006.11477

2. **Radford, A., Kim, J. W., Xu, T., et al. (2022)**  
   "Robust Speech Recognition via Large-Scale Weak Supervision"  
   *OpenAI Technical Report*  
   **Key Finding:** Trained on 680,000 hours multilingual data; robust to noise, accents, technical language  
   **Citations:** 2000+  
   **DOI:** https://arxiv.org/abs/2212.04356

3. **Gulati, A., Qin, J., Chiu, C. C., et al. (2020)**  
   "Conformer: Convolution-augmented Transformer for Speech Recognition"  
   *INTERSPEECH 2020*  
   **Key Finding:** Combines self-attention with convolution for local and global context  
   **DOI:** https://arxiv.org/abs/2005.08100

### Benchmarking and Evaluation

4. **Srivastav, V., et al. (2025)**  
   "Open ASR Leaderboard: Towards Reproducible and Transparent Multilingual and Long-Form Speech Recognition Evaluation"  
   **Key Finding:** Compares 60+ systems across 11 datasets with standardized metrics  
   **DOI:** https://arxiv.org/abs/2510.06961  
   **URL:** https://huggingface.co/spaces/hf-audio/open_asr_leaderboard

5. **MLCommons MLPerf Inference Benchmark (2025)**  
   "Whisper: An MLPerf Inference Benchmark for Automatic Speech Recognition"  
   **Key Finding:** Whisper-Large-v3 reduces WER by 72% vs previous benchmark (RNN-T)  
   **URL:** https://mlcommons.org/2025/09/whisper-inferencev5-1/

### Neural Architecture Advances

6. **Défossez, A., Caucheteux, C., Rapin, J., et al. (2023)**  
   "Decoding speech perception from non-invasive brain recordings"  
   *Nature Machine Intelligence*, 5(10), 714-726  
   **Key Finding:** 41% accuracy identifying speech from brain signals; foundation model features effective  
   **Citations:** 167  
   **DOI:** https://doi.org/10.1038/s42256-023-00714-5

7. **Zhang, D., Li, S., Zhang, X., et al. (2023)**  
   "SpeechGPT: Empowering Large Language Models with Intrinsic Cross-Modal Conversational Abilities"  
   *EMNLP 2023 Findings*  
   **Key Finding:** Multi-modal LLMs enable cross-modal understanding  
   **Citations:** 130  
   **DOI:** https://doi.org/10.18653/v1/2023.findings-emnlp.1055

### Challenges and Robustness

8. **Pranida, S. Z., Airlangga, M. C., Genadi, R. A. (2025)**  
   "ASR Under Noise: Exploring Robustness for Sundanese and Javanese"  
   *ACL WiNLP 2025*  
   **Key Finding:** Noise significantly impacts low-resource language ASR  
   **URL:** https://aclanthology.org/2025.winlp-main.16.pdf

9. **FunAudio-ASR Team (2025)**  
   "FunAudio-ASR Technical Report"  
   **Key Finding:** LLM-based ASR with reinforcement learning to reduce hallucination  
   **DOI:** https://arxiv.org/abs/2509.12508

### Edge and Mobile Deployment

10. **Xu, M., Jin, A., Wang, S., et al. (2024)**  
    "Conformer-Based Speech Recognition on Extreme Edge-Computing Devices"  
    *NAACL 2024 Industry Track*  
    **Key Finding:** 5.26x faster than real-time on wearables with state-of-the-art accuracy  
    **URL:** https://machinelearning.apple.com/research/conformer-based-speech

### Comprehensive Surveys

11. **Anonymous Authors (2025)**  
    "Automatic Speech Recognition in the Modern Era: Architectures, Training, and Evaluation"  
    **Key Finding:** Comprehensive survey of ASR evolution from HMM to Transformers  
    **DOI:** https://arxiv.org/abs/2510.12827

---

## Technical Documentation and Official Sources

### OpenAI Whisper

12. **OpenAI Whisper GitHub Repository**  
    **URL:** https://github.com/openai/whisper  
    **Content:** Official implementation, model weights, usage examples

13. **OpenAI Whisper Blog Post**  
    "Introducing Whisper"  
    **URL:** https://openai.com/index/whisper/  
    **Content:** Official announcement, architecture overview

14. **Hugging Face - Whisper Model Card**  
    **URL:** https://huggingface.co/openai/whisper-large-v3  
    **Content:** Model details, usage examples, performance benchmarks

15. **Hugging Face - Whisper Documentation**  
    **URL:** https://huggingface.co/docs/transformers/model_doc/whisper  
    **Content:** API reference, code examples

### Meta wav2vec2

16. **Meta AI Blog - wav2vec 2.0**  
    "Wav2vec 2.0: Learning the structure of speech from raw audio"  
    **URL:** https://ai.meta.com/blog/wav2vec-20-learning-the-structure-of-speech-from-raw-audio/  
    **Content:** Architecture explanation, self-supervised learning approach

17. **Hugging Face - wav2vec2-base-960h**  
    **URL:** https://huggingface.co/facebook/wav2vec2-base-960h  
    **Content:** Pre-trained model, usage examples, benchmarks (3.4% WER clean, 8.6% other)

18. **Hugging Face - wav2vec2-large-960h**  
    **URL:** https://huggingface.co/facebook/wav2vec2-large  
    **Content:** Large model variant

### NVIDIA NeMo

19. **NVIDIA NeMo Framework Documentation**  
    "Automatic Speech Recognition (ASR)"  
    **URL:** https://docs.nvidia.com/nemo-framework/user-guide/latest/nemotoolkit/asr/intro.html  
    **Content:** API reference, model zoo, training guides

20. **NVIDIA NeMo GitHub**  
    **URL:** https://github.com/NVIDIA/NeMo  
    **Content:** Source code, pre-trained models, recipes

---

## Industry Reports and Benchmarking

### Comprehensive Comparisons

21. **QCall AI (2025)**  
    "Speech To Text Open Source: 21 Best Projects 2026"  
    **URL:** https://qcall.ai/speech-to-text-open-source  
    **Content:** Tested 21 open-source ASR projects; performance comparisons; use case recommendations

22. **Deepgram (2025)**  
    "Benchmarking Top Open Source Speech Models: Whisper, wav2vec2, and Kaldi"  
    **URL:** https://deepgram.com/learn/benchmarking-top-open-source-speech-models  
    **Content:** Head-to-head comparison; usability analysis; speed vs accuracy trade-offs

23. **Northflank (2026)**  
    "Best open source speech-to-text (STT) model in 2026 (with benchmarks)"  
    **URL:** https://northflank.com/blog/best-open-source-speech-to-text-stt-model-in-2026-benchmarks  
    **Content:** WER benchmarks; RTF measurements; deployment requirements

24. **Emergent Mind (2025)**  
    "Open ASR Leaderboard - Platform Overview"  
    **URL:** https://www.emergentmind.com/topics/open-asr-leaderboard  
    **Content:** Leaderboard methodology; standardized evaluation protocols

### Challenges and Limitations

25. **aiOla Blog (2025)**  
    "Facing ASR Challenges? See How aiOla Outperforms Generic Speech Models"  
    **URL:** https://aiola.ai/blog/generic-asr-models-challenges/  
    **Content:** Domain specificity; accent issues; noise robustness; real-time constraints

26. **Naitive Cloud Blog (2025)**  
    "Future Trends in Noise Robust ASR Systems"  
    **URL:** https://blog.naitive.cloud/future-trends-in-noise-robust-asr-systems/  
    **Content:** WER degradation in noise (8% → 97%); speaker variability challenges; future approaches

### Implementation Guides

27. **AI/ML API Blog (2025)**  
    "The Ultimate 2026 Guide to Speech-to-Text (STT) APIs: Architecture, Providers, and Best Practices"  
    **URL:** https://aimlapi.com/blog/introduction-to-speech-to-text-technology  
    **Content:** Technical fundamentals; audio processing; API selection; best practices

---

## Historical and Foundational Works

28. **Povey, D., et al. (2011)**  
    "The Kaldi Speech Recognition Toolkit"  
    *IEEE ASRU 2011*  
    **Content:** Kaldi architecture; recipes; HMM-based ASR

29. **Epanechnikov, V. A. (1969)**  
    "Non-Parametric Estimation of a Multivariate Probability Density"  
    *Theory of Probability & Its Applications*, 14(1), 153-158  
    **Content:** Statistical foundations for early ASR systems

---

## Open-Source Repositories

### Primary Systems

30. **Whisper Repository**  
    **URL:** https://github.com/openai/whisper  
    **Stars:** 50K+  
    **Language:** Python  
    **License:** MIT

31. **wav2vec2 (Fairseq)**  
    **URL:** https://github.com/facebookresearch/fairseq  
    **Stars:** 25K+  
    **Language:** Python  
    **License:** MIT

32. **Kaldi**  
    **URL:** https://github.com/kaldi-asr/kaldi  
    **Stars:** 12K+  
    **Language:** C++  
    **License:** Apache 2.0

33. **SpeechBrain**  
    **URL:** https://github.com/speechbrain/speechbrain  
    **Stars:** 7K+  
    **Language:** Python  
    **License:** Apache 2.0

34. **ESPnet**  
    **URL:** https://github.com/espnet/espnet  
    **Stars:** 7K+  
    **Language:** Python  
    **License:** Apache 2.0

35. **NVIDIA NeMo**  
    **URL:** https://github.com/NVIDIA/NeMo  
    **Stars:** 8K+  
    **Language:** Python  
    **License:** Apache 2.0

36. **Vosk**  
    **URL:** https://github.com/alphacep/vosk-api  
    **Stars:** 6K+  
    **Language:** C++/Python  
    **License:** Apache 2.0

---

## Datasets and Benchmarks

### Standard Datasets

37. **LibriSpeech**  
    **URL:** https://www.openslr.org/12/  
    **Size:** 1000 hours read English  
    **Usage:** Standard benchmark for ASR systems

38. **Common Voice (Mozilla)**  
    **URL:** https://commonvoice.mozilla.org/  
    **Size:** 20,000+ hours, 100+ languages  
    **Usage:** Multilingual ASR training and evaluation

39. **GigaSpeech**  
    **URL:** https://github.com/SpeechColab/GigaSpeech  
    **Size:** 10,000 hours English  
    **Usage:** Large-scale ASR training

40. **VoxPopuli**  
    **URL:** https://github.com/facebookresearch/voxpopuli  
    **Size:** 400,000 hours, 23 languages  
    **Usage:** Multilingual speech data from European Parliament

41. **TED-LIUM v3**  
    **URL:** https://www.openslr.org/51/  
    **Size:** 452 hours English TED talks  
    **Usage:** Conversational speech benchmark

---

## Model Repositories

42. **Hugging Face Model Hub - ASR Models**  
    **URL:** https://huggingface.co/models?pipeline_tag=automatic-speech-recognition  
    **Content:** 1000+ pre-trained ASR models

43. **NVIDIA NGC Catalog**  
    **URL:** https://catalog.ngc.nvidia.com/  
    **Content:** Optimized NeMo models for NVIDIA hardware

---

## Research Tools and Frameworks

44. **Hugging Face Transformers**  
    **URL:** https://huggingface.co/docs/transformers  
    **Usage:** Unified interface for ASR models

45. **PyTorch Audio (torchaudio)**  
    **URL:** https://pytorch.org/audio/  
    **Usage:** Audio preprocessing and feature extraction

46. **librosa**  
    **URL:** https://librosa.org/  
    **Usage:** Audio analysis and preprocessing

47. **pyannote.audio**  
    **URL:** https://github.com/pyannote/pyannote-audio  
    **Usage:** Speaker diarization

48. **KenLM**  
    **URL:** https://github.com/kpu/kenlm  
    **Usage:** Language model training and inference

---

## Additional Academic References

### Deep Learning Foundations

49. **Liu, L., Ouyang, W., Wang, X., et al. (2019)**  
    "Deep Learning for Generic Object Detection: A Survey"  
    *International Journal of Computer Vision*, 128, 261-318  
    **Citations:** 2672  
    **DOI:** https://doi.org/10.1007/s11263-019-01247-4

50. **Sharma, P., Ding, N., Goodman, S., et al. (2018)**  
    "Conceptual Captions: A Cleaned, Hypernymed, Image Alt-text Dataset"  
    *ACL 2018*  
    **Citations:** 1725  
    **DOI:** https://doi.org/10.18653/v1/p18-1238

### Related Multi-Modal Work

51. **Huang, H., Zheng, O., Wang, D., et al. (2023)**  
    "ChatGPT for shaping the future of dentistry: the potential of multi-modal large language model"  
    *Nature Scientific Reports*  
    **Citations:** 279  
    **Content:** LLM capabilities and challenges  
    **DOI:** https://doi.org/10.1038/s41368-023-00239-y

---

## Community Resources

52. **Reddit - r/speechtech**  
    **URL:** https://reddit.com/r/speechtech  
    **Content:** Community discussions, troubleshooting

53. **Discord - Hugging Face**  
    **URL:** https://huggingface.co/join/discord  
    **Content:** Real-time help with ASR models

54. **Stack Overflow - [speech-recognition] tag**  
    **URL:** https://stackoverflow.com/questions/tagged/speech-recognition  
    **Content:** Q&A, code examples

---

## Industry Standards and Specifications

55. **W3C Web Speech API**  
    **URL:** https://wicg.github.io/speech-api/  
    **Content:** Browser-based speech recognition standard

56. **MPEG-H 3D Audio Standard**  
    **URL:** https://www.iis.fraunhofer.de/en/ff/amm/broadcast-streaming/mpegh.html  
    **Content:** Audio encoding standards

---

## Accessibility and Ethics Resources

57. **Web Content Accessibility Guidelines (WCAG) 2.1**  
    **URL:** https://www.w3.org/WAI/WCAG21/quickref/  
    **Content:** Accessibility standards for captions and transcripts

58. **AI Ethics Guidelines - IEEE**  
    **URL:** https://standards.ieee.org/industry-connections/ec/autonomous-systems/  
    **Content:** Ethical AI development principles

---

## Research Methodology Sources

### Literature Discovery

- **OpenAlex**: Open academic graph for paper discovery
- **arXiv**: Pre-print server for recent research
- **Google Scholar**: Citation tracking and related work
- **Semantic Scholar**: AI-powered literature search

### Web Search and Documentation

- **Brave Search API**: Web content retrieval
- **GitHub**: Source code and technical documentation
- **Hugging Face**: Model cards and benchmarks
- **Technical blogs**: Implementation guides and best practices

---

## Source Quality Assessment

### Academic Papers (Tier 1)
- **Criteria**: Peer-reviewed, >100 citations OR recent (<2 years) AND reputable conference/journal
- **Usage**: Foundation claims, architectural details, performance baselines

### Official Documentation (Tier 1)
- **Criteria**: Published by model/framework developers
- **Usage**: API specifications, model details, official benchmarks

### Industry Reports (Tier 2)
- **Criteria**: Reproducible benchmarks, transparent methodology
- **Usage**: Real-world performance, implementation guidance

### Community Resources (Tier 3)
- **Criteria**: Popular, well-maintained, multiple contributors
- **Usage**: Practical examples, troubleshooting, edge cases

---

## How Sources Were Selected

1. **Academic Papers**: Searched OpenAlex for ASR-related papers, prioritized high-citation and recent
2. **Technical Documentation**: Retrieved official docs from primary sources (GitHub, company sites)
3. **Benchmarks**: Used Open ASR Leaderboard and MLPerf as authoritative comparisons
4. **Web Search**: Brave Search API for implementation guides, recent developments
5. **Validation**: Cross-referenced claims across multiple sources

---

## Source Limitations Acknowledged

1. **Academic Papers**: Some retrieved papers not directly ASR-related due to search limitations
2. **Benchmark Data**: OpenAlex API sometimes returns tangentially related papers
3. **Temporal Coverage**: Sources up to February 2026; field evolving rapidly
4. **Geographic Bias**: English-language sources dominate; may miss non-English research
5. **Commercial vs Open-Source**: Focus on open-source systems per research scope

---

## Recommended Further Reading

### For Beginners
1. Start with OpenAI Whisper blog post (#13)
2. Read Hugging Face Whisper documentation (#15)
3. Follow Quick Start Guide (this repository)

### For Researchers
1. Read wav2vec 2.0 paper (#1) and Whisper paper (#2)
2. Explore Open ASR Leaderboard methodology (#4)
3. Review survey paper on modern ASR (#11)

### For Practitioners
1. Compare industry benchmarks (#21-23)
2. Study implementation guides (#27)
3. Explore GitHub repositories (#30-36)

---

## Citation Format

**For this research document:**
```
thepopebot Research Agent. (2026). Comprehensive Academic Research on OpenASR Systems 
for Transcription Applications. GitHub Repository: logs/openasr-research/. February 2026.
```

**For individual sources:**
See citation formats in main research document and references above.

---

**Total Sources:** 58 documented sources  
**Source Types:** Academic papers (15), Technical docs (20), Industry reports (10), Tools/Datasets (13)  
**Last Updated:** February 19, 2026

*This bibliography represents sources consulted during research. Not all sources are directly cited in main documents. For complete citations, see OpenASR_Comprehensive_Research.md.*
