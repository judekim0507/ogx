# Contributing to OGX

Thank you for your interest in contributing to OGX! This guide will help you add new Open Graph image templates.

## Adding a New Template

Templates are auto-discovered by the playground. Just add the file and it appears!

### 1. Create the Template File

Templates live in `src/lib/og/templates/[category]/`. 

**Example:** Adding a "card" template to the generic category

Create `src/lib/og/templates/generic/card.ts`:

```typescript
import { z } from 'zod';
import { defineTemplate, OG_DIMENSIONS } from '../types';

// Define the schema for your template's parameters
export const schema = z.object({
	title: z.string().min(1).max(100),
	subtitle: z.string().max(150).optional(),
	bgColor: z.string().default('#ffffff'),
	textColor: z.string().default('#000000')
});

export default defineTemplate({
	name: 'generic-card',  // Convention: [category]-[variant]
	description: 'Simple card layout with title and subtitle',
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
							fontSize: 68,
							fontWeight: 700,
							color: props.textColor,
							textAlign: 'center',
							lineHeight: 1.15
						},
						children: props.title
					}
				},
				props.subtitle ? {
					type: 'div',
					props: {
						style: {
							fontSize: 26,
							color: props.textColor,
							opacity: 0.7,
							marginTop: 20,
							textAlign: 'center'
						},
						children: props.subtitle
					}
				} : null
			].filter(Boolean)
		}
	})
});
```

### 2. Export from Category Index

Add to `src/lib/og/templates/generic/index.ts`:

```typescript
export { default as genericCard } from './card';
```

**That's it!** The template is now:
- ✅ Available at `/og/generic-card`
- ✅ Visible in the playground
- ✅ Fields auto-detected from schema

## Template Naming Convention

Template names determine their category:
- `generic`, `generic-*` → Generic category
- `blog`, `blog-*` → Blog category  
- `marketplace`, `marketplace-*` → Marketplace category
- `dev-*` → Developer category

## Adding a New Category

1. **Create the directory:**
   ```bash
   mkdir src/lib/og/templates/events
   ```

2. **Create templates** with the category prefix:
   ```typescript
   // events/conference.ts
   export default defineTemplate({
       name: 'events-conference',
       // ...
   });
   ```

3. **Create category index:**
   ```typescript
   // src/lib/og/templates/events/index.ts
   export { default as eventsConference } from './conference';
   ```

4. **Register in main index:**
   ```typescript
   // src/lib/og/templates/index.ts
   import * as events from './events';
   
   // Add to registration
   Object.values(events).forEach((t) => templates.set(t.name, t));
   
   // Add to KNOWN_CATEGORIES in api/templates/+server.ts
   const KNOWN_CATEGORIES = ['generic', 'blog', 'marketplace', 'developer', 'events'];
   ```

## Design Guidelines

- **Size:** Always render at 1200x630px
- **Safe area:** Keep important content 80px from edges
- **Font sizes:** 48-72px for titles, 20-28px for body
- **Font:** Use `Inter` (already loaded)

## Testing

```bash
# API test
curl "http://localhost:5173/og/generic-card?title=Hello&subtitle=World"

# Playground test
npm run dev
# Open http://localhost:5173 - your template should appear
```

## Submitting a PR

1. Fork the repo
2. Create a branch (`git checkout -b template/your-template-name`)
3. Add your template (just the file + export!)
4. Test via API and Playground
5. Open a PR with a screenshot

Questions? Open an issue!
