# Dieter Music AI Blueprint - Technical Specifications

## Executive Overview
Full-stack AI music generation platform: lyrics → song with real AI vocals

### User Flow
1. Type lyrics with song structure tags ([verse], [chorus], [bridge])
2. Select voice (male/female, various tones/styles)
3. Choose genre, mood, style tags
4. Click generate → AI creates full song with real vocals
5. Edit in built-in web DAW (waveform, mixer, stems, effects)
6. Export as WAV, MP3, FLAC, or stems ZIP

## System Architecture

### High-Level Pipeline
USER INPUT → API GW → LYRICS → AI ENGINE → VOICE → STEMS → BEATS → MIX → OUTPUT

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript |
| Web Audio | Tone.js + WaveSurfer.js |
| Backend API | Python FastAPI |
| Job Queue | Redis + Celery |
| Database | PostgreSQL |
| Storage | MinIO (S3-compatible) |
| AI Engine | ACE-Step 1.5 |
| Voice Conversion | RVC v2 |
| Source Separation | Demucs (Meta) |
| Beat Detection | Librosa + Madmom |
| Vocoder | HiFi-GAN / NSF-HiFiGAN |
| Containerization | Docker + docker-compose |
| GPU Runtime | NVIDIA CUDA |

## Core AI Models

### PRIMARY: ACE-Step 1.5 (Recommended)
- **Repository**: github.com/ace-step/ACE-Step-1.5
- **License**: MIT (full commercial use)
- **Quality**: Commercial-grade (Suno v4.5-v5 level)
- **Performance**: 
  - <2 seconds per full song on A100
  - <10 seconds on RTX 3090
  - <4GB VRAM (with quantization)
- **Features**:
  - 50+ languages, 1000+ instruments/styles
  - Built-in REST API server
  - LoRA training for custom voices (8 songs, 1 hour on 3090)
  - MIT license = full commercial use
- **Architecture**: Language Model (planner) + Diffusion Transformer (DiT)
  - LM plans song structure, metadata, lyrics alignment
  - DiT generates audio waveform from structured plan
- **Features Included**:
  - Text-to-music generation
  - Cover generation from reference audio
  - Repaint/edit (selective local audio editing)
  - Track separation into stems
  - Multi-track generation (add layers)
  - Vocal-to-BGM conversion
  - BPM, key/scale, time signature control
  - Quality scoring
  - LRC lyric timestamp generation
  - Gradio UI + REST API

### SECONDARY: SongGeneration/LeVo 2
- Backup option if ACE-Step unavailable
- Similar quality, different architecture

### Voice Conversion: RVC v2
- Apply custom voice models post-generation
- Male/female/various tones
- Few-shot cloning from 10s of audio
- Open-source, no per-song fees

### Source Separation: Demucs (Meta)
- Separate audio into 4 tracks:
  - Vocals
  - Drums
  - Bass
  - Other (instruments)

### Beat Detection: Librosa + Madmom
- BPM detection
- Beat timestamps
- Key/scale detection
- Beat grid for frontend overlay

## API Endpoints (FastAPI)

### Core Generation
- `POST /api/generate` - Trigger song generation
  - Input: lyrics, voice, genre, style, BPM, key, duration
  - Returns: job_id, estimated_time
- `GET /api/jobs/{job_id}` - Check generation status
  - Returns: status, progress%, audio_url (when ready)
- `GET /api/voices` - List available voices
- `POST /api/analyze/beats` - Analyze BPM, beats, key
- `POST /api/separate` - Separate audio into stems

### Storage
- Generated songs, stems, voice models stored in MinIO
- CDN-ready object storage

## Frontend DAW (React)

### Components
1. **Lyrics Editor** - Structure tags, metadata
2. **Voice Selector** - Grid of voice cards with previews
3. **Generation Trigger** - Progress bar, WebSocket updates
4. **Waveform View** (WaveSurfer.js)
   - Multi-track display (vocals, drums, bass, other)
   - Zoom, pan, time selection
5. **Mixer** (Tone.js)
   - Per-track volume, pan, mute/solo
   - Master volume
6. **Effects Rack**
   - Reverb, compression, EQ
   - Tone.js built-in effects
7. **Export Panel**
   - WAV, MP3, FLAC, stems ZIP
   - Quality selection

## Deployment

### Docker Setup
- FastAPI service (GPU container)
- Redis service
- Celery workers (multiple, GPU-enabled)
- PostgreSQL database
- MinIO storage

### GPU Requirements
- Minimum: RTX 3090 (24GB VRAM)
- Recommended: A100 (80GB VRAM)
- NVIDIA CUDA 12.x

## Key Advantages Over Competitors

1. **Full Ownership** - No vendor lock-in, self-hosted
2. **No API Limits** - Unlimited generations, no per-song fees
3. **Custom Voices** - Train on your data with LoRA
4. **Built-in DAW** - Full editing, stems, effects in browser
5. **Commercial License** - MIT = full commercial use
6. **Revenue Model** - Offer as SaaS to other creators

## Next Implementation Steps

1. Set up FastAPI backend with ACE-Step 1.5
2. Configure Redis + Celery for async processing
3. Integrate PostgreSQL database
4. Set up MinIO for audio storage
5. Wire frontend to backend APIs
6. Implement WaveSurfer.js waveform editor
7. Add Tone.js mixer and effects
8. Build export system (WAV, MP3, FLAC, stems)
9. Deploy with Docker
10. Set up GPU infrastructure
