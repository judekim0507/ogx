import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(100),
	subtitle: z.string().max(150).optional(),
	author: z.string().max(50).optional(),
	authorImage: z.string().url().optional(),
	edition: z.string().optional(),
	accentColor: z.string().default('#f97316')
});

export default defineTemplate({
	name: 'blog-newsletter',
	description: 'Newsletter/Substack style',
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
				backgroundColor: '#fffbeb',
				fontFamily: 'Inter'
			},
			children: [
				{
					type: 'div',
					props: {
						style: { height: 6, backgroundColor: props.accentColor }
					}
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							flex: 1,
							padding: 70
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginBottom: 40
									},
									children: [
										{
											type: 'div',
											props: {
												style: { display: 'flex', alignItems: 'center', gap: 12 },
												children: [
													props.authorImage
														? {
																type: 'img',
																props: {
																	src: props.authorImage,
																	style: { width: 44, height: 44, borderRadius: 22 }
																}
															}
														: null,
													props.author
														? {
																type: 'div',
																props: {
																	style: { fontSize: 16, fontWeight: 600, color: '#78350f' },
																	children: props.author
																}
															}
														: null
												].filter(Boolean)
											}
										},
										props.edition
											? {
													type: 'div',
													props: {
														style: {
															fontSize: 14,
															color: '#92400e',
															backgroundColor: '#fef3c7',
															padding: '8px 16px',
															borderRadius: 6
														},
														children: props.edition
													}
												}
											: null
									].filter(Boolean)
								}
							},
							{
								type: 'div',
								props: {
									style: { display: 'flex', flex: 1, alignItems: 'center' },
									children: [
										{
											type: 'div',
											props: {
												style: {
													fontSize: props.title.length > 50 ? 44 : 54,
													fontWeight: 700,
													color: '#78350f',
													lineHeight: 1.2,
													letterSpacing: -1
												},
												children: props.title
											}
										}
									]
								}
							},
							props.subtitle
								? {
										type: 'div',
										props: {
											style: { fontSize: 20, color: '#92400e', marginTop: 'auto' },
											children: props.subtitle
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
