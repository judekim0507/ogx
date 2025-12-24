import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(60),
	price: z.string(),
	category: z.string().optional(),
	brand: z.string().optional()
});

export default defineTemplate({
	name: 'marketplace-minimal',
	description: 'Clean minimal product card',
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
				backgroundColor: '#ffffff',
				padding: 80,
				fontFamily: 'Inter'
			},
			children: [
				props.category
					? {
							type: 'div',
							props: {
								style: {
									fontSize: 14,
									fontWeight: 500,
									color: '#a1a1aa',
									letterSpacing: 2,
									textTransform: 'uppercase',
									marginBottom: 20
								},
								children: props.category
							}
						}
					: null,
				{
					type: 'div',
					props: {
						style: {
							fontSize: props.title.length > 30 ? 48 : 60,
							fontWeight: 600,
							color: '#18181b',
							lineHeight: 1.15,
							letterSpacing: -1,
							marginBottom: 32
						},
						children: props.title
					}
				},
				{
					type: 'div',
					props: {
						style: { display: 'flex', alignItems: 'center', gap: 20 },
						children: [
							{
								type: 'div',
								props: {
									style: { fontSize: 36, fontWeight: 700, color: '#18181b' },
									children: props.price
								}
							},
							props.brand
								? {
										type: 'div',
										props: {
											style: {
												fontSize: 16,
												color: '#71717a',
												paddingLeft: 20,
												borderLeft: '2px solid #e4e4e7'
											},
											children: props.brand
										}
									}
								: null
						].filter(Boolean)
					}
				}
			].filter(Boolean)
		}
	})
});
