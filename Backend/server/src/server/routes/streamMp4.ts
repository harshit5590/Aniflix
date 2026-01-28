import express, { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../../lib/prisma';
import { resolveProviderSource } from '../providers';
import { getSystemFlag } from '../system/controls';


const router = express.Router();

/**
 * GET /stream/mp4/:episodeSourceId
 * Tunnels the cloud video stream to the client
 */
router.get('/:episodeSourceId', async (req: Request, res: Response) => {
    const { episodeSourceId } = req.params;

    const isEnabled = await getSystemFlag('MP4_PROXY_ENABLED');
    if (!isEnabled) {
        return res.status(503).send("Streaming is temporarily disabled for maintenance.");
    }
    try {
        // 1. Fetch source from DB
        const source = await prisma.episodeSource.findUnique({
            where: { id: episodeSourceId }
        });

        if (!source) return res.status(404).send("Source not found");

        // 2. Resolve the provider link to a direct stream URL
        // This is the "Cold Start" - it happens on first play
        const resolved = await resolveProviderSource(source.sourceUrl);

        // 3. Handle Range Requests (For seeking in the video player)
        const range = req.headers.range;
        const axiosConfig: any = {
            method: 'get',
            url: resolved.resolvedUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                Range: range // Forward the range request from the browser
            }
        };

        const streamResponse = await axios(axiosConfig);

        // 4. Set Proxy Headers
        res.status(range ? 206 : 200);
        res.set({
            'Content-Range': streamResponse.headers['content-range'],
            'Accept-Ranges': 'bytes',
            'Content-Length': streamResponse.headers['content-length'],
            'Content-Type': streamResponse.headers['content-type'] || 'video/mp4',
        });

        // 5. Pipe the data directly (No buffering in memory)
        streamResponse.data.pipe(res);

        // Handle client disconnects
        req.on('close', () => {
            streamResponse.data.destroy();
        });

    } catch (error) {
        console.error("Streaming Proxy Error:", error);
        res.status(500).send("Stream unavailable");
    }
});

export default router;