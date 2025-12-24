import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(80),
	section: z.string().optional(),
	version: z.string().optional(),
	logo: z.string().url().optional(),
	accentColor: z.string().default('#6366f1')
});

export default defineTemplate({
	name: 'dev-docs',
	description: 'Documentation page card',
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
				fontFamily: 'Inter'
			},
			children: [
				{
					type: 'div',
					props: {
						style: { height: 4, backgroundColor: props.accentColor }
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
												style: { display: 'flex', alignItems: 'center', gap: 16 },
												children: [
													props.logo
														? {
																type: 'img',
																props: {
																	src: props.logo,
																	style: { width: 40, height: 40, borderRadius: 8 }
																}
															}
														: null,
													props.section
														? {
																type: 'div',
																props: {
																	style: {
																		fontSize: 14,
																		fontWeight: 500,
																		color: props.accentColor,
																		backgroundColor: `${props.accentColor}10`,
																		padding: '8px 16px',
																		borderRadius: 6
																	},
																	children: props.section
																}
															}
														: null
												].filter(Boolean)
											}
										},
										props.version
											? {
													type: 'div',
													props: {
														style: {
															fontSize: 14,
															color: '#71717a',
															backgroundColor: '#f4f4f5',
															padding: '8px 16px',
															borderRadius: 6,
															fontFamily: 'monospace'
														},
														children: props.version
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
													fontSize: props.title.length > 40 ? 48 : 60,
													fontWeight: 700,
													color: '#18181b',
													lineHeight: 1.2,
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
										alignItems: 'center',
										gap: 8,
										marginTop: 'auto'
									},
									children: [
										{
											type: 'div',
											props: {
												style: { fontSize: 16, color: '#71717a' },
												children: 'Documentation'
											}
										}
									]
								}
							}
						]
					}
				}
			]
		}
	})
});
