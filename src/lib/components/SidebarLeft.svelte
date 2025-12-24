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

	// Derived state for filtering categories
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
			// Focus search on open (micro-optimization)
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
	<!-- Header -->
	<div class="px-4 py-4 border-b border-sidebar-border">
		<h2
			class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3"
		>
			Target
		</h2>

		<!-- Custom Combobox -->
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
							?.name || "Select category..."}</span
					>
				</span>
				<ChevronsUpDown
					size={14}
					class="text-muted-foreground opacity-50"
				/>
			</button>

			{#if open}
				<div
					class="absolute top-full left-0 right-0 mt-1.5 p-1 bg-popover border border-sidebar-border rounded-lg shadow-xl z-50 flex flex-col gap-1 ring-1 ring-black/5"
					transition:slide={{ duration: 150, axis: "y" }}
				>
					<!-- Search -->
					<div
						class="px-2 py-1.5 flex items-center gap-2 border-b border-sidebar-border mb-1"
					>
						<Search size={12} class="text-muted-foreground" />
						<input
							id="cat-search"
							type="text"
							bind:value={searchQuery}
							placeholder="Search categories..."
							class="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
						/>
					</div>

					<!-- Options -->
					<div
						class="max-h-[200px] overflow-y-auto flex flex-col gap-0.5"
					>
						{#each filteredCategories as cat}
							<button
								class="flex items-center justify-between px-2 py-1.5 rounded-md text-xs text-left transition-colors {selectedCategory ===
								cat.id
									? 'bg-primary text-primary-foreground'
									: 'text-foreground hover:bg-accent hover:text-accent-foreground'}"
								onclick={() => handleSelect(cat.id)}
							>
								<div class="flex items-center gap-2">
									<svelte:component
										this={categoryIcons[cat.id] || Box}
										size={14}
										class={selectedCategory === cat.id
											? "text-primary-foreground"
											: "text-muted-foreground"}
									/>
									<span>{cat.name}</span>
								</div>
								{#if selectedCategory === cat.id}
									<Check size={12} />
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

				<!-- Backdrop to close -->
				<div
					class="fixed inset-0 z-40"
					onclick={() => (open = false)}
				></div>
			{/if}
		</div>
	</div>

	<!-- Templates (Clean Grid) -->
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
					<div
						class="w-8 h-8 rounded-md bg-background flex items-center justify-center border border-sidebar-border shadow-sm group-hover:-translate-y-0.5 transition-transform duration-300"
					>
						<LayoutTemplate
							size={14}
							class={selectedTemplate === tpl.id
								? "text-primary"
								: "text-muted-foreground/70"}
						/>
					</div>
					<span
						class="text-[11px] font-medium text-center leading-tight"
						>{tpl.name}</span
					>
				</button>
			{/each}
		</div>
	</div>

	<!-- Parameters -->
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
			{#each currentFields as field}
				<div class="group">
					<label
						for={field.key}
						class="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block"
					>
						{field.key}
					</label>
					<input
						id={field.key}
						type="text"
						bind:value={params[field.key]}
						oninput={() => imageKey++}
						placeholder={field.placeholder}
						class="w-full bg-background border border-input focus:border-ring rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-all font-mono shadow-sm"
					/>
				</div>
			{/each}
		</div>
	</div>
</aside>
