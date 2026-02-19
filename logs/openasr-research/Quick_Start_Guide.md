# OpenASR Quick Start Guide for Practitioners

**Last Updated:** February 19, 2026

This guide provides practical, copy-paste examples to get started with OpenASR systems quickly.

---

## Table of Contents

1. [Installation](#installation)
2. [Basic Transcription Examples](#basic-transcription-examples)
3. [Advanced Usage Patterns](#advanced-usage-patterns)
4. [Performance Optimization](#performance-optimization)
5. [Common Issues and Solutions](#common-issues-and-solutions)

---

## Installation

### Whisper

```bash
# Install Whisper
pip install openai-whisper

# Install ffmpeg (required dependency)
# On Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# On macOS
brew install ffmpeg

# On Windows
# Download from https://ffmpeg.org/download.html
```

### Whisper with Hugging Face Transformers

```bash
pip install transformers datasets[audio] accelerate torch
```

### wav2vec2

```bash
pip install transformers torch torchaudio
```

### NVIDIA NeMo

```bash
pip install nemo_toolkit['all']
```

### Vosk (Lightweight)

```bash
pip install vosk

# Download language model
# https://alphacephei.com/vosk/models
wget https://alphacephei.com/vosk/models/vosk-model-en-us-0.22.zip
unzip vosk-model-en-us-0.22.zip
```

---

## Basic Transcription Examples

### Example 1: Whisper - Simple File Transcription

```python
import whisper

# Load model (choose: tiny, base, small, medium, large-v3)
model = whisper.load_model("medium")

# Transcribe audio file
result = model.transcribe("audio.mp3")

# Print full transcript
print(result["text"])

# Access detailed information
print(f"Language: {result['language']}")
for segment in result['segments']:
    print(f"[{segment['start']:.2f}s - {segment['end']:.2f}s] {segment['text']}")
```

### Example 2: Whisper with Language Specification

```python
import whisper

model = whisper.load_model("medium")

# Specify source language
result = model.transcribe(
    "audio.mp3",
    language="en",  # English
    task="transcribe"  # or "translate" for translation to English
)

print(result["text"])
```

### Example 3: Whisper with Timestamps

```python
import whisper

model = whisper.load_model("medium")

# Get word-level timestamps
result = model.transcribe(
    "audio.mp3",
    word_timestamps=True
)

# Print word-level timestamps
for segment in result['segments']:
    for word in segment['words']:
        print(f"{word['word']}: {word['start']:.2f}s - {word['end']:.2f}s")
```

### Example 4: Whisper with Hugging Face (Recommended for Production)

```python
import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

# Setup device
device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

# Load model
model_id = "openai/whisper-large-v3"
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id, 
    torch_dtype=torch_dtype, 
    low_cpu_mem_usage=True,
    use_safetensors=True
)
model.to(device)

processor = AutoProcessor.from_pretrained(model_id)

# Create pipeline
pipe = pipeline(
    "automatic-speech-recognition",
    model=model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    torch_dtype=torch_dtype,
    device=device,
)

# Transcribe
result = pipe("audio.mp3")
print(result["text"])
```

### Example 5: Batch Processing Multiple Files

```python
import whisper

model = whisper.load_model("medium")

audio_files = ["meeting1.mp3", "meeting2.mp3", "interview1.mp3"]

for audio_file in audio_files:
    print(f"Processing {audio_file}...")
    result = model.transcribe(audio_file)
    
    # Save transcript to file
    output_file = audio_file.replace(".mp3", "_transcript.txt")
    with open(output_file, "w") as f:
        f.write(result["text"])
    
    print(f"Saved to {output_file}")
```

### Example 6: wav2vec2 Transcription

```python
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
import torch
import librosa

# Load model and processor
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-large-960h")
model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-large-960h")

# Load audio (must be 16kHz)
audio, sr = librosa.load("audio.mp3", sr=16000, mono=True)

# Prepare input
input_values = processor(audio, return_tensors="pt", sampling_rate=16000).input_values

# Inference
with torch.no_grad():
    logits = model(input_values).logits

# Decode
predicted_ids = torch.argmax(logits, dim=-1)
transcription = processor.batch_decode(predicted_ids)[0]

print(transcription)
```

### Example 7: NVIDIA NeMo (3 Lines)

```python
import nemo.collections.asr as nemo_asr

# Load pre-trained model
asr_model = nemo_asr.models.ASRModel.from_pretrained("nvidia/parakeet-tdt-0.6b")

# Transcribe
transcript = asr_model.transcribe(["audio.wav"])[0].text
print(transcript)
```

### Example 8: Vosk (Lightweight, Offline)

```python
import json
import wave
from vosk import Model, KaldiRecognizer

# Load model
model = Model("vosk-model-en-us-0.22")

# Open audio file
wf = wave.open("audio.wav", "rb")

# Create recognizer
rec = KaldiRecognizer(model, wf.getframerate())
rec.SetWords(True)

# Process audio
results = []
while True:
    data = wf.readframes(4000)
    if len(data) == 0:
        break
    if rec.AcceptWaveform(data):
        results.append(json.loads(rec.Result()))

# Final result
results.append(json.loads(rec.FinalResult()))

# Extract text
transcript = " ".join([r["text"] for r in results if "text" in r])
print(transcript)
```

---

## Advanced Usage Patterns

### Pattern 1: Audio Preprocessing Pipeline

```python
import librosa
import noisereduce as nr
import numpy as np

def preprocess_audio(audio_path, target_sr=16000):
    """
    Load and preprocess audio for ASR
    """
    # Load audio
    audio, sr = librosa.load(audio_path, sr=target_sr, mono=True)
    
    # Normalize amplitude
    audio = audio / np.max(np.abs(audio))
    
    # Noise reduction (optional, use with caution)
    audio = nr.reduce_noise(y=audio, sr=sr, stationary=True)
    
    # Trim silence
    audio, _ = librosa.effects.trim(audio, top_db=20)
    
    return audio, sr

# Use with Whisper
import whisper

model = whisper.load_model("medium")
audio, sr = preprocess_audio("noisy_audio.mp3")

# Save preprocessed audio temporarily
import soundfile as sf
sf.write("temp_preprocessed.wav", audio, sr)

result = model.transcribe("temp_preprocessed.wav")
print(result["text"])
```

### Pattern 2: Speaker Diarization + ASR

```python
from pyannote.audio import Pipeline
import whisper

# Load diarization pipeline (requires HF token)
diarization = Pipeline.from_pretrained(
    "pyannote/speaker-diarization",
    use_auth_token="YOUR_HF_TOKEN"
)

# Load ASR model
asr_model = whisper.load_model("medium")

# Perform diarization
audio_file = "meeting.wav"
diarization_result = diarization(audio_file)

# Extract segments and transcribe
import librosa
import soundfile as sf

audio, sr = librosa.load(audio_file, sr=16000)

for turn, _, speaker in diarization_result.itertracks(yield_label=True):
    # Extract segment
    start_sample = int(turn.start * sr)
    end_sample = int(turn.end * sr)
    segment = audio[start_sample:end_sample]
    
    # Save temporary segment
    sf.write("temp_segment.wav", segment, sr)
    
    # Transcribe
    result = asr_model.transcribe("temp_segment.wav")
    
    print(f"{speaker} [{turn.start:.1f}s - {turn.end:.1f}s]: {result['text']}")
```

### Pattern 3: Real-Time Streaming (NVIDIA NeMo)

```python
import nemo.collections.asr as nemo_asr
import pyaudio
import numpy as np

# Load streaming model
asr_model = nemo_asr.models.ASRModel.from_pretrained("nvidia/parakeet-tdt-0.6b")

# Audio parameters
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000

# Initialize PyAudio
p = pyaudio.PyAudio()
stream = p.open(
    format=FORMAT,
    channels=CHANNELS,
    rate=RATE,
    input=True,
    frames_per_buffer=CHUNK
)

print("Listening... (Ctrl+C to stop)")

try:
    audio_buffer = []
    while True:
        # Read audio chunk
        data = stream.read(CHUNK)
        audio_chunk = np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0
        audio_buffer.extend(audio_chunk)
        
        # Process when we have enough data (e.g., 1 second)
        if len(audio_buffer) >= RATE:
            # Transcribe
            transcript = asr_model.transcribe([np.array(audio_buffer)])[0].text
            if transcript:
                print(f"Partial: {transcript}")
            
            # Keep last 0.5 seconds for context
            audio_buffer = audio_buffer[-RATE//2:]
            
except KeyboardInterrupt:
    print("\nStopped")
finally:
    stream.stop_stream()
    stream.close()
    p.terminate()
```

### Pattern 4: Custom Language Model Integration

```python
import whisper
import kenlm

# Load ASR model
asr_model = whisper.load_model("medium")

# Load domain-specific language model
lm = kenlm.Model('medical_terms.arpa')

def rescore_with_lm(text, lm, lambda_weight=0.3):
    """
    Rescore transcription with language model
    """
    lm_score = lm.score(text)
    # In practice, you'd combine ASR log-probs with LM score
    # This is simplified example
    return text  # Return rescored/corrected text

# Transcribe
result = asr_model.transcribe("medical_consultation.mp3")
transcript = result["text"]

# Post-process with LM
improved_transcript = rescore_with_lm(transcript, lm)
print(improved_transcript)
```

### Pattern 5: Batch Processing with Progress Tracking

```python
import whisper
from tqdm import tqdm
import os
import json

def batch_transcribe(audio_files, model_name="medium", output_dir="transcripts"):
    """
    Transcribe multiple files with progress bar
    """
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Load model once
    print(f"Loading Whisper {model_name} model...")
    model = whisper.load_model(model_name)
    
    # Process files
    results = {}
    for audio_file in tqdm(audio_files, desc="Transcribing"):
        try:
            # Transcribe
            result = model.transcribe(audio_file)
            
            # Save transcript
            base_name = os.path.basename(audio_file).split('.')[0]
            output_file = os.path.join(output_dir, f"{base_name}_transcript.txt")
            
            with open(output_file, "w") as f:
                f.write(result["text"])
            
            # Save detailed JSON
            json_file = os.path.join(output_dir, f"{base_name}_detailed.json")
            with open(json_file, "w") as f:
                json.dump(result, f, indent=2)
            
            results[audio_file] = {
                "status": "success",
                "output": output_file
            }
            
        except Exception as e:
            results[audio_file] = {
                "status": "error",
                "error": str(e)
            }
    
    return results

# Usage
audio_files = [
    "meeting1.mp3",
    "meeting2.mp3",
    "interview1.wav"
]

results = batch_transcribe(audio_files, model_name="medium")

# Print summary
for file, result in results.items():
    print(f"{file}: {result['status']}")
```

---

## Performance Optimization

### Optimization 1: Enable GPU Acceleration

```python
import torch
import whisper

# Check GPU availability
if torch.cuda.is_available():
    print(f"GPU available: {torch.cuda.get_device_name(0)}")
    device = "cuda"
else:
    print("No GPU, using CPU")
    device = "cpu"

# Load model to GPU
model = whisper.load_model("medium", device=device)

# Transcribe (automatically uses GPU)
result = model.transcribe("audio.mp3")
```

### Optimization 2: Mixed Precision (FP16)

```python
import torch
from transformers import pipeline

# Enable automatic mixed precision
pipe = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-large-v3",
    torch_dtype=torch.float16,  # FP16 for 2x speedup
    device="cuda"
)

result = pipe("audio.mp3")
```

### Optimization 3: Batch Processing

```python
from transformers import pipeline

pipe = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-medium",
    device="cuda"
)

# Process multiple files at once
audio_files = ["audio1.mp3", "audio2.mp3", "audio3.mp3"]

# Batch inference
results = pipe(audio_files, batch_size=8)

for audio, result in zip(audio_files, results):
    print(f"{audio}: {result['text']}")
```

### Optimization 4: Model Quantization

```python
import torch
from transformers import AutoModelForSpeechSeq2Seq

# Load model with 8-bit quantization (requires bitsandbytes)
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    "openai/whisper-large-v3",
    load_in_8bit=True,  # 4x size reduction, minimal accuracy loss
    device_map="auto"
)

# Use as normal (inference will be faster)
```

### Optimization 5: Faster Whisper (Alternative Implementation)

```bash
pip install faster-whisper
```

```python
from faster_whisper import WhisperModel

# Load model (uses CTranslate2 for speedup)
model = WhisperModel("medium", device="cuda", compute_type="float16")

# Transcribe (up to 4x faster than original)
segments, info = model.transcribe("audio.mp3", beam_size=5)

for segment in segments:
    print(f"[{segment.start:.2f}s - {segment.end:.2f}s] {segment.text}")
```

---

## Common Issues and Solutions

### Issue 1: "Out of Memory" Error

**Problem**: GPU runs out of memory with large models.

**Solutions**:

```python
# Solution 1: Use smaller model
model = whisper.load_model("small")  # instead of "large"

# Solution 2: Process in chunks
def transcribe_long_audio(audio_file, chunk_duration=30):
    """
    Split long audio into chunks and transcribe
    """
    import librosa
    
    audio, sr = librosa.load(audio_file, sr=16000)
    chunk_samples = chunk_duration * sr
    
    model = whisper.load_model("medium")
    transcripts = []
    
    for i in range(0, len(audio), chunk_samples):
        chunk = audio[i:i+chunk_samples]
        result = model.transcribe(chunk)
        transcripts.append(result["text"])
    
    return " ".join(transcripts)

# Solution 3: Use CPU instead of GPU
model = whisper.load_model("medium", device="cpu")
```

### Issue 2: Poor Accuracy on Noisy Audio

**Solutions**:

```python
import noisereduce as nr
import librosa

# Preprocess audio to reduce noise
audio, sr = librosa.load("noisy_audio.mp3", sr=16000)

# Reduce noise
reduced_audio = nr.reduce_noise(
    y=audio, 
    sr=sr,
    stationary=True,
    prop_decrease=0.8  # Adjust (0.0 to 1.0)
)

# Save and transcribe
import soundfile as sf
sf.write("cleaned_audio.wav", reduced_audio, sr)

model = whisper.load_model("medium")
result = model.transcribe("cleaned_audio.wav")
```

### Issue 3: Incorrect Language Detection

**Solution**: Specify language explicitly

```python
# Force specific language
result = model.transcribe(
    "audio.mp3",
    language="en"  # or "es", "fr", "de", etc.
)
```

### Issue 4: Missing Punctuation

**Solution**: Use punctuation restoration model

```python
from transformers import pipeline

# Transcribe without punctuation
result = model.transcribe("audio.mp3")
text = result["text"]

# Restore punctuation
punctuator = pipeline(
    "token-classification",
    model="oliverguhr/fullstop-punctuation-multilang-large"
)

# Apply (implementation depends on model output format)
# This is simplified - check model documentation
```

### Issue 5: Slow CPU Transcription

**Solutions**:

```python
# Solution 1: Use smaller model
model = whisper.load_model("tiny")  # Fastest

# Solution 2: Use Vosk (optimized for CPU)
# See Example 8 above

# Solution 3: Use cloud GPU
# Deploy on AWS/GCP/Azure with GPU instances
```

### Issue 6: Hallucination (Repetitive Text)

**Solution**: Enable Voice Activity Detection (VAD)

```python
import whisper

model = whisper.load_model("medium")

# Use VAD to skip silent segments
result = model.transcribe(
    "audio.mp3",
    condition_on_previous_text=False,  # Disable context
    compression_ratio_threshold=2.4,   # Detect repetition
    logprob_threshold=-1.0,            # Confidence threshold
    no_speech_threshold=0.6            # Skip silence
)
```

---

## Next Steps

1. **Experiment with Different Models**: Try tiny/small for speed, medium/large for accuracy
2. **Fine-Tune on Your Data**: If domain-specific, collect 10-100 hours and fine-tune
3. **Optimize for Production**: Use Faster-Whisper or Hugging Face pipelines
4. **Add Post-Processing**: Punctuation, speaker diarization, summarization
5. **Monitor Performance**: Track WER on validation set, iterate

---

## Useful Resources

- **Whisper GitHub**: https://github.com/openai/whisper
- **Hugging Face Models**: https://huggingface.co/models?pipeline_tag=automatic-speech-recognition
- **NVIDIA NeMo**: https://github.com/NVIDIA/NeMo
- **Open ASR Leaderboard**: https://huggingface.co/spaces/hf-audio/open_asr_leaderboard

---

**Questions or Issues?**

Consult the comprehensive research document (OpenASR_Comprehensive_Research.md) for in-depth technical analysis and troubleshooting.
