<script lang="ts">
    import { Loader2, ExternalLink } from "@lucide/svelte";
    import { onMount } from "svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";

    let {
        imageKey,
        imageUrl,
        isLoading = $bindable(),
        selectedTemplate,
        params,
    } = $props();

    let imgSrc = $state("");
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let hasLoaded = $state(false);

    // Debounced image URL update (500ms delay)
    function updatePreview() {
        isLoading = true;
        // Add preview=true to skip caching
        const separator = imageUrl.includes("?") ? "&" : "?";
        imgSrc = imageUrl + separator + "preview=true";
    }

    // Watch for changes and debounce
    $effect(() => {
        // Subscribe to imageKey changes
        const _ = imageKey;

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updatePreview, 500);
    });

    // Initial load
    onMount(() => {
        updatePreview();
    });

    function handleLoad() {
        isLoading = false;
        hasLoaded = true;
    }

    function handleError() {
        isLoading = false;
    }
</script>

<main class="flex-1 flex flex-col bg-muted/10 relative overflow-hidden">
    <!-- Canvas Header -->
    <div
        class="h-14 flex items-center px-6 border-b border-border bg-background"
    >
        <span class="text-sm font-medium text-muted-foreground">Preview</span>
        <div class="ml-auto flex items-center gap-2">
            <div
                class="px-2 py-1 bg-muted rounded-md text-[10px] font-mono text-muted-foreground"
            >
                1200 × 630
            </div>
        </div>
    </div>

    <!-- Preview Area -->
    <div
        class="flex-1 flex items-center justify-center relative p-8 md:p-12 overflow-hidden bg-dot-pattern"
    >
        <div
            class="relative z-10 w-full max-w-[900px] shadow-sm rounded-lg overflow-hidden border border-border bg-background"
        >
            <div class="relative aspect-[1200/630] w-full bg-[#0f172a]">
                <!-- Skeleton Loader (shows when no image loaded yet) -->
                {#if !hasLoaded}
                    <div
                        class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-16"
                    >
                        <Skeleton class="w-3/4 h-12 rounded-lg" />
                        <Skeleton class="w-1/2 h-6 rounded-md" />
                    </div>
                {/if}

                <!-- Actual Image -->
                {#key imgSrc}
                    <img
                        src={imgSrc}
                        alt="OG Preview"
                        class="w-full h-full object-contain transition-opacity duration-300"
                        class:opacity-0={!hasLoaded || isLoading}
                        onload={handleLoad}
                        onerror={handleError}
                    />
                {/key}

                <!-- Loading Overlay (shows during updates) -->
                {#if isLoading && hasLoaded}
                    <div
                        class="absolute inset-0 bg-background/30 flex items-center justify-center backdrop-blur-[1px] transition-opacity"
                    >
                        <div
                            class="flex items-center gap-2 px-3 py-2 bg-background/90 rounded-full shadow-lg border border-border"
                        >
                            <Loader2
                                class="w-4 h-4 text-primary animate-spin"
                            />
                            <span class="text-xs text-muted-foreground"
                                >Updating...</span
                            >
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Quick Actions Overlay -->
            <div
                class="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity"
            >
                <a
                    href={imageUrl}
                    target="_blank"
                    class="p-2 bg-background/80 backdrop-blur text-foreground rounded-lg shadow-sm border border-border hover:bg-background block"
                    title="Open PNG in New Tab"
                >
                    <ExternalLink size={16} />
                </a>
            </div>
        </div>
    </div>
</main>

<style>
    .bg-dot-pattern {
        background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
        background-size: 24px 24px;
    }
    :global(.dark) .bg-dot-pattern {
        background-image: radial-gradient(#27272a 1px, transparent 1px);
    }
</style>
