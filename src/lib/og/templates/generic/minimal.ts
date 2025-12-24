import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(80),
	subtitle: z.string().max(100).optional(),
	accentColor: z.string().default('#000000')
});

export default defineTemplate({
	name: 'generic-minimal',
	description: 'Ultra minimal with focus on typography',
	schema,
	defaultConfig: OG_DIMENSIONS,
	render: (props, config) => ({
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				width: config.width,
				height: config.height,
				backgroundColor: '#fafafa',
				padding: 100,
				fontFamily: 'Inter'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							width: 60,
							height: 4,
							backgroundColor: props.accentColor,
							marginBottom: 40
						}
					}
				},
				{
					type: 'div',
					props: {
						style: {
							fontSize: props.title.length > 40 ? 48 : 60,
							fontWeight: 600,
							color: '#18181b',
							lineHeight: 1.2,
							letterSpacing: -1
						},
						children: props.title
					}
				},
				props.subtitle
					? {
							type: 'div',
							props: {
								style: {
									fontSize: 24,
									color: '#71717a',
									marginTop: 24,
									fontWeight: 400
								},
								children: props.subtitle
							}
						}
					: null
			].filter(Boolean)
		}
	})
});
