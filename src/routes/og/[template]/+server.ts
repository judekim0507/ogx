import type { RequestHandler } from './$types';
import { renderOgImage } from '$lib/og/render';
import { getTemplate } from '$lib/og/templates';
import { getCachedImage, cacheImage, generateCacheKey } from '$lib/og/cache';

export const GET: RequestHandler = async ({ params, url }) => {
	const templateName = params.template;

	// 1. Validate template exists
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

	// 2. Parse query params
	const searchParams = Object.fromEntries(url.searchParams);
	const isPreview = searchParams.preview === 'true';
	
	// Remove preview param so it doesn't affect validation/caching
	delete searchParams.preview;

	// 3. Validate props against schema
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

	// 4. Generate cache key from template + params
	const cacheKey = generateCacheKey(templateName, searchParams);

	// 5. Check cache (skip for preview mode)
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

	// 6. Render image
	try {
		const png = await renderOgImage(template, propsResult.data);

		// 7. Cache result (non-blocking, skip for preview mode)
		if (!isPreview) {
			cacheImage(cacheKey, png).catch(console.error);
		}

		// 8. Return response
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
