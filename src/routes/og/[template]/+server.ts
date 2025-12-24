import type { RequestHandler } from './$types';
import { renderOgImage } from '$lib/og/render';
import { getTemplate } from '$lib/og/templates';
import { getCachedImage, cacheImage, generateCacheKey } from '$lib/og/cache';

export const GET: RequestHandler = async ({ params, url }) => {
	const templateName = params.template;

	
	const template = getTemplate(templateName);
	if (!template) {
		return new Response(
			JSON.stringify({
				error: 'Template not found',
				available: ['generic', 'blog', 'marketplace']
			}),
			{
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	
	const searchParams = Object.fromEntries(url.searchParams);
	const isPreview = searchParams.preview === 'true';
	
	
	delete searchParams.preview;

	
	const propsResult = template.schema.safeParse(searchParams);
	if (!propsResult.success) {
		return new Response(
			JSON.stringify({
				error: 'Invalid parameters',
				details: propsResult.error.flatten()
			}),
			{
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	
	const cacheKey = generateCacheKey(templateName, searchParams);

	
	if (!isPreview) {
		const cached = await getCachedImage(cacheKey);
		if (cached) {
			return new Response(new Uint8Array(cached), {
				headers: {
					'Content-Type': 'image/png',
					'Cache-Control': 'public, max-age=31536000, immutable',
					'X-Cache': 'HIT'
				}
			});
		}
	}

	
	try {
		const png = await renderOgImage(template, propsResult.data);

		
		if (!isPreview) {
			cacheImage(cacheKey, png).catch(console.error);
		}

		
		return new Response(new Uint8Array(png), {
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': isPreview ? 'no-store' : 'public, max-age=31536000, immutable',
				'X-Cache': isPreview ? 'PREVIEW' : 'MISS'
			}
		});
	} catch (error) {
		console.error('Error rendering OG image:', error);
		return new Response(
			JSON.stringify({
				error: 'Failed to render image',
				message: error instanceof Error ? error.message : 'Unknown error'
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
