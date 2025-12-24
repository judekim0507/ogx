import type { Template } from './types';

// Import all templates from category folders
import * as generic from './generic';
import * as blog from './blog';
import * as marketplace from './marketplace';
import * as developer from './developer';

// Build the registry from all imported templates
const templates = new Map<string, Template>();

// Register generic templates
Object.values(generic).forEach((t) => templates.set(t.name, t));
Object.values(blog).forEach((t) => templates.set(t.name, t));
Object.values(marketplace).forEach((t) => templates.set(t.name, t));
Object.values(developer).forEach((t) => templates.set(t.name, t));

export function getTemplate(name: string): Template | undefined {
	return templates.get(name);
}

export function listTemplates(): Array<{ name: string; description: string }> {
	return Array.from(templates.values()).map((t) => ({
		name: t.name,
		description: t.description
	}));
}

// Re-export all templates
export * from './generic';
export * from './blog';
export * from './marketplace';
export * from './developer';
