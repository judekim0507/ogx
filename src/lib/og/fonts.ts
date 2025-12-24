import { readFile } from 'fs/promises';
import { join } from 'path';


export interface FontConfig {
	name: string;
	filename: string;
	weight: 400 | 500 | 600 | 700;
	style: 'normal' | 'italic';
}


export const DEFAULT_FONTS: FontConfig[] = [
	{ name: 'Inter', filename: 'Inter-Regular.ttf', weight: 400, style: 'normal' },
	{ name: 'Inter', filename: 'Inter-SemiBold.ttf', weight: 600, style: 'normal' },
	{ name: 'Inter', filename: 'Inter-Bold.ttf', weight: 700, style: 'normal' }
];


let fontCache: Map<string, ArrayBuffer> | null = null;


const FONTS_DIR = join(process.cwd(), 'static', 'fonts');

/**
 * Load font file from static directory
 */
async function loadFontFile(filename: string): Promise<ArrayBuffer> {
	const filePath = join(FONTS_DIR, filename);
	const buffer = await readFile(filePath);
	return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

/**
 * Load all default fonts (cached in memory)
 */
export async function loadFonts(): Promise<ArrayBuffer[]> {
	if (!fontCache) {
		fontCache = new Map();

		for (const font of DEFAULT_FONTS) {
			const data = await loadFontFile(font.filename);
			fontCache.set(font.filename, data);
		}
	}

	return DEFAULT_FONTS.map((f) => fontCache!.get(f.filename)!);
}

/**
 * Get font configuration for Satori
 */
export async function getFontConfig(): Promise<
	Array<{
		name: string;
		data: ArrayBuffer;
		weight: number;
		style: string;
	}>
> {
	const fontData = await loadFonts();

	return DEFAULT_FONTS.map((font, index) => ({
		name: font.name,
		data: fontData[index],
		weight: font.weight,
		style: font.style
	}));
}
