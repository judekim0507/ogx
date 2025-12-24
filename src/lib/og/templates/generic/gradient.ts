import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(100),
	subtitle: z.string().max(150).optional(),
	logo: z.string().url().optional(),
	gradientFrom: z.string().default('#6366f1'),
	gradientTo: z.string().default('#a855f7'),
	textColor: z.string().default('#ffffff')
});

export default defineTemplate({
	name: 'generic-gradient',
	description: 'Bold gradient background with centered text',
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
				backgroundImage: `linear-gradient(135deg, ${props.gradientFrom} 0%, ${props.gradientTo} 100%)`,
				padding: 80,
				fontFamily: 'Inter'
			},
			children: [
				props.logo
					? {
							type: 'img',
							props: {
								src: props.logo,
								style: {
									width: 72,
									height: 72,
									marginBottom: 32,
									borderRadius: 16,
									border: '3px solid rgba(255,255,255,0.3)'
								}
							}
						}
					: null,
				{
					type: 'div',
					props: {
						style: {
							fontSize: props.title.length > 35 ? 56 : 72,
							fontWeight: 700,
							color: props.textColor,
							textAlign: 'center',
							lineHeight: 1.1,
							letterSpacing: -2
						},
						children: props.title
					}
				},
				props.subtitle
					? {
							type: 'div',
							props: {
								style: {
									fontSize: 28,
									color: props.textColor,
									opacity: 0.9,
									marginTop: 24,
									textAlign: 'center',
									fontWeight: 500
								},
								children: props.subtitle
							}
						}
					: null
			].filter(Boolean)
		}
	})
});
