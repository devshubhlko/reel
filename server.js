import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import https from 'https';
import { spawn } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

function splitText(text, maxLength = 150) {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = '';
  for (const word of words) {
    if ((currentChunk + ' ' + word).trim().length <= maxLength) {
      currentChunk += (currentChunk ? ' ' : '') + word;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = word;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

function fetchGoogleTtsChunk(chunk, lang = 'hi') {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(chunk.trim());
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encoded}&ttsspeed=1`;

    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`TTS failed with status: ${res.statusCode}`));
      const data = [];
      res.on('data', c => data.push(c));
      res.on('end', () => resolve(Buffer.concat(data)));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('TTS timeout'));
    });
  });
}

async function getFullTtsAudio(text, lang = 'hi') {
  const chunks = splitText(text, 150);
  const audioBuffers = [];
  for (const chunk of chunks) {
    if (!chunk.trim()) continue;
    const buf = await fetchGoogleTtsChunk(chunk, lang);
    audioBuffers.push(buf);
  }
  return Buffer.concat(audioBuffers);
}

const uploadDir = path.join(os.tmpdir(), 'quiz_uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 300 * 1024 * 1024 }
});

const mergeUpload = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]);

app.use(express.json());

// 1. Google TTS endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, lang = 'hi' } = req.body || {};
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const fullAudio = await getFullTtsAudio(text, lang);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', fullAudio.length);
    res.setHeader('Cache-Control', 'no-cache');
    res.send(fullAudio);
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: err.message });
  }
});

function runServerFfmpegMerge(videoPath, audioPath, outputPath, res, cleanupPaths) {
  let ffmpegBin = ffmpegStatic || 'ffmpeg';
  try {
    if (ffmpegBin && fs.existsSync(ffmpegBin)) {
      fs.chmodSync(ffmpegBin, 0o755);
    }
  } catch (e) {
    console.warn('chmod ffmpeg warning:', e);
  }

  const args = [
    '-y',
    '-i', videoPath,
    '-i', audioPath,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
    outputPath
  ];

  const proc = spawn(ffmpegBin, args);
  let stderr = '';
  proc.stderr.on('data', d => stderr += d.toString());

  proc.on('close', (code) => {
    if (code === 0 && fs.existsSync(outputPath)) {
      const finalData = fs.readFileSync(outputPath);
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Length', finalData.length);
      res.send(finalData);
    } else {
      console.error('FFmpeg process closed with code:', code, 'stderr:', stderr);
      // Fallback: If ffmpeg merge fails, send the raw video so user gets their video anyway!
      if (fs.existsSync(videoPath)) {
        const rawVideo = fs.readFileSync(videoPath);
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Length', rawVideo.length);
        res.send(rawVideo);
      } else {
        res.status(500).send(`Merge failed: ${stderr || code}`);
      }
    }
    for (const p of cleanupPaths) {
      fs.rm(p, { recursive: true, force: true }, () => {});
    }
  });

  proc.on('error', (e) => {
    console.error('Merge spawn error:', e);
    if (fs.existsSync(videoPath)) {
      const rawVideo = fs.readFileSync(videoPath);
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Length', rawVideo.length);
      res.send(rawVideo);
    } else {
      res.status(500).send(e.message);
    }
    for (const p of cleanupPaths) {
      fs.rm(p, { recursive: true, force: true }, () => {});
    }
  });
}

// 2. Audio-Video Lossless Fast Merger (Supports standard FormData & Raw Stream)
app.post('/api/merge-video-audio', mergeUpload, (req, res) => {
  const videoFile = req.files && req.files['video'] ? req.files['video'][0] : null;
  const audioFile = req.files && req.files['audio'] ? req.files['audio'][0] : null;

  if (videoFile && audioFile) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'quiz_merge_'));
    const outputPath = path.join(tempDir, 'final.mp4');
    runServerFfmpegMerge(videoFile.path, audioFile.path, outputPath, res, [videoFile.path, audioFile.path, tempDir]);
  } else {
    // Fallback for raw binary stream
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try {
        const fullBuffer = Buffer.concat(chunks);
        if (fullBuffer.length < 8) {
          return res.status(400).send('Both video and audio files are required');
        }
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'quiz_merge_'));
        const videoPath = path.join(tempDir, 'video.mp4');
        const audioPath = path.join(tempDir, 'audio.wav');
        const outputPath = path.join(tempDir, 'final.mp4');

        const videoLen = fullBuffer.readUInt32BE(0);
        const videoData = fullBuffer.subarray(4, 4 + videoLen);
        const audioData = fullBuffer.subarray(4 + videoLen);

        fs.writeFileSync(videoPath, videoData);
        fs.writeFileSync(audioPath, audioData);

        runServerFfmpegMerge(videoPath, audioPath, outputPath, res, [tempDir]);
      } catch (err) {
        console.error('Binary merge error:', err);
        res.status(500).send(err.message);
      }
    });
  }
});

// Serve frontend static build
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Quiz Studio production server running on port ${PORT}`);
});
