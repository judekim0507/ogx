import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().max(200).optional(),
	author: z.string().max(50).optional(),
	authorImage: z.string().url().optional(),
	date: z.string().optional(),
	readTime: z.string().optional(),
	category: z.string().optional(),
	bgColor: z.string().default('#0f172a'),
	accentColor: z.string().default('#3b82f6')
});

export default defineTemplate({
	name: 'blog',
	description: 'Classic blog post with author and metadata',
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
				backgroundColor: props.bgColor,
				padding: 70,
				fontFamily: 'Inter'
			},
			children: [
				props.category
					? {
							type: 'div',
							props: {
								style: {
									display: 'flex',
									backgroundColor: props.accentColor,
									color: 'white',
									padding: '10px 20px',
									borderRadius: 8,
									fontSize: 16,
									fontWeight: 600,
									marginBottom: 28,
									alignSelf: 'flex-start'
								},
								children: props.category
							}
						}
					: null,
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flex: 1,
							fontSize: props.title.length > 60 ? 46 : 56,
							fontWeight: 700,
							color: 'white',
							lineHeight: 1.2,
							letterSpacing: -1
						},
						children: props.title
					}
				},
				props.description
					? {
							type: 'div',
							props: {
								style: {
									fontSize: 22,
									color: '#94a3b8',
									marginTop: 20,
									lineHeight: 1.5
								},
								children: props.description
							}
						}
					: null,
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							alignItems: 'center',
							marginTop: 32,
							gap: 16
						},
						children: [
							props.authorImage
								? {
										type: 'img',
										props: {
											src: props.authorImage,
											style: {
												width: 52,
												height: 52,
												borderRadius: 26,
												border: '2px solid rgba(255,255,255,0.2)'
											}
										}
									}
								: null,
							{
								type: 'div',
								props: {
									style: { display: 'flex', flexDirection: 'column', gap: 4 },
									children: [
										props.author
											? {
													type: 'div',
													props: {
														style: { fontSize: 18, fontWeight: 600, color: 'white' },
														children: props.author
													}
												}
											: null,
										{
											type: 'div',
											props: {
												style: { display: 'flex', fontSize: 15, color: '#64748b', gap: 8 },
												children: [props.date, props.date && props.readTime ? '·' : null, props.readTime].filter(
													Boolean
												)
											}
										}
									].filter(Boolean)
								}
							}
						].filter(Boolean)
					}
				}
			].filter(Boolean)
		}
	})
});
