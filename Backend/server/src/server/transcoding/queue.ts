import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
});

export const transcodeQueue = new Queue('anime-transcoding', { 
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: true,
  }
});

/**
 * Dispatches a transcoding job if one isn't already active
 */
export const dispatchTranscodeJob = async (episodeSourceId: string) => {
  await transcodeQueue.add(
    'process-hls',
    { episodeSourceId },
    { jobId: episodeSourceId } // IDempotency: prevents duplicate jobs for same source
  );
};