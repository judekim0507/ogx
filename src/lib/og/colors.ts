/**
 * Smart color utility for deriving harmonious colors from a single theme color.
 */

export interface HSL {
	h: number; // 0-360
	s: number; // 0-100
	l: number; // 0-100
}

export interface DerivedColors {
	bgColor: string;
	textColor: string;
	textMuted: string;
	accentColor: string;
	glowColor: string;
}

/**
 * Convert hex color to HSL
 */
export function hexToHsl(hex: string): HSL {
	// Remove # if present
	hex = hex.replace(/^#/, '');

	// Parse hex
	const r = parseInt(hex.slice(0, 2), 16) / 255;
	const g = parseInt(hex.slice(2, 4), 16) / 255;
	const b = parseInt(hex.slice(4, 6), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
				break;
			case g:
				h = ((b - r) / d + 2) / 6;
				break;
			case b:
				h = ((r - g) / d + 4) / 6;
				break;
		}
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100)
	};
}

/**
 * Convert HSL to hex color
 */
export function hslToHex(hsl: HSL): string {
	const h = hsl.h / 360;
	const s = hsl.s / 100;
	const l = hsl.l / 100;

	let r, g, b;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	const toHex = (x: number) => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Get relative luminance for contrast calculations
 */
export function getLuminance(hex: string): number {
	hex = hex.replace(/^#/, '');
	const r = parseInt(hex.slice(0, 2), 16) / 255;
	const g = parseInt(hex.slice(2, 4), 16) / 255;
	const b = parseInt(hex.slice(4, 6), 16) / 255;

	const adjust = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

	return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b);
}

/**
 * Check if a color is "light" (luminance > 0.5)
 */
export function isLightColor(hex: string): boolean {
	return getLuminance(hex) > 0.4;
}

/**
 * Derive a full color palette from a single theme color
 */
export function deriveColors(themeColor: string): DerivedColors {
	console.group('🎨 Color Derivation');
	console.log('Input themeColor:', themeColor);
	
	const hsl = hexToHsl(themeColor);
	console.log('→ HSL:', hsl);
	
	const lum = getLuminance(themeColor);
	const isLight = lum > 0.4;
	console.log('→ Luminance:', lum.toFixed(3), '→ isLight:', isLight);

	// Background is the theme color
	const bgColor = themeColor;

	// Text color: high contrast
	const textColor = isLight ? '#1a1a1a' : '#ffffff';
	console.log('→ textColor:', textColor, '(high contrast)');

	// Muted text: same hue, adjusted for contrast
	const textMuted = isLight
		? hslToHex({ h: hsl.h, s: Math.max(hsl.s - 20, 0), l: 30 })
		: hslToHex({ h: hsl.h, s: Math.max(hsl.s - 20, 0), l: 70 });
	console.log('→ textMuted:', textMuted, `(h:${hsl.h}, s:${Math.max(hsl.s - 20, 0)}, l:${isLight ? 30 : 70})`);

	// Accent color: analogous (30° shift) with boosted saturation
	const accentHsl = {
		h: (hsl.h + 30) % 360,
		s: Math.min(hsl.s + 15, 100),
		l: isLight ? Math.max(hsl.l - 20, 30) : Math.min(hsl.l + 20, 70)
	};
	const accentColor = hslToHex(accentHsl);
	console.log('→ accentColor:', accentColor, `(h:${accentHsl.h}, s:${accentHsl.s}, l:${accentHsl.l})`);

	// Glow color: shift toward pink/magenta range for dramatic neon effect
	// For dark/saturated colors, use a bright pink/magenta glow
	const glowHsl = {
		h: (hsl.h + 270) % 360, // Shift toward pink/magenta (300° is magenta)
		s: Math.min(hsl.s + 40, 100), // High saturation for vibrancy
		l: 65 // Bright for glow effect
	};
	const glowColor = hslToHex(glowHsl);
	console.log('→ glowColor:', glowColor, `(h:${glowHsl.h}, s:${glowHsl.s}, l:${glowHsl.l})`);

	const result = {
		bgColor,
		textColor,
		textMuted,
		accentColor,
		glowColor
	};
	
	console.log('✓ Final palette:', result);
	console.groupEnd();

	return result;
}

/**
 * Apply color derivation with optional overrides
 */
export function applyColorOverrides(
	themeColor: string,
	overrides: Partial<DerivedColors>
): DerivedColors {
	const derived = deriveColors(themeColor);
	return {
		...derived,
		...Object.fromEntries(
			Object.entries(overrides).filter(([_, v]) => v !== undefined && v !== '')
		)
	};
}
