import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import prisma from '../../lib/prisma';
import { processHLS } from './ffmpeg';
import { getSystemFlag } from '../system/controls';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
});

// DECLARE THE WORKER ONLY ONCE
const transcodingWorker = new Worker(
  'anime-transcoding',
  async (job: Job) => {
    const { episodeSourceId } = job.data;

    // 1. EMERGENCY CHECK: Is transcoding globally paused?
    const isPaused = await getSystemFlag('TRANSCODING_ENABLED');
    if (!isPaused) {
      console.log("⏸️ Transcoding is globally paused. Moving job back to queue.");
      throw new Error("PAUSED_BY_ADMIN");
    }

    // 2. Mark as Processing
    await prisma.episodeSource.update({
      where: { id: episodeSourceId },
      data: { status: 'PROCESSING' }
    });

    try {
      // 3. Start HLS conversion
      const source = await prisma.episodeSource.findUnique({ where: { id: episodeSourceId } });
      if (!source) throw new Error("Source not found");

      await processHLS(source.id, source.sourceUrl);

      // 4. Mark as Ready
      await prisma.episodeSource.update({
        where: { id: episodeSourceId },
        data: { status: 'READY', lastError: null }
      });

      console.log(`✅ SUCCESS: ${episodeSourceId}`);
    } catch (error: any) {
      console.error(`❌ FAILED: ${episodeSourceId}`, error.message);
      
      await prisma.episodeSource.update({
        where: { id: episodeSourceId },
        data: { status: 'DEAD', lastError: error.message }
      });
      
      throw error;
    }
  },
  { connection, concurrency: 2 }
);

// ERROR LOGGING
transcodingWorker.on('failed', (job, err) => {
  console.log(`⚠️ Job ${job?.id} failed: ${err.message}`);
});

export default transcodingWorker;