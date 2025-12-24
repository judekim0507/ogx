import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	name: z.string().min(1).max(60),
	description: z.string().max(150).optional(),
	owner: z.string().optional(),
	stars: z.string().optional(),
	language: z.string().optional(),
	languageColor: z.string().default('#3178c6')
});

export default defineTemplate({
	name: 'dev-github',
	description: 'GitHub repository style card',
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
				backgroundColor: '#0d1117',
				padding: 70,
				fontFamily: 'Inter'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							marginBottom: 32
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										width: 32,
										height: 32,
										borderRadius: 16,
										backgroundColor: '#30363d',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: '#8b949e',
										fontSize: 18
									},
									children: '📁'
								}
							},
							props.owner
								? {
										type: 'div',
										props: {
											style: { fontSize: 18, color: '#8b949e' },
											children: `${props.owner} /`
										}
									}
								: null,
							{
								type: 'div',
								props: {
									style: { fontSize: 18, color: '#58a6ff', fontWeight: 600 },
									children: props.name
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
							flex: 1,
							alignItems: 'center'
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontSize: props.name.length > 25 ? 52 : 64,
										fontWeight: 700,
										color: '#e6edf3',
										lineHeight: 1.15,
										letterSpacing: -2
									},
									children: props.name
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
									fontSize: 22,
									color: '#8b949e',
									lineHeight: 1.5,
									marginTop: 20
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
							gap: 24,
							marginTop: 40
						},
						children: [
							props.language
								? {
										type: 'div',
										props: {
											style: { display: 'flex', alignItems: 'center', gap: 8 },
											children: [
												{
													type: 'div',
													props: {
														style: {
															width: 14,
															height: 14,
															borderRadius: 7,
															backgroundColor: props.languageColor
														}
													}
												},
												{
													type: 'div',
													props: {
														style: { fontSize: 16, color: '#8b949e' },
														children: props.language
													}
												}
											]
										}
									}
								: null,
							props.stars
								? {
										type: 'div',
										props: {
											style: { display: 'flex', alignItems: 'center', gap: 6 },
											children: [
												{
													type: 'div',
													props: {
														style: { fontSize: 16, color: '#8b949e' },
														children: '★'
													}
												},
												{
													type: 'div',
													props: {
														style: { fontSize: 16, color: '#8b949e' },
														children: props.stars
													}
												}
											]
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
