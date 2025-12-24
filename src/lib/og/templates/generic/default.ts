import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(100),
	subtitle: z.string().max(150).optional(),
	logo: z.string().url().optional(),
	bgColor: z.string().default('#0f172a'),
	accentColor: z.string().default('#6366f1'),
	textColor: z.string().default('#ffffff')
});

export default defineTemplate({
	name: 'generic',
	description: 'Clean centered title with accent bar',
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
				padding: 80,
				fontFamily: 'Inter'
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
							height: 6,
							backgroundColor: props.accentColor
						}
					}
				},
				props.logo
					? {
							type: 'img',
							props: {
								src: props.logo,
								style: { width: 64, height: 64, marginBottom: 32, borderRadius: 12 }
							}
						}
					: null,
				{
					type: 'div',
					props: {
						style: {
							fontSize: props.title.length > 40 ? 52 : 68,
							fontWeight: 700,
							color: props.textColor,
							textAlign: 'center',
							lineHeight: 1.15,
							letterSpacing: -2
						},
						children: props.title
					}
				},
				props.subtitle
					? {
							type: 'div',
							props: {
								style: {
									fontSize: 26,
									color: props.textColor,
									opacity: 0.6,
									marginTop: 20,
									textAlign: 'center'
								},
								children: props.subtitle
							}
						}
					: null
			].filter(Boolean)
		}
	})
});
