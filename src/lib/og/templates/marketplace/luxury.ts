import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(60),
	subtitle: z.string().max(80).optional(),
	price: z.string().optional(),
	brand: z.string().optional()
});

export default defineTemplate({
	name: 'marketplace-luxury',
	description: 'Premium luxury product card',
	schema,
	defaultConfig: OG_DIMENSIONS,
	render: (props, config) => ({
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				width: config.width,
				height: config.height,
				backgroundColor: '#1c1917',
				fontFamily: 'Inter',
				position: 'relative'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							border: '1px solid rgba(212, 175, 55, 0.3)',
							margin: 30
						}
					}
				},
				props.brand
					? {
							type: 'div',
							props: {
								style: {
									fontSize: 14,
									fontWeight: 500,
									color: '#d4af37',
									letterSpacing: 6,
									textTransform: 'uppercase',
									marginBottom: 32
								},
								children: props.brand
							}
						}
					: null,
				{
					type: 'div',
					props: {
						style: {
							fontSize: props.title.length > 30 ? 48 : 60,
							fontWeight: 300,
							color: '#fafaf9',
							textAlign: 'center',
							lineHeight: 1.2,
							letterSpacing: 2
						},
						children: props.title
					}
				},
				props.subtitle
					? {
							type: 'div',
							props: {
								style: {
									fontSize: 20,
									color: '#a8a29e',
									marginTop: 20,
									fontWeight: 300,
									letterSpacing: 1
								},
								children: props.subtitle
							}
						}
					: null,
				props.price
					? {
							type: 'div',
							props: {
								style: {
									marginTop: 40,
									fontSize: 28,
									fontWeight: 400,
									color: '#d4af37'
								},
								children: props.price
							}
						}
					: null
			].filter(Boolean)
		}
	})
});
