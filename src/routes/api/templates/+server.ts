import type { RequestHandler } from './$types';
import { getTemplate, listTemplates } from '$lib/og/templates';
import type { z } from 'zod';

// Categories are derived from template names (e.g., "blog-minimal" → "blog")
const KNOWN_CATEGORIES = ['generic', 'blog', 'marketplace', 'developer'] as const;

// Fields that are considered "advanced" (color overrides)
const ADVANCED_FIELD_PATTERNS = ['bgColor', 'textColor', 'glowColor', 'accentColor', 'textMuted'];

function getCategoryFromName(name: string): string {
	for (const cat of KNOWN_CATEGORIES) {
		if (name === cat || name.startsWith(`${cat}-`)) {
			return cat;
		}
	}
	if (name.startsWith('dev-')) {
		return 'developer';
	}
	return 'generic';
}

function formatCategoryName(id: string): string {
	const names: Record<string, string> = {
		generic: 'Generic',
		blog: 'Blog',
		marketplace: 'Marketplace',
		developer: 'Developer'
	};
	return names[id] || id.charAt(0).toUpperCase() + id.slice(1);
}

function isAdvancedField(key: string): boolean {
	// Fields ending with 'Color' (except themeColor) are advanced
	if (key.endsWith('Color') && key !== 'themeColor') {
		return true;
	}
	return ADVANCED_FIELD_PATTERNS.includes(key);
}

// Extract field info from a Zod schema
function extractFieldsFromSchema(schema: z.ZodType): Array<{
	key: string;
	required: boolean;
	default: unknown;
	type: string;
	advanced: boolean;
}> {
	const fields: Array<{ key: string; required: boolean; default: unknown; type: string; advanced: boolean }> = [];

	if ('shape' in schema && typeof schema.shape === 'object') {
		const shape = schema.shape as Record<string, z.ZodType>;

		for (const [key, fieldSchema] of Object.entries(shape)) {
			let isOptional = false;
			let defaultValue: unknown = null;
			let fieldType = 'string';

			let current: any = fieldSchema;

			if (current._def?.typeName === 'ZodOptional') {
				isOptional = true;
				current = current._def.innerType;
			}

			if (current._def?.typeName === 'ZodDefault') {
				defaultValue = current._def.defaultValue();
				current = current._def.innerType;
			}

			if (current._def?.typeName) {
				const typeName = current._def.typeName;
				if (typeName === 'ZodString') fieldType = 'string';
				else if (typeName === 'ZodNumber') fieldType = 'number';
				else if (typeName === 'ZodBoolean') fieldType = 'boolean';
				else fieldType = typeName.replace('Zod', '').toLowerCase();
			}

			fields.push({
				key,
				required: !isOptional && defaultValue === null,
				default: defaultValue,
				type: fieldType,
				advanced: isAdvancedField(key)
			});
		}
	}

	return fields;
}

export const GET: RequestHandler = async () => {
	const allTemplates = listTemplates();

	const templatesByCategory: Record<string, Array<{ id: string; name: string; description: string }>> = {};
	const fieldsByTemplate: Record<string, Array<{ key: string; required: boolean; default: unknown; type: string; advanced: boolean }>> = {};
	const categoriesSet = new Set<string>();

	for (const t of allTemplates) {
		const category = getCategoryFromName(t.name);
		categoriesSet.add(category);

		if (!templatesByCategory[category]) {
			templatesByCategory[category] = [];
		}

		templatesByCategory[category].push({
			id: t.name,
			name: t.name.replace(`${category}-`, '').replace('dev-', '') || 'Default',
			description: t.description
		});

		const fullTemplate = getTemplate(t.name);
		if (fullTemplate) {
			fieldsByTemplate[t.name] = extractFieldsFromSchema(fullTemplate.schema);
		}
	}

	const categories = KNOWN_CATEGORIES
		.filter(cat => categoriesSet.has(cat))
		.map(id => ({
			id,
			name: formatCategoryName(id)
		}));

	return new Response(JSON.stringify({
		categories,
		templates: templatesByCategory,
		fields: fieldsByTemplate
	}), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=60'
		}
	});
};
