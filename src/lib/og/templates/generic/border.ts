import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(80),
	subtitle: z.string().max(120).optional(),
	borderColor: z.string().default('#18181b'),
	bgColor: z.string().default('#ffffff'),
	textColor: z.string().default('#18181b')
});

export default defineTemplate({
	name: 'generic-border',
	description: 'Bold border frame with classic typography',
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
				padding: 40,
				fontFamily: 'Inter'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
							height: '100%',
							border: `4px solid ${props.borderColor}`,
							padding: 60
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontSize: props.title.length > 35 ? 48 : 60,
										fontWeight: 700,
										color: props.textColor,
										textAlign: 'center',
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
												color: props.textColor,
												opacity: 0.6,
												marginTop: 24,
												textAlign: 'center',
												fontWeight: 400
											},
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
