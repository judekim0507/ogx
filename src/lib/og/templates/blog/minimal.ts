import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(100),
	author: z.string().max(50).optional(),
	date: z.string().optional(),
	siteName: z.string().optional(),
	accentColor: z.string().default('#18181b')
});

export default defineTemplate({
	name: 'blog-minimal',
	description: 'Clean minimal blog card',
	schema,
	defaultConfig: OG_DIMENSIONS,
	render: (props, config) => ({
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				width: config.width,
				height: config.height,
				backgroundColor: '#ffffff',
				padding: 80,
				fontFamily: 'Inter'
			},
			children: [
				props.siteName
					? {
							type: 'div',
							props: {
								style: {
									fontSize: 16,
									fontWeight: 600,
									color: props.accentColor,
									letterSpacing: 1,
									textTransform: 'uppercase',
									marginBottom: 40
								},
								children: props.siteName
							}
						}
					: null,
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flex: 1,
							alignItems: 'center'
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontSize: props.title.length > 50 ? 44 : 56,
										fontWeight: 600,
										color: '#18181b',
										lineHeight: 1.25,
										letterSpacing: -1
									},
									children: props.title
								}
							}
						]
					}
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							gap: 20,
							alignItems: 'center',
							marginTop: 'auto'
						},
						children: [
							{
								type: 'div',
								props: {
									style: { width: 40, height: 2, backgroundColor: props.accentColor }
								}
							},
							{
								type: 'div',
								props: {
									style: { display: 'flex', gap: 12, fontSize: 16, color: '#71717a' },
									children: [props.author, props.author && props.date ? '·' : null, props.date].filter(Boolean)
								}
							}
						]
					}
				}
			].filter(Boolean)
		}
	})
});
