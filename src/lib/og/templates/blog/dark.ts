import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().max(180).optional(),
	author: z.string().max(50).optional(),
	category: z.string().optional(),
	accentColor: z.string().default('#a78bfa')
});

export default defineTemplate({
	name: 'blog-dark',
	description: 'Dark mode blog with accent glow',
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
				backgroundColor: '#0a0a0a',
				padding: 70,
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
							right: 0,
							width: 400,
							height: 400,
							background: `radial-gradient(circle at top right, ${props.accentColor}20 0%, transparent 60%)`,
							borderRadius: '50%'
						}
					}
				},
				props.category
					? {
							type: 'div',
							props: {
								style: {
									display: 'flex',
									marginBottom: 32
								},
								children: [
									{
										type: 'div',
										props: {
											style: {
												fontSize: 14,
												fontWeight: 500,
												color: props.accentColor,
												backgroundColor: `${props.accentColor}15`,
												padding: '8px 16px',
												borderRadius: 6
											},
											children: props.category
										}
									}
								]
							}
						}
					: null,
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flex: 1
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontSize: props.title.length > 55 ? 44 : 54,
										fontWeight: 700,
										color: '#fafafa',
										lineHeight: 1.2,
										letterSpacing: -1
									},
									children: props.title
								}
							}
						]
					}
				},
				props.description
					? {
							type: 'div',
							props: {
								style: {
									fontSize: 20,
									color: '#a1a1aa',
									marginTop: 24,
									lineHeight: 1.5
								},
								children: props.description
							}
						}
					: null,
				props.author
					? {
							type: 'div',
							props: {
								style: {
									display: 'flex',
									alignItems: 'center',
									gap: 12,
									marginTop: 32
								},
								children: [
									{
										type: 'div',
										props: {
											style: {
												width: 32,
												height: 32,
												borderRadius: 16,
												backgroundColor: props.accentColor
											}
										}
									},
									{
										type: 'div',
										props: {
											style: { fontSize: 16, color: '#d4d4d8' },
											children: props.author
										}
									}
								]
							}
						}
					: null
			].filter(Boolean)
		}
	})
});
