import satori, { type FontWeight, type FontStyle } from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { Template, TemplateConfig, SatoriElement } from './templates/types';
import { getFontConfig } from './fonts';


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

	
	const element = template.render(props, config) as SatoriElement;

	
	const fonts = await getFonts();

	
	const svg = await satori(element, {
		width: config.width,
		height: config.height,
		fonts: fonts.map((f) => ({
			...f,
			weight: f.weight as FontWeight,
			style: f.style as FontStyle
		}))
	});

	
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
