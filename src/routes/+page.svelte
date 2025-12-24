<script lang="ts">
	import { onMount } from "svelte";
	import SidebarLeft from "$lib/components/SidebarLeft.svelte";
	import SidebarRight from "$lib/components/SidebarRight.svelte";
	import Canvas from "$lib/components/Canvas.svelte";

	let selectedCategory = "generic";
	let selectedTemplate = "generic";
	let params: Record<string, string> = {};
	let imageKey = 0;
	let isLoading = false;

	const categories = [
		{ id: "generic", name: "Generic", icon: "◆" },
		{ id: "blog", name: "Blog", icon: "✎" },
		{ id: "marketplace", name: "Shop", icon: "◈" },
		{ id: "developer", name: "Dev", icon: "⌘" },
	];

	const templates: Record<
		string,
		Array<{ id: string; name: string; preview: string }>
	> = {
		generic: [
			{
				id: "generic",
				name: "Default",
				preview: "Clean centered layout",
			},
			{
				id: "generic-gradient",
				name: "Gradient",
				preview: "Vibrant gradient bg",
			},
			{ id: "generic-minimal", name: "Minimal", preview: "Ultra clean" },
			{ id: "generic-split", name: "Split", preview: "Two-tone layout" },
			{ id: "generic-dark", name: "Dark", preview: "Dark with glow" },
			{ id: "generic-border", name: "Border", preview: "Bold frame" },
		],
		blog: [
			{ id: "blog", name: "Default", preview: "Classic article" },
			{
				id: "blog-magazine",
				name: "Magazine",
				preview: "Editorial style",
			},
			{ id: "blog-minimal", name: "Minimal", preview: "Clean & simple" },
			{ id: "blog-dark", name: "Dark", preview: "Dark mode" },
			{
				id: "blog-newsletter",
				name: "Newsletter",
				preview: "Substack style",
			},
		],
		marketplace: [
			{ id: "marketplace", name: "Default", preview: "Product card" },
			{
				id: "marketplace-minimal",
				name: "Minimal",
				preview: "Clean product",
			},
			{ id: "marketplace-sale", name: "Sale", preview: "Promo card" },
			{
				id: "marketplace-luxury",
				name: "Luxury",
				preview: "Premium feel",
			},
		],
		developer: [
			{ id: "dev-github", name: "GitHub", preview: "Repo style" },
			{ id: "dev-docs", name: "Docs", preview: "Documentation" },
			{ id: "dev-release", name: "Release", preview: "Version launch" },
			{ id: "dev-api", name: "API", preview: "Endpoint docs" },
			{ id: "dev-opensource", name: "OSS", preview: "Open source" },
		],
	};

	const templateFields: Record<
		string,
		Array<{ key: string; label: string; placeholder: string }>
	> = {
		generic: [
			{ key: "title", label: "Title", placeholder: "Your title here" },
			{
				key: "subtitle",
				label: "Subtitle",
				placeholder: "Optional subtitle",
			},
			{ key: "accentColor", label: "Accent", placeholder: "#6366f1" },
		],
		"generic-gradient": [
			{ key: "title", label: "Title", placeholder: "Your title here" },
			{
				key: "subtitle",
				label: "Subtitle",
				placeholder: "Optional subtitle",
			},
			{ key: "gradientFrom", label: "From", placeholder: "#6366f1" },
			{ key: "gradientTo", label: "To", placeholder: "#a855f7" },
		],
		"generic-minimal": [
			{ key: "title", label: "Title", placeholder: "Your title here" },
			{
				key: "subtitle",
				label: "Subtitle",
				placeholder: "Optional subtitle",
			},
			{ key: "accentColor", label: "Accent", placeholder: "#000000" },
		],
		"generic-split": [
			{ key: "title", label: "Title", placeholder: "Your title here" },
			{
				key: "subtitle",
				label: "Subtitle",
				placeholder: "Optional subtitle",
			},
			{ key: "leftColor", label: "Left", placeholder: "#18181b" },
			{ key: "rightColor", label: "Right", placeholder: "#f4f4f5" },
		],
		"generic-dark": [
			{ key: "title", label: "Title", placeholder: "Your title here" },
			{
				key: "subtitle",
				label: "Subtitle",
				placeholder: "Optional subtitle",
			},
			{ key: "accentColor", label: "Accent", placeholder: "#22d3ee" },
		],
		"generic-border": [
			{ key: "title", label: "Title", placeholder: "Your title here" },
			{
				key: "subtitle",
				label: "Subtitle",
				placeholder: "Optional subtitle",
			},
			{ key: "borderColor", label: "Border", placeholder: "#18181b" },
		],
		blog: [
			{ key: "title", label: "Title", placeholder: "Article title" },
			{ key: "author", label: "Author", placeholder: "Author name" },
			{ key: "category", label: "Category", placeholder: "Technology" },
			{ key: "readTime", label: "Read time", placeholder: "5 min read" },
		],
		"blog-magazine": [
			{ key: "title", label: "Title", placeholder: "Article title" },
			{ key: "subtitle", label: "Subtitle", placeholder: "Subtitle" },
			{ key: "category", label: "Category", placeholder: "ESSAY" },
			{ key: "issue", label: "Issue", placeholder: "Issue #12" },
		],
		"blog-minimal": [
			{ key: "title", label: "Title", placeholder: "Article title" },
			{ key: "author", label: "Author", placeholder: "Author" },
			{ key: "siteName", label: "Site", placeholder: "Your Blog" },
		],
		"blog-dark": [
			{ key: "title", label: "Title", placeholder: "Article title" },
			{
				key: "description",
				label: "Description",
				placeholder: "Brief description",
			},
			{ key: "author", label: "Author", placeholder: "Author" },
			{ key: "category", label: "Category", placeholder: "Tutorial" },
		],
		"blog-newsletter": [
			{ key: "title", label: "Title", placeholder: "Newsletter title" },
			{ key: "subtitle", label: "Subtitle", placeholder: "Subtitle" },
			{ key: "author", label: "Author", placeholder: "Author" },
			{ key: "edition", label: "Edition", placeholder: "Edition #42" },
		],
		marketplace: [
			{ key: "title", label: "Product", placeholder: "Product name" },
			{ key: "price", label: "Price", placeholder: "$29.99" },
			{ key: "rating", label: "Rating", placeholder: "4.8" },
			{ key: "badge", label: "Badge", placeholder: "NEW" },
		],
		"marketplace-minimal": [
			{ key: "title", label: "Product", placeholder: "Product name" },
			{ key: "price", label: "Price", placeholder: "$29.99" },
			{ key: "category", label: "Category", placeholder: "Electronics" },
			{ key: "brand", label: "Brand", placeholder: "Brand name" },
		],
		"marketplace-sale": [
			{ key: "title", label: "Title", placeholder: "Flash Sale" },
			{ key: "discount", label: "Discount", placeholder: "50% OFF" },
			{ key: "code", label: "Code", placeholder: "SAVE50" },
			{ key: "validUntil", label: "Valid", placeholder: "Ends Dec 31" },
		],
		"marketplace-luxury": [
			{ key: "title", label: "Product", placeholder: "Product name" },
			{
				key: "subtitle",
				label: "Subtitle",
				placeholder: "Limited edition",
			},
			{ key: "brand", label: "Brand", placeholder: "LUXURY" },
			{ key: "price", label: "Price", placeholder: "$1,299" },
		],
		"dev-github": [
			{ key: "name", label: "Repo", placeholder: "repo-name" },
			{
				key: "description",
				label: "Description",
				placeholder: "A cool project",
			},
			{ key: "owner", label: "Owner", placeholder: "username" },
			{ key: "stars", label: "Stars", placeholder: "1.2k" },
			{ key: "language", label: "Language", placeholder: "TypeScript" },
		],
		"dev-docs": [
			{ key: "title", label: "Title", placeholder: "Getting Started" },
			{ key: "section", label: "Section", placeholder: "Introduction" },
			{ key: "version", label: "Version", placeholder: "v2.0.0" },
		],
		"dev-release": [
			{ key: "name", label: "Name", placeholder: "Project Name" },
			{ key: "version", label: "Version", placeholder: "v2.0.0" },
			{
				key: "tagline",
				label: "Tagline",
				placeholder: "Now with more features",
			},
			{ key: "date", label: "Date", placeholder: "Dec 2024" },
		],
		"dev-api": [
			{ key: "title", label: "Title", placeholder: "Get User" },
			{ key: "method", label: "Method", placeholder: "GET" },
			{
				key: "endpoint",
				label: "Endpoint",
				placeholder: "/api/users/:id",
			},
			{
				key: "description",
				label: "Description",
				placeholder: "Fetch user by ID",
			},
		],
		"dev-opensource": [
			{ key: "name", label: "Name", placeholder: "Project Name" },
			{
				key: "tagline",
				label: "Tagline",
				placeholder: "The best tool ever",
			},
			{ key: "license", label: "License", placeholder: "MIT License" },
		],
	};

	function selectTemplate(id: string) {
		selectedTemplate = id;
		params = {};
		const fields = templateFields[id] || templateFields["generic"];
		// Set some nice defaults
		if (id.startsWith("generic")) {
			params.title = "Build Something Beautiful";
			params.subtitle = "Create stunning visuals effortlessly";
		} else if (id.startsWith("blog")) {
			params.title = "How to Build Modern Web Apps";
			params.author = "Jane Doe";
		} else if (id.startsWith("marketplace")) {
			params.title = "Premium Wireless Headphones";
			params.price = "$299";
		} else if (id.startsWith("dev")) {
			params.name = "awesome-project";
			params.title = "Getting Started Guide";
		}
		imageKey++;
	}

	function selectCategory(id: string) {
		selectedCategory = id;
		const firstTemplate = templates[id]?.[0];
		if (firstTemplate) {
			selectTemplate(firstTemplate.id);
		}
	}

	$: currentFields =
		templateFields[selectedTemplate] || templateFields["generic"];

	$: imageUrl = (() => {
		const filteredParams = Object.entries(params)
			.filter(([_, v]) => v && v.trim())
			.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
			.join("&");
		return `/og/${selectedTemplate}?${filteredParams}`;
	})();

	function copyUrl() {
		navigator.clipboard.writeText(window.location.origin + imageUrl);
	}

	onMount(() => {
		selectTemplate("generic");
	});
</script>

<svelte:head>
	<title>ogx — open graph image, rendered.</title>
</svelte:head>

<div class="flex h-screen overflow-hidden dark bg-background text-foreground">
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

	<Canvas {imageKey} {imageUrl} bind:isLoading />

	<SidebarRight
		{copyUrl}
		{imageUrl}
		{templates}
		{selectedCategory}
		{selectedTemplate}
		{selectTemplate}
	/>
</div>
