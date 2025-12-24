import { createHash } from 'crypto';
import { mkdir, readFile, writeFile, readdir, stat, rm } from 'fs/promises';
import { join } from 'path';


const CACHE_DIR = process.env.OGX_CACHE_DIR || '.cache/og-images';


let cacheReady: Promise<void> | null = null;

async function ensureCacheDir(): Promise<void> {
	if (!cacheReady) {
		cacheReady = mkdir(CACHE_DIR, { recursive: true }).then(() => undefined);
	}
	await cacheReady;
}

/**
 * Generate a deterministic cache key from template name and parameters
 * Uses SHA-256 for collision resistance
 */
export function generateCacheKey(template: string, params: Record<string, string>): string {
	
	const sortedParams = Object.keys(params)
		.sort()
		.map((key) => `${key}=${params[key]}`)
		.join('&');

	const input = `${template}:${sortedParams}`;
	const hash = createHash('sha256').update(input).digest('hex');

	
	return hash.substring(0, 16);
}

/**
 * Get cached image if it exists
 */
export async function getCachedImage(cacheKey: string): Promise<Buffer | null> {
	try {
		await ensureCacheDir();
		const filePath = join(CACHE_DIR, `${cacheKey}.png`);
		return await readFile(filePath);
	} catch {
		
		return null;
	}
}

/**
 * Store image in cache
 */
export async function cacheImage(cacheKey: string, data: Buffer): Promise<void> {
	await ensureCacheDir();
	const filePath = join(CACHE_DIR, `${cacheKey}.png`);
	await writeFile(filePath, data);
}

/**
 * Clear entire cache (for maintenance)
 */
export async function clearCache(): Promise<void> {
	try {
		await rm(CACHE_DIR, { recursive: true, force: true });
		cacheReady = null;
	} catch {
		
	}
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
	files: number;
	totalSize: number;
}> {
	try {
		await ensureCacheDir();
		const files = await readdir(CACHE_DIR);
		let totalSize = 0;

		for (const file of files) {
			const fileStat = await stat(join(CACHE_DIR, file));
			totalSize += fileStat.size;
		}

		return { files: files.length, totalSize };
	} catch {
		return { files: 0, totalSize: 0 };
	}
}
