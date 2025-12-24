<script lang="ts">
	import {
		LayoutTemplate,
		Sparkles,
		Box,
		Code2,
		Type,
		ChevronsUpDown,
		Check,
		Search,
		ChevronDown,
		Settings2,
	} from "@lucide/svelte";
	import { slide } from "svelte/transition";

	let {
		categories,
		selectedCategory = $bindable(),
		templates,
		selectedTemplate = $bindable(),
		currentFields,
		params = $bindable(),
		imageKey = $bindable(),
		selectCategory,
		selectTemplate,
	} = $props();

	let open = $state(false);
	let searchQuery = $state("");
	let advancedOpen = $state(false);

	let basicFields = $derived(currentFields.filter((f: any) => !f.advanced));
	let advancedFields = $derived(currentFields.filter((f: any) => f.advanced));

	let filteredCategories = $derived(
		categories.filter((c: any) =>
			c.name.toLowerCase().includes(searchQuery.toLowerCase()),
		),
	);

	const categoryIcons: Record<string, any> = {
		generic: Box,
		blog: Type,
		marketplace: Sparkles,
		developer: Code2,
	};

	function toggleOpen() {
		open = !open;
		if (open) {
			setTimeout(
				() => document.getElementById("cat-search")?.focus(),
				10,
			);
		}
	}

	function handleSelect(id: string) {
		selectCategory(id);
		open = false;
		searchQuery = "";
	}
</script>

<aside
	class="w-[300px] bg-sidebar border-r border-sidebar-border flex flex-col h-full text-sidebar-foreground overflow-y-auto"
>
	<div class="px-4 py-4 border-b border-sidebar-border">
		<h2
			class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3"
		>
			Target
		</h2>

		<div class="relative">
			<button
				onclick={toggleOpen}
				class="w-full flex items-center justify-between px-3 py-2 text-sm bg-background border border-input hover:bg-accent/50 hover:text-accent-foreground rounded-lg transition-all shadow-sm outline-none focus:ring-2 focus:ring-ring"
			>
				<span class="flex items-center gap-2 truncate">
					<svelte:component
						this={categoryIcons[selectedCategory] || Box}
						size={14}
						class="text-muted-foreground"
					/>
					<span class="font-medium"
						>{categories.find((c: any) => c.id === selectedCategory)
							?.name || "Select..."}</span
					>
				</span>
				<ChevronsUpDown
					size={14}
					class="text-muted-foreground flex-shrink-0"
				/>
			</button>

			{#if open}
				<div
					transition:slide={{ duration: 150 }}
					class="absolute z-50 w-full mt-2 bg-popover border border-border rounded-lg shadow-xl overflow-hidden"
				>
					<div class="p-2 border-b border-border">
						<div class="relative">
							<Search
								size={12}
								class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
							/>
							<input
								id="cat-search"
								type="text"
								bind:value={searchQuery}
								placeholder="Search categories..."
								class="w-full bg-muted/50 border-none rounded-md pl-7 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-ring"
							/>
						</div>
					</div>

					<div class="max-h-[200px] overflow-y-auto py-1">
						{#each filteredCategories as cat}
							<button
								onclick={() => handleSelect(cat.id)}
								class="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent/50 text-left {selectedCategory ===
								cat.id
									? 'text-foreground'
									: 'text-muted-foreground'}"
							>
								<span class="flex items-center gap-2">
									<svelte:component
										this={categoryIcons[cat.id] || Box}
										size={13}
									/>
									{cat.name}
								</span>
								{#if selectedCategory === cat.id}
									<Check size={12} class="text-primary" />
								{/if}
							</button>
						{/each}

						{#if filteredCategories.length === 0}
							<div
								class="px-2 py-3 text-center text-[10px] text-muted-foreground"
							>
								No results found.
							</div>
						{/if}
					</div>
				</div>

				<div
					class="fixed inset-0 z-40"
					onclick={() => (open = false)}
				></div>
			{/if}
		</div>
	</div>

	<div class="px-4 pt-4 pb-6 border-b border-sidebar-border/40">
		<h2
			class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2"
		>
			Templates <span
				class="text-muted-foreground/50 ml-1 font-normal lowercase"
				>({templates[selectedCategory]?.length || 0})</span
			>
		</h2>

		<div class="grid grid-cols-2 gap-2">
			{#each templates[selectedCategory] || [] as tpl}
				<button
					class="group flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all {selectedTemplate ===
					tpl.id
						? 'bg-sidebar-accent border-primary/50 text-foreground ring-1 ring-primary/20'
						: 'bg-transparent border-sidebar-border hover:border-sidebar-border/80 hover:bg-sidebar-accent/50 text-muted-foreground'}"
					onclick={() => selectTemplate(tpl.id)}
				>
					<span
						class="text-[11px] font-medium text-center leading-tight"
						>{tpl.name}</span
					>
				</button>
			{/each}
		</div>
	</div>

	<div class="p-4 flex flex-col gap-4">
		<div>
			<h2
				class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
			>
				Parameters
			</h2>
			<p class="text-[10px] text-muted-foreground mt-1">
				Configure layout data.
			</p>
		</div>

		<div class="flex flex-col gap-3">
			{#each basicFields as field}
				<div class="group">
					<label
						for={field.key}
						class="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block"
					>
						{field.label}
					</label>
					{#if field.key.toLowerCase().includes("color")}
						<div class="flex gap-2">
							<input
								id={field.key + "-picker"}
								type="color"
								bind:value={params[field.key]}
								oninput={() => imageKey++}
								class="w-12 h-10 rounded-md border border-input cursor-pointer bg-background"
							/>
							<input
								id={field.key}
								type="text"
								bind:value={params[field.key]}
								oninput={() => imageKey++}
								placeholder={field.placeholder}
								class="flex-1 bg-background border border-input focus:border-ring rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-all font-mono shadow-sm"
							/>
						</div>
					{:else}
						<input
							id={field.key}
							type="text"
							bind:value={params[field.key]}
							oninput={() => imageKey++}
							placeholder={field.placeholder}
							class="w-full bg-background border border-input focus:border-ring rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-all font-mono shadow-sm"
						/>
					{/if}
				</div>
			{/each}
		</div>

		{#if advancedFields.length > 0}
			<div class="mt-2">
				<button
					onclick={() => (advancedOpen = !advancedOpen)}
					class="w-full flex items-center justify-between px-3 py-2 text-xs text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 rounded-md transition-all border border-transparent hover:border-border"
				>
					<span class="flex items-center gap-2">
						<Settings2 size={12} />
						Advanced
					</span>
					<ChevronDown
						size={12}
						class="transition-transform duration-200 {advancedOpen
							? 'rotate-180'
							: ''}"
					/>
				</button>

				{#if advancedOpen}
					<div
						transition:slide={{ duration: 150 }}
						class="mt-3 pl-3 border-l-2 border-muted flex flex-col gap-3"
					>
						<p class="text-[9px] text-muted-foreground/70">
							Override auto-calculated colors
						</p>
						{#each advancedFields as field}
							<div class="group">
								<label
									for={field.key}
									class="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block"
								>
									{field.label}
								</label>
								<div class="flex gap-2">
									<input
										id={field.key + "-picker"}
										type="color"
										bind:value={params[field.key]}
										oninput={() => imageKey++}
										class="w-12 h-10 rounded-md border border-input cursor-pointer bg-background"
									/>
									<input
										id={field.key}
										type="text"
										bind:value={params[field.key]}
										oninput={() => imageKey++}
										placeholder={field.placeholder ||
											"Auto"}
										class="flex-1 bg-background border border-input focus:border-ring rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-all font-mono shadow-sm"
									/>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</aside>
