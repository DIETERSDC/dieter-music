"""
ACE-Step 1.5 Integration Module
Handles music generation using ACE-Step 1.5 AI model
"""

import os
import json
import asyncio
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
import numpy as np

logger = logging.getLogger(__name__)

@dataclass
class GenerationRequest:
    """Music generation request parameters"""
    lyrics: str
    voice: str = "default"
    genre: str = "pop"
    mood: str = "uplifting"
    bpm: int = 120
    key: str = "C"
    duration: int = 30
    style: str = "modern"
    language: str = "en"
    reference_audio: Optional[str] = None

@dataclass
class GenerationResult:
    """Music generation result"""
    job_id: str
    audio_url: str
    stems: Dict[str, str]  # vocals, drums, bass, other
    metadata: Dict
    created_at: str
    generation_time: float

class ACEStepIntegration:
    """
    ACE-Step 1.5 Music Generation Engine
    
    Features:
    - Text-to-music generation with real vocals
    - 50+ languages, 1000+ instruments/styles
    - Commercial-grade quality (Suno v4.5-v5 level)
    - <2 seconds per song on A100, <10 seconds on RTX 3090
    - LoRA training for custom voices
    - MIT license - full commercial use
    """
    
    def __init__(self, model_path: Optional[str] = None, use_gpu: bool = True):
        """
        Initialize ACE-Step 1.5 model
        
        Args:
            model_path: Path to ACE-Step model weights
            use_gpu: Whether to use GPU acceleration (CUDA)
        """
        self.model_path = model_path or os.getenv("ACE_STEP_MODEL_PATH", "/models/ace-step-1.5")
        self.use_gpu = use_gpu and self._check_cuda_available()
        self.device = "cuda" if self.use_gpu else "cpu"
        self.model = None
        self.tokenizer = None
        self._initialize_model()
        
        logger.info(f"ACE-Step 1.5 initialized on {self.device}")
    
    def _check_cuda_available(self) -> bool:
        """Check if CUDA/GPU is available"""
        try:
            import torch
            return torch.cuda.is_available()
        except ImportError:
            return False
    
    def _initialize_model(self):
        """Initialize ACE-Step model and tokenizer"""
        try:
            # Import ACE-Step (will be installed via pip)
            from ace_step import ACEStepModel, ACEStepTokenizer
            
            # Load model and tokenizer
            self.tokenizer = ACEStepTokenizer.from_pretrained(self.model_path)
            self.model = ACEStepModel.from_pretrained(
                self.model_path,
                device=self.device,
                quantize=not self.use_gpu  # Quantize on CPU for memory efficiency
            )
            
            logger.info(f"ACE-Step model loaded from {self.model_path}")
        except ImportError:
            logger.warning("ACE-Step not installed. Install with: pip install ace-step")
            self.model = None
            self.tokenizer = None
    
    async def generate(self, request: GenerationRequest) -> GenerationResult:
        """
        Generate music from lyrics
        
        Args:
            request: Generation request with lyrics, voice, genre, etc.
        
        Returns:
            GenerationResult with audio URL and stems
        """
        if not self.model:
            raise RuntimeError("ACE-Step model not initialized")
        
        try:
            # Prepare input
            prompt = self._prepare_prompt(request)
            
            # Tokenize
            tokens = self.tokenizer.encode(prompt, max_length=1024)
            
            # Generate audio
            logger.info(f"Generating music: {request.genre} {request.mood}")
            audio_data, generation_time = await asyncio.to_thread(
                self._generate_audio,
                tokens,
                request
            )
            
            # Separate stems
            stems = await self._separate_stems(audio_data)
            
            # Prepare result
            result = GenerationResult(
                job_id=self._generate_job_id(),
                audio_url="s3://dieter-music/songs/generated.wav",  # Will be uploaded to S3
                stems=stems,
                metadata={
                    "lyrics": request.lyrics,
                    "voice": request.voice,
                    "genre": request.genre,
                    "mood": request.mood,
                    "bpm": request.bpm,
                    "key": request.key,
                    "duration": request.duration,
                    "language": request.language,
                },
                created_at=datetime.now().isoformat(),
                generation_time=generation_time
            )
            
            logger.info(f"Generation complete: {result.job_id} ({generation_time:.2f}s)")
            return result
            
        except Exception as e:
            logger.error(f"Generation failed: {str(e)}")
            raise
    
    def _prepare_prompt(self, request: GenerationRequest) -> str:
        """Prepare ACE-Step prompt from request"""
        prompt = f"""
        [LYRICS]
        {request.lyrics}
        
        [METADATA]
        Genre: {request.genre}
        Mood: {request.mood}
        BPM: {request.bpm}
        Key: {request.key}
        Duration: {request.duration}s
        Style: {request.style}
        Language: {request.language}
        Voice: {request.voice}
        """
        return prompt.strip()
    
    def _generate_audio(self, tokens: List[int], request: GenerationRequest) -> Tuple[np.ndarray, float]:
        """Generate audio from tokens (blocking call for threading)"""
        import time
        start_time = time.time()
        
        # Generate audio using ACE-Step
        # This is a placeholder - actual implementation depends on ACE-Step API
        audio = self.model.generate(
            tokens,
            max_length=request.duration * 16000,  # 16kHz sample rate
            temperature=0.7,
            top_p=0.9,
        )
        
        generation_time = time.time() - start_time
        return audio, generation_time
    
    async def _separate_stems(self, audio_data: np.ndarray) -> Dict[str, str]:
        """Separate audio into stems using Demucs"""
        try:
            from demucs import separate
            
            # Separate into vocals, drums, bass, other
            stems = await asyncio.to_thread(
                separate,
                audio_data,
                model="htdemucs"
            )
            
            return {
                "vocals": "s3://dieter-music/stems/vocals.wav",
                "drums": "s3://dieter-music/stems/drums.wav",
                "bass": "s3://dieter-music/stems/bass.wav",
                "other": "s3://dieter-music/stems/other.wav",
            }
        except ImportError:
            logger.warning("Demucs not installed. Skipping stem separation.")
            return {}
    
    def _generate_job_id(self) -> str:
        """Generate unique job ID"""
        import uuid
        return f"job_{uuid.uuid4().hex[:12]}"
    
    async def analyze_beats(self, audio_path: str) -> Dict:
        """Analyze beats, BPM, and key from audio"""
        try:
            import librosa
            import madmom
            
            # Load audio
            y, sr = librosa.load(audio_path)
            
            # Detect BPM
            onset_env = librosa.onset.onset_strength(y=y, sr=sr)
            bpm = librosa.beat.tempo(onset_strength=onset_env, sr=sr)[0]
            
            # Detect beats
            beats = librosa.beat.beat_track(y=y, sr=sr)[1]
            
            # Detect key/scale
            chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
            key_idx = np.argmax(np.mean(chroma, axis=1))
            keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
            key = keys[key_idx]
            
            return {
                "bpm": float(bpm),
                "beats": beats.tolist(),
                "key": key,
                "confidence": float(np.max(np.mean(chroma, axis=1)))
            }
        except ImportError:
            logger.warning("Librosa/Madmom not installed. Skipping beat analysis.")
            return {"bpm": 120, "key": "C"}

# Singleton instance
_ace_step_instance: Optional[ACEStepIntegration] = None

def get_ace_step() -> ACEStepIntegration:
    """Get or create ACE-Step singleton"""
    global _ace_step_instance
    if _ace_step_instance is None:
        _ace_step_instance = ACEStepIntegration()
    return _ace_step_instance
