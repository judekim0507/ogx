import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(80),
	price: z.string().optional(),
	originalPrice: z.string().optional(),
	image: z.string().url().optional(),
	rating: z.string().optional(),
	reviews: z.string().optional(),
	badge: z.string().optional(),
	seller: z.string().optional(),
	accentColor: z.string().default('#10b981')
});

export default defineTemplate({
	name: 'marketplace',
	description: 'Classic product listing card',
	schema,
	defaultConfig: OG_DIMENSIONS,
	render: (props, config) => ({
		type: 'div',
		props: {
			style: {
				display: 'flex',
				width: config.width,
				height: config.height,
				backgroundColor: '#ffffff',
				fontFamily: 'Inter'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							width: '50%',
							height: '100%',
							backgroundColor: '#f8fafc',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'relative'
						},
						children: [
							props.badge
								? {
										type: 'div',
										props: {
											style: {
												position: 'absolute',
												top: 28,
												left: 28,
												backgroundColor: props.accentColor,
												color: 'white',
												padding: '10px 18px',
												borderRadius: 6,
												fontSize: 14,
												fontWeight: 700,
												textTransform: 'uppercase',
												letterSpacing: 1
											},
											children: props.badge
										}
									}
								: null,
							props.image
								? {
										type: 'img',
										props: {
											src: props.image,
											style: { maxWidth: '75%', maxHeight: '75%', objectFit: 'contain' }
										}
									}
								: {
										type: 'div',
										props: {
											style: {
												width: 180,
												height: 180,
												backgroundColor: '#e2e8f0',
												borderRadius: 20,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												color: '#94a3b8',
												fontSize: 64
											},
											children: '📦'
										}
									}
						].filter(Boolean)
					}
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							width: '50%',
							padding: 60,
							justifyContent: 'center'
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontSize: props.title.length > 40 ? 34 : 42,
										fontWeight: 700,
										color: '#18181b',
										lineHeight: 1.2,
										marginBottom: 20
									},
									children: props.title
								}
							},
							props.rating || props.reviews
								? {
										type: 'div',
										props: {
											style: { display: 'flex', alignItems: 'center', marginBottom: 24, gap: 10 },
											children: [
												props.rating
													? {
															type: 'div',
															props: {
																style: {
																	backgroundColor: '#fef3c7',
																	padding: '8px 14px',
																	borderRadius: 6,
																	fontSize: 16,
																	fontWeight: 600,
																	color: '#d97706'
																},
																children: `★ ${props.rating}`
															}
														}
													: null,
												props.reviews
													? {
															type: 'div',
															props: {
																style: { fontSize: 16, color: '#71717a' },
																children: props.reviews
															}
														}
													: null
											].filter(Boolean)
										}
									}
								: null,
							props.price
								? {
										type: 'div',
										props: {
											style: { display: 'flex', alignItems: 'baseline', gap: 14 },
											children: [
												{
													type: 'div',
													props: {
														style: { fontSize: 44, fontWeight: 700, color: props.accentColor },
														children: props.price
													}
												},
												props.originalPrice
													? {
															type: 'div',
															props: {
																style: { fontSize: 24, color: '#a1a1aa', textDecoration: 'line-through' },
																children: props.originalPrice
															}
														}
													: null
											].filter(Boolean)
										}
									}
								: null,
							props.seller
								? {
										type: 'div',
										props: {
											style: { fontSize: 16, color: '#71717a', marginTop: 24 },
											children: `Sold by ${props.seller}`
										}
									}
								: null
						].filter(Boolean)
					}
				}
			]
		}
	})
});
