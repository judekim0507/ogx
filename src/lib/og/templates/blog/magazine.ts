import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(80),
	subtitle: z.string().max(150).optional(),
	category: z.string().optional(),
	issue: z.string().optional(),
	bgColor: z.string().default('#fef3c7'),
	textColor: z.string().default('#78350f')
});

export default defineTemplate({
	name: 'blog-magazine',
	description: 'Editorial magazine cover style',
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
				padding: 80,
				fontFamily: 'Inter'
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
							props.category
								? {
										type: 'div',
										props: {
											style: {
												fontSize: 14,
												fontWeight: 600,
												color: props.textColor,
												letterSpacing: 3,
												textTransform: 'uppercase'
											},
											children: props.category
										}
									}
								: null,
							props.issue
								? {
										type: 'div',
										props: {
											style: { fontSize: 14, color: props.textColor, opacity: 0.6 },
											children: props.issue
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
							flex: 1,
							alignItems: 'center'
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										fontSize: props.title.length > 40 ? 52 : 68,
										fontWeight: 700,
										color: props.textColor,
										lineHeight: 1.1,
										letterSpacing: -2
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
								style: {
									fontSize: 22,
									color: props.textColor,
									opacity: 0.7,
									marginTop: 'auto',
									fontStyle: 'italic'
								},
								children: props.subtitle
							}
						}
					: null
			].filter(Boolean)
		}
	})
});
