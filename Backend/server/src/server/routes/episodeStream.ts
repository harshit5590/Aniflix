import express from 'express';
import prisma from '../../lib/prisma';
import { dispatchTranscodeJob } from '../transcoding/queue';


const router = express.Router();

/**
 * GET /api/episode/:id/stream
 * The unified endpoint for the video player
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const streams = sources.map(source => {
        // If HLS is not ready, trigger transcoding in background
        if (source.status === "PENDING") {
            dispatchTranscodeJob(source.id).catch(console.error);
        }

        // Return logic (READY ? HLS : MP4 Proxy)
        if (source.status === "READY") {
            return { type: "hls", lang: source.language, url: `/api/stream/secure/${source.id}.m3u8` };
        }

        return { type: "mp4", lang: source.language, url: `http://127.0.0.1:5000/api/stream/mp4/${source.id}` };
    });

    try {
        // 1. Find all available sources (SUB/DUB)
        const sources = await prisma.episodeSource.findMany({
            where: { episodeId: id },
            include: { assets: true }
        });

        if (sources.length === 0) {
            return res.status(404).json({ message: "No stream sources available" });
        }



        // 2. Map sources to the Player Contract
        const streams = sources.map(source => {
            // If HLS is READY, return HLS path
            if (source.status === "READY" && source.assets.length > 0) {
                return {
                    type: "hls",
                    lang: source.language,
                    url: `/api/stream/secure/${source.id}.m3u8` // We will build this next
                };
            }

            // Else, return the MP4 Proxy URL (Cold Start)
            return {
                type: "mp4",
                lang: source.language,
                url: `http://127.0.0.1:5000/api/stream/mp4/${source.id}`
            };
        });

        // 3. Return to Player
        res.json({
            episodeId: id,
            streams
        });

        // 4. Background: If status is PENDING, trigger Transcoding Queue
        // (This part will be handled by BullMQ in the next prompt)

    } catch (error) {
        res.status(500).json({ message: "Error resolving stream" });
    }
});

export default router;