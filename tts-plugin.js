import fs from 'fs';
import path from 'path';
import os from 'os';
import https from 'https';
import { spawn } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';
import multer from 'multer';

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

export function ttsVitePlugin() {
  return {
    name: 'tts-api-plugin',
    configureServer(server) {
      // 1. Google TTS endpoint
      server.middlewares.use('/api/tts', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const { text, lang = 'hi' } = JSON.parse(body || '{}');
              if (!text) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Text is required' }));
              }
              const fullAudio = await getFullTtsAudio(text, lang);
              res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': fullAudio.length,
                'Cache-Control': 'no-cache'
              });
              res.end(fullAudio);
            } catch (err) {
              console.error('TTS error:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end('Method Not Allowed');
        }
      });

      // 2. ULTRA-ACCURATE MULTI-PART COMBINER: Merges pure video MP4 + audio buffer into standard MP4
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

      function runFfmpegMerge(videoPath, audioPath, outputPath, res, cleanupPaths) {
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
            res.writeHead(200, {
              'Content-Type': 'video/mp4',
              'Content-Length': finalData.length
            });
            res.end(finalData);
          } else {
            console.error('FFmpeg merge failed with code:', code, 'stderr:', stderr);
            // Fallback: If merge fails, return the video file directly so user still gets their video!
            if (fs.existsSync(videoPath)) {
              const rawVideo = fs.readFileSync(videoPath);
              res.writeHead(200, {
                'Content-Type': 'video/mp4',
                'Content-Length': rawVideo.length
              });
              res.end(rawVideo);
            } else {
              res.writeHead(500);
              res.end('Merge failed: ' + stderr);
            }
          }
          for (const p of cleanupPaths) {
            fs.rm(p, { recursive: true, force: true }, () => {});
          }
        });

        proc.on('error', (e) => {
          console.error('FFmpeg spawn error:', e);
          if (fs.existsSync(videoPath)) {
            const rawVideo = fs.readFileSync(videoPath);
            res.writeHead(200, {
              'Content-Type': 'video/mp4',
              'Content-Length': rawVideo.length
            });
            res.end(rawVideo);
          } else {
            res.writeHead(500);
            res.end(e.message);
          }
          for (const p of cleanupPaths) {
            fs.rm(p, { recursive: true, force: true }, () => {});
          }
        });
      }

      server.middlewares.use('/api/merge-video-audio', (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405);
          return res.end('Method Not Allowed');
        }

        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('multipart/form-data')) {
          mergeUpload(req, res, (err) => {
            if (err) {
              console.error('Multer upload error:', err);
              res.writeHead(500);
              return res.end('Upload error: ' + err.message);
            }

            const videoFile = req.files && req.files['video'] ? req.files['video'][0] : null;
            const audioFile = req.files && req.files['audio'] ? req.files['audio'][0] : null;

            if (!videoFile || !audioFile) {
              res.writeHead(400);
              return res.end('Both video and audio files are required');
            }

            const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'quiz_merge_'));
            const outputPath = path.join(tempDir, 'final.mp4');

            runFfmpegMerge(videoFile.path, audioFile.path, outputPath, res, [videoFile.path, audioFile.path, tempDir]);
          });
        } else {
          // Fallback for raw binary stream (4 bytes videoLen + videoData + audioData)
          const chunks = [];
          req.on('data', c => chunks.push(c));
          req.on('end', () => {
            try {
              const fullBuffer = Buffer.concat(chunks);
              const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'quiz_merge_'));
              const videoPath = path.join(tempDir, 'video.mp4');
              const audioPath = path.join(tempDir, 'audio.wav');
              const outputPath = path.join(tempDir, 'final.mp4');

              const videoLen = fullBuffer.readUInt32BE(0);
              const videoData = fullBuffer.subarray(4, 4 + videoLen);
              const audioData = fullBuffer.subarray(4 + videoLen);

              fs.writeFileSync(videoPath, videoData);
              fs.writeFileSync(audioPath, audioData);

              runFfmpegMerge(videoPath, audioPath, outputPath, res, [tempDir]);
            } catch (err) {
              console.error('Binary merge error:', err);
              res.writeHead(500);
              res.end(err.message);
            }
          });
        }
      });
    }
  };
}
