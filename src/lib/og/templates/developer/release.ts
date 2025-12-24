import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	name: z.string().min(1).max(50),
	version: z.string(),
	tagline: z.string().max(100).optional(),
	date: z.string().optional(),
	accentColor: z.string().default('#10b981')
});

export default defineTemplate({
	name: 'dev-release',
	description: 'Software release announcement',
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
							width: 600,
							height: 600,
							background: `radial-gradient(circle, ${props.accentColor}10 0%, transparent 60%)`,
							borderRadius: '50%'
						}
					}
				},
				{
					type: 'div',
					props: {
						style: {
							fontSize: 16,
							fontWeight: 600,
							color: props.accentColor,
							letterSpacing: 3,
							textTransform: 'uppercase',
							marginBottom: 24
						},
						children: 'NEW RELEASE'
					}
				},
				{
					type: 'div',
					props: {
						style: {
							fontSize: props.name.length > 20 ? 56 : 72,
							fontWeight: 700,
							color: '#fafafa',
							textAlign: 'center',
							lineHeight: 1.1,
							letterSpacing: -2
						},
						children: props.name
					}
				},
				{
					type: 'div',
					props: {
						style: {
							marginTop: 24,
							padding: '14px 32px',
							backgroundColor: props.accentColor,
							borderRadius: 12,
							fontSize: 28,
							fontWeight: 700,
							color: 'white',
							fontFamily: 'monospace'
						},
						children: props.version
					}
				},
				props.tagline
					? {
							type: 'div',
							props: {
								style: {
									fontSize: 22,
									color: '#a1a1aa',
									marginTop: 32,
									textAlign: 'center'
								},
								children: props.tagline
							}
						}
					: null,
				props.date
					? {
							type: 'div',
							props: {
								style: {
									position: 'absolute',
									bottom: 40,
									fontSize: 14,
									color: '#52525b'
								},
								children: props.date
							}
						}
					: null
			].filter(Boolean)
		}
	})
});
