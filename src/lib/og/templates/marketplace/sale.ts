import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(50),
	discount: z.string(),
	code: z.string().optional(),
	validUntil: z.string().optional(),
	bgColor: z.string().default('#dc2626')
});

export default defineTemplate({
	name: 'marketplace-sale',
	description: 'Bold sale/promotion card',
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
				backgroundColor: props.bgColor,
				fontFamily: 'Inter',
				position: 'relative'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							fontSize: 120,
							fontWeight: 800,
							color: 'white',
							lineHeight: 1,
							letterSpacing: -4
						},
						children: props.discount
					}
				},
				{
					type: 'div',
					props: {
						style: {
							fontSize: 32,
							fontWeight: 600,
							color: 'white',
							marginTop: 16,
							opacity: 0.9
						},
						children: props.title
					}
				},
				props.code
					? {
							type: 'div',
							props: {
								style: {
									marginTop: 40,
									padding: '16px 32px',
									backgroundColor: '#fef2f2',
									borderRadius: 8,
									fontSize: 20,
									fontWeight: 700,
									color: props.bgColor,
									letterSpacing: 3
								},
								children: `CODE: ${props.code}`
							}
						}
					: null,
				props.validUntil
					? {
							type: 'div',
							props: {
								style: {
									position: 'absolute',
									bottom: 40,
									fontSize: 16,
									color: 'white',
									opacity: 0.7
								},
								children: props.validUntil
							}
						}
					: null
			].filter(Boolean)
		}
	})
});
