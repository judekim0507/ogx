import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

export const schema = z.object({
	title: z.string().min(1).max(60),
	method: z.string().optional(),
	endpoint: z.string().optional(),
	description: z.string().max(100).optional()
});

export default defineTemplate({
	name: 'dev-api',
	description: 'API endpoint documentation',
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
				backgroundColor: '#1e1e1e',
				padding: 70,
				fontFamily: 'Inter'
			},
			children: [
				props.method || props.endpoint
					? {
							type: 'div',
							props: {
								style: {
									display: 'flex',
									alignItems: 'center',
									gap: 16,
									marginBottom: 40,
									padding: '16px 24px',
									backgroundColor: '#2d2d2d',
									borderRadius: 12,
									border: '1px solid #404040'
								},
								children: [
									props.method
										? {
												type: 'div',
												props: {
													style: {
														fontSize: 14,
														fontWeight: 700,
														color:
															props.method === 'GET'
																? '#22c55e'
																: props.method === 'POST'
																	? '#3b82f6'
																	: props.method === 'PUT'
																		? '#f59e0b'
																		: props.method === 'DELETE'
																			? '#ef4444'
																			: '#a78bfa',
														fontFamily: 'monospace'
													},
													children: props.method
												}
											}
										: null,
									props.endpoint
										? {
												type: 'div',
												props: {
													style: {
														fontSize: 18,
														color: '#d4d4d4',
														fontFamily: 'monospace'
													},
													children: props.endpoint
												}
											}
										: null
								].filter(Boolean)
							}
						}
					: null,
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
										fontSize: props.title.length > 35 ? 48 : 60,
										fontWeight: 700,
										color: '#e5e5e5',
										lineHeight: 1.2,
										letterSpacing: -1
									},
									children: props.title
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
									fontSize: 20,
									color: '#a3a3a3',
									marginTop: 24
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
							gap: 8,
							marginTop: 32
						},
						children: [
							{
								type: 'div',
								props: {
									style: { fontSize: 14, color: '#737373' },
									children: 'API Reference'
								}
							}
						]
					}
				}
			].filter(Boolean)
		}
	})
});
