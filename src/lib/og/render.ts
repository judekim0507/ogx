import satori, { type FontWeight, type FontStyle } from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { Template, TemplateConfig, SatoriElement } from './templates/types';
import { getFontConfig } from './fonts';

// Cached fonts promise (loaded once)
let fontsPromise: ReturnType<typeof getFontConfig> | null = null;

async function getFonts() {
	if (!fontsPromise) {
		fontsPromise = getFontConfig();
	}
	return fontsPromise;
}

/**
 * Render an OG image from a template and props
 */
export async function renderOgImage<T>(
	template: Template,
	props: T,
	configOverrides?: Partial<TemplateConfig>
): Promise<Buffer> {
	const config = { ...template.defaultConfig, ...configOverrides };

	// 1. Generate Satori-compatible markup
	const element = template.render(props, config) as SatoriElement;

	// 2. Load fonts
	const fonts = await getFonts();

	// 3. Render to SVG with Satori
	const svg = await satori(element, {
		width: config.width,
		height: config.height,
		fonts: fonts.map((f) => ({
			...f,
			weight: f.weight as FontWeight,
			style: f.style as FontStyle
		}))
	});

	// 4. Convert SVG to PNG with resvg
	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: config.width
		}
	});

	const pngData = resvg.render();
	const pngBuffer = pngData.asPng();

	return Buffer.from(pngBuffer);
}
