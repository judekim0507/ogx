import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(80),
	subtitle: z.string().max(120).optional(),
	logo: z.string().url().optional(),
	leftColor: z.string().default('#18181b'),
	rightColor: z.string().default('#f4f4f5'),
	accentColor: z.string().default('#6366f1')
});

export default defineTemplate({
	name: 'generic-split',
	description: 'Modern split layout with contrast',
	schema,
	defaultConfig: OG_DIMENSIONS,
	render: (props, config) => ({
		type: 'div',
		props: {
			style: {
				display: 'flex',
				width: config.width,
				height: config.height,
				fontFamily: 'Inter'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							width: '60%',
							height: '100%',
							backgroundColor: props.leftColor,
							padding: 80
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontSize: props.title.length > 40 ? 44 : 54,
										fontWeight: 700,
										color: '#ffffff',
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
												fontSize: 22,
												color: 'rgba(255,255,255,0.7)',
												marginTop: 20,
												lineHeight: 1.5
											},
											children: props.subtitle
										}
									}
								: null
						].filter(Boolean)
					}
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							width: '40%',
							height: '100%',
							backgroundColor: props.rightColor
						},
						children: [
							props.logo
								? {
										type: 'img',
										props: {
											src: props.logo,
											style: { width: 120, height: 120, borderRadius: 24 }
										}
									}
								: {
										type: 'div',
										props: {
											style: {
												width: 80,
												height: 80,
												borderRadius: 20,
												backgroundColor: props.accentColor
											}
										}
									}
						]
					}
				}
			]
		}
	})
});
