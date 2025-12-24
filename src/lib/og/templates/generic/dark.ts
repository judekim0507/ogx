import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(100),
	subtitle: z.string().max(150).optional(),
	logo: z.string().url().optional(),
	accentColor: z.string().default('#22d3ee')
});

export default defineTemplate({
	name: 'generic-dark',
	description: 'Sleek dark theme with glow effects',
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
				backgroundColor: '#09090b',
				padding: 80,
				fontFamily: 'Inter',
				position: 'relative'
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: 500,
							height: 500,
							background: `radial-gradient(circle, ${props.accentColor}15 0%, transparent 70%)`,
							borderRadius: '50%'
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
							color: '#fafafa',
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
									fontSize: 24,
									color: '#a1a1aa',
									marginTop: 20,
									textAlign: 'center'
								},
								children: props.subtitle
							}
						}
					: null,
				{
					type: 'div',
					props: {
						style: {
							position: 'absolute',
							bottom: 0,
							left: '50%',
							transform: 'translateX(-50%)',
							width: 200,
							height: 4,
							backgroundColor: props.accentColor,
							borderRadius: 2
						}
					}
				}
			].filter(Boolean)
		}
	})
});
