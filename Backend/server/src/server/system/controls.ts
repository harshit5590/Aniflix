import prisma from '../../lib/prisma';

export type SystemFlag = 
  | 'TRANSCODING_ENABLED' 
  | 'MP4_PROXY_ENABLED' 
  | 'MAINTENANCE_MODE';

// Cache results for 10 seconds to keep the site fast
const cache: Record<string, { value: boolean; expiry: number }> = {};

/**
 * The core function used by workers and routes to check system status
 */
export const getSystemFlag = async (key: SystemFlag): Promise<boolean> => {
  const now = Date.now();

  // 1. Check if we have a fresh value in cache
  if (cache[key] && cache[key].expiry > now) {
    return cache[key].value;
  }

  // 2. Otherwise, fetch from MongoDB
  const flag = await prisma.systemControl.findUnique({
    where: { key }
  });

  // Default to 'true' for features, 'false' for maintenance
  const val = flag ? flag.value : (key !== 'MAINTENANCE_MODE');

  // 3. Update cache
  cache[key] = { value: val, expiry: now + 10000 };
  
  return val;
};

/**
 * Admin function to toggle a flag
 */
export const setSystemFlag = async (key: SystemFlag, value: boolean) => {
  const updated = await prisma.systemControl.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });

  // Clear cache so change takes effect faster
  delete cache[key];
  
  return updated;
};