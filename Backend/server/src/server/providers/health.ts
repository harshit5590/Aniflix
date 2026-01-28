import prisma from '../../lib/prisma';
import { Provider } from '@prisma/client';

export const PROVIDER_THRESHOLDS = {
  DEGRADED: 0.85, // 85% success rate
  DOWN: 0.50,     // 50% success rate
};

/**
 * Log a health check event
 */
export const recordProviderHealth = async (
  provider: Provider, 
  status: 'OK' | 'ERROR', 
  responseTime: number, 
  error?: string
) => {
  await prisma.providerHealthLog.create({
    data: {
      provider,
      status: status === 'OK' ? 'OK' : 'DOWN',
      responseTime,
      errorMessage: error || null,
    },
  });
};

/**
 * Analyze recent logs to determine provider status
 */
export const getProviderStatus = async (provider: Provider) => {
  const window = new Date(Date.now() - 60 * 60 * 1000); // Last 1 hour
  
  const logs = await prisma.providerHealthLog.findMany({
    where: { provider, createdAt: { gte: window } },
  });

  if (logs.length === 0) return 'OK';

  const successCount = logs.filter(l => l.status === 'OK').length;
  const successRate = successCount / logs.length;

  if (successRate < PROVIDER_THRESHOLDS.DOWN) return 'DOWN';
  if (successRate < PROVIDER_THRESHOLDS.DEGRADED) return 'DEGRADED';
  return 'OK';
};  