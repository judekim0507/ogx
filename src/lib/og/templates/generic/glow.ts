import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';
import { deriveColors, applyColorOverrides } from '../../colors';

export const schema = z.object({
	title: z.string().min(1).max(100),
	subtitle: z.string().max(100).optional(),
	siteName: z.string().max(50).optional(),
	
	themeColor: z.string().default('#5C0909'),
	
	bgColor: z.string().optional(),
	textColor: z.string().optional(),
	glowColor: z.string().optional()
});


function createGlowOrb(x: number, y: number, width: number, height: number, glowColor: string) {
	return {
		type: 'div',
		props: {
			style: {
				position: 'absolute',
				left: x,
				top: y,
				width,
				height,
				borderRadius: 144,
				background: `radial-gradient(ellipse at center, ${glowColor}40 0%, ${glowColor}20 30%, transparent 70%)`,
				filter: 'blur(20px)'
			}
		}
	};
}

export default defineTemplate({
	name: 'generic-glow',
	description: 'Bold startup style with glowing orbs',
	schema,
	defaultConfig: OG_DIMENSIONS,
	render: (props, config) => {
		
		const colors = applyColorOverrides(props.themeColor, {
			bgColor: props.bgColor,
			textColor: props.textColor,
			glowColor: props.glowColor
		});

		return {
			type: 'div',
			props: {
				style: {
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					width: config.width,
					height: config.height,
					backgroundColor: colors.bgColor,
					fontFamily: 'Inter',
					position: 'relative',
					overflow: 'hidden'
				},
				children: [
					
					createGlowOrb(-200, 50, 600, 520, colors.glowColor),
					createGlowOrb(800, -50, 500, 450, colors.glowColor),
					createGlowOrb(600, 400, 700, 600, colors.glowColor),
					createGlowOrb(-100, 350, 550, 500, colors.glowColor),
					createGlowOrb(900, 300, 450, 400, colors.glowColor),

					
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								top: 99,
								left: '50%',
								transform: 'translateX(-50%)',
								width: 155,
								height: 6,
								backgroundColor: colors.textColor,
								borderRadius: 3
							}
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
								textAlign: 'center',
								zIndex: 10,
								padding: 40
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											fontSize: props.title.length > 30 ? 64 : 80,
											fontWeight: 600,
											color: colors.textColor,
											lineHeight: 1.1,
											textAlign: 'center',
											maxWidth: 900
										},
										children: props.title
									}
								},
								props.subtitle ? {
									type: 'div',
									props: {
										style: {
											fontSize: 32,
											fontWeight: 500,
											color: colors.textMuted,
											marginTop: 24,
											textAlign: 'center'
										},
										children: props.subtitle
									}
								} : null
							].filter(Boolean)
						}
					},

					
					props.siteName ? {
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								bottom: 80,
								fontSize: 28,
								fontWeight: 600,
								color: colors.textColor,
								textAlign: 'center'
							},
							children: props.siteName
						}
					} : null
				].filter(Boolean)
			}
		};
	}
});
