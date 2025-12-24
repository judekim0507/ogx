import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	name: z.string().min(1).max(50),
	tagline: z.string().max(100).optional(),
	logo: z.string().url().optional(),
	license: z.string().optional(),
	accentColor: z.string().default('#f97316')
});

export default defineTemplate({
	name: 'dev-opensource',
	description: 'Open source project showcase',
	schema,
	defaultConfig: OG_DIMENSIONS,
	render: (props, config) => ({
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				width: config.width,
				height: config.height,
				backgroundImage: 'linear-gradient(135deg, #0c0a09 0%, #1c1917 100%)',
				fontFamily: 'Inter',
				position: 'relative'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							top: 40,
							right: 60,
							fontSize: 14,
							color: props.accentColor,
							backgroundColor: `${props.accentColor}15`,
							padding: '10px 20px',
							borderRadius: 8,
							fontWeight: 600
						},
						children: 'Open Source'
					}
				},
				props.logo
					? {
							type: 'img',
							props: {
								src: props.logo,
								style: { width: 100, height: 100, marginBottom: 32, borderRadius: 24 }
							}
						}
					: null,
				{
					type: 'div',
					props: {
						style: {
							fontSize: props.name.length > 20 ? 60 : 80,
							fontWeight: 800,
							color: '#fafaf9',
							textAlign: 'center',
							lineHeight: 1,
							letterSpacing: -3
						},
						children: props.name
					}
				},
				props.tagline
					? {
							type: 'div',
							props: {
								style: {
									fontSize: 24,
									color: '#a8a29e',
									marginTop: 24,
									textAlign: 'center',
									maxWidth: 700
								},
								children: props.tagline
							}
						}
					: null,
				props.license
					? {
							type: 'div',
							props: {
								style: {
									marginTop: 40,
									padding: '10px 24px',
									backgroundColor: '#292524',
									borderRadius: 8,
									fontSize: 14,
									color: '#78716c',
									fontFamily: 'monospace'
								},
								children: props.license
							}
						}
					: null
			].filter(Boolean)
		}
	})
});
