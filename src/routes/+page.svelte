<script lang="ts">
	import { onMount } from "svelte";
	import SidebarLeft from "$lib/components/SidebarLeft.svelte";
	import SidebarRight from "$lib/components/SidebarRight.svelte";
	import Canvas from "$lib/components/Canvas.svelte";
	import { Skeleton } from "$lib/components/ui/skeleton";

	// Types for API response
	type Category = { id: string; name: string };
	type TemplateInfo = { id: string; name: string; description: string };
	type FieldInfo = {
		key: string;
		required: boolean;
		default: unknown;
		type: string;
		advanced: boolean;
	};

	// State
	let selectedCategory = $state("generic");
	let selectedTemplate = $state("generic");
	let params = $state<Record<string, string>>({});
	let imageKey = $state(0);
	let isLoading = $state(false);
	let isLoadingTemplates = $state(true);

	// Data from API
	let categories = $state<Category[]>([]);
	let templates = $state<Record<string, TemplateInfo[]>>({});
	let templateFields = $state<Record<string, FieldInfo[]>>({});

	// Derived state
	let currentFields = $derived(
		(templateFields[selectedTemplate] || []).map((f) => ({
			key: f.key,
			label: formatLabel(f.key),
			placeholder: f.default?.toString() || getPlaceholder(f.key),
			advanced: f.advanced,
		})),
	);

	let imageUrl = $derived.by(() => {
		const filteredParams = Object.entries(params)
			.filter(([_, v]) => v && v.trim())
			.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
			.join("&");
		return `/og/${selectedTemplate}?${filteredParams}`;
	});

	function formatLabel(key: string): string {
		// Convert camelCase to Title Case
		return key
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase())
			.trim();
	}

	function getPlaceholder(key: string): string {
		const placeholders: Record<string, string> = {
			title: "Your title here",
			subtitle: "Optional subtitle",
			description: "A brief description",
			author: "Author name",
			name: "Project name",
			price: "$29.99",
			stars: "1.2k",
			version: "v1.0.0",
		};
		return placeholders[key] || `Enter ${key}`;
	}

	function getDefaultParams(templateId: string): Record<string, string> {
		// Start with schema defaults from the template
		const defaults: Record<string, string> = {};
		const fields = templateFields[templateId] || [];
		for (const field of fields) {
			if (field.default !== null && field.default !== undefined) {
				defaults[field.key] = String(field.default);
			}
		}

		// Add content defaults based on template type
		if (templateId.includes("blog")) {
			defaults.title = defaults.title || "How to Build Modern Web Apps";
			defaults.author = defaults.author || "Jane Doe";
		} else if (templateId.includes("marketplace")) {
			defaults.title = defaults.title || "Premium Wireless Headphones";
			defaults.price = defaults.price || "$299";
		} else if (
			templateId.startsWith("dev-") ||
			templateId.includes("developer")
		) {
			defaults.name = defaults.name || "awesome-project";
			defaults.title = defaults.title || "Getting Started Guide";
		} else {
			defaults.title = defaults.title || "Build Something Beautiful";
			defaults.subtitle =
				defaults.subtitle || "Create stunning visuals effortlessly";
		}

		return defaults;
	}

	function selectTemplate(id: string) {
		selectedTemplate = id;
		params = getDefaultParams(id);
		imageKey++;
	}

	function selectCategory(id: string) {
		selectedCategory = id;
		const firstTemplate = templates[id]?.[0];
		if (firstTemplate) {
			selectTemplate(firstTemplate.id);
		}
	}

	function copyUrl() {
		navigator.clipboard.writeText(window.location.origin + imageUrl);
	}

	async function loadTemplates() {
		try {
			isLoadingTemplates = true;
			const response = await fetch("/api/templates");
			const data = await response.json();

			categories = data.categories;
			templates = data.templates;
			templateFields = data.fields;

			// Select first category and template
			if (categories.length > 0) {
				selectCategory(categories[0].id);
			}
		} catch (error) {
			console.error("Failed to load templates:", error);
		} finally {
			isLoadingTemplates = false;
		}
	}

	onMount(() => {
		loadTemplates();
	});
</script>

<svelte:head>
	<title>ogx — open graph image, rendered.</title>
</svelte:head>

{#if isLoadingTemplates}
	<div class="flex h-screen items-center justify-center bg-background dark">
		<div class="flex flex-col items-center gap-4">
			<Skeleton class="h-8 w-48 rounded-md" />
			<Skeleton class="h-4 w-32 rounded-md" />
		</div>
	</div>
{:else}
	<div
		class="flex h-screen overflow-hidden dark bg-background text-foreground"
	>
		<SidebarLeft
			{categories}
			bind:selectedCategory
			{templates}
			bind:selectedTemplate
			{currentFields}
			bind:params
			bind:imageKey
			{selectCategory}
			{selectTemplate}
		/>

		<Canvas
			{imageKey}
			{imageUrl}
			bind:isLoading
			{selectedTemplate}
			{params}
		/>

		<SidebarRight
			{copyUrl}
			{imageUrl}
			{templates}
			{selectedCategory}
			{selectedTemplate}
			{selectTemplate}
			{currentFields}
		/>
	</div>
{/if}
