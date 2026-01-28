import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export const processHLS = async (sourceId: string, inputUrl: string): Promise<void> => {
  const outputDir = path.join(__dirname, `../../../public/streams/${sourceId}`);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    ffmpeg(inputUrl)
      .inputOptions(['-re'])
      .outputOptions([
        '-filter_complex', 
        '[0:v]split=4[v1,v2,v3,v4];[v1]scale=w=1920:h=1080[v1out];[v2]scale=w=1280:h=720[v2out];[v3]scale=w=854:h=480[v3out];[v4]scale=w=640:h=360[v4out]',
        
        '-map [v1out]', '-c:v:0 libx264', '-b:v:0 5000k', '-maxrate:v:0 5350k', '-bufsize:v:0 7500k',
        '-map [v2out]', '-c:v:1 libx264', '-b:v:1 2800k', '-maxrate:v:1 2996k', '-bufsize:v:1 4200k',
        '-map [v3out]', '-c:v:2 libx264', '-b:v:2 1400k', '-maxrate:v:2 1498k', '-bufsize:v:2 2100k',
        '-map [v4out]', '-c:v:3 libx264', '-b:v:3 800k', '-maxrate:v:3 856k', '-bufsize:v:3 1200k',
        
        '-map a:0', '-c:a aac', '-b:a:0 192k', '-ac 2',
        '-map a:0', '-c:a aac', '-b:a:1 128k', '-ac 2',
        '-map a:0', '-c:a aac', '-b:a:2 128k', '-ac 2',
        '-map a:0', '-c:a aac', '-b:a:3 96k', '-ac 2',

        '-f hls',
        '-hls_time 10',
        '-hls_playlist_type event',
        '-hls_flags independent_segments',
        '-hls_segment_filename', path.join(outputDir, 'v%v/segment_%03d.ts'),
        '-master_pl_name master.m3u8',
        '-var_stream_map', 'v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3'
      ])
      .output(path.join(outputDir, 'v%v/index.m3u8'))
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });
};