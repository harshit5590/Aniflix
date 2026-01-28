import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { getHlsBasePath } from '../storage/layout';

const router = express.Router();
const STREAM_SECRET = process.env.STREAM_SIGNING_SECRET || 'aniflix-hls-secure-key';

interface StreamTokenPayload {
  userId: string;
  episodeId: string;
  exp: number;
}

/**
 * HELPER: Generates a signed URL for the player
 * Valid for 10 minutes to prevent long-term link sharing
 */
export const signStreamUrl = (userId: string, episodeId: string, animeId: string, language: string): string => {
  const token = jwt.sign(
    { userId, episodeId },
    STREAM_SECRET,
    { expiresIn: '10m' }
  );
  return `/api/stream/secure/${animeId}/${episodeId}/${language}/master.m3u8?token=${token}`;
};

/**
 * MIDDLEWARE: Verifies the token on every manifest and segment request
 */
const verifyStreamToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.query.token as string;

  if (!token) return res.status(403).send("Streaming token missing");

  try {
    const decoded = jwt.verify(token, STREAM_SECRET) as StreamTokenPayload;
    
    // Bind token to the specific episode in the URL to prevent "Token Borrowing"
    if (decoded.episodeId !== req.params.episodeId) {
      return res.status(403).send("Token mismatch for this episode");
    }

    next();
  } catch (err) {
    return res.status(401).send("Streaming token expired or invalid");
  }
};

/**
 * GET /api/stream/secure/:animeId/:episodeId/:language/:filename
 * Serves Master Manifests, Variant Manifests, and TS Segments
 */
router.get('/:animeId/:episodeId/:language/:filename', verifyStreamToken, (req: Request, res: Response) => {
  const { animeId, episodeId, language, filename } = req.params;
  const token = req.query.token as string;

  const basePath = getHlsBasePath(animeId, episodeId, language);
  
  // Handle requests for variant manifests (e.g., v720/index.m3u8) or segments
  // Path can be 'master.m3u8' or 'v720/index.m3u8' or 'v720/segment_001.ts'
  const filePath = path.join(basePath, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Asset not found");
  }

  // Set correct Content-Type for HLS
  const ext = path.extname(filename);
  if (ext === '.m3u8') {
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    
    // REWRITE LOGIC: Ensure relative links inside .m3u8 include the token
    // This allows the player to fetch segments automatically with the same security
    let content = fs.readFileSync(filePath, 'utf8');
    const signedContent = content.replace(/(\.m3u8|\.ts)/g, `$1?token=${token}`);
    return res.send(signedContent);
  } 
  
  if (ext === '.ts') {
    res.setHeader('Content-Type', 'video/MP2T');
  }

  // Stream the file directly
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

export default router;