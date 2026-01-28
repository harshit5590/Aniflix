import axios from 'axios';

export enum ProviderType {
  TERABOX = 'TERABOX',
  GDRIVE = 'GDRIVE',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Aniflix core logic: Identifies the cloud provider from a URL
 */
export const detectProvider = (url: string): ProviderType => {
  const lowUrl = url.toLowerCase();
  if (lowUrl.includes('terabox.com') || lowUrl.includes('nephobox.com') || lowUrl.includes('teraboxapp')) {
    return ProviderType.TERABOX;
  }
  if (lowUrl.includes('drive.google.com')) {
    return ProviderType.GDRIVE;
  }
  return ProviderType.UNKNOWN;
};

/**
 * Resolves cloud links to a raw streamable resource internally
 */
export const resolveProviderSource = async (sourceUrl: string) => {
  const provider = detectProvider(sourceUrl);
  
  if (provider === ProviderType.UNKNOWN) {
    throw new Error("UNSUPPORTED_PROVIDER_LINK");
  }

  try {
    // 3 Second Timeout as per Core Truths
    const response = await axios.head(sourceUrl, { 
      timeout: 3000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } 
    });

    return {
      provider,
      resolvedUrl: sourceUrl, // Base link for proxying
      contentLength: response.headers['content-length'],
      mimeType: response.headers['content-type'],
      supportsRange: response.headers['accept-ranges'] === 'bytes'
    };
  } catch (error) {
    // Temporary errors (network) vs Fatal errors (404/Deleted)
    console.error(`Resolution Failed for ${sourceUrl}`);
    throw new Error("LINK_RESOLUTION_FAILED");
  }
};