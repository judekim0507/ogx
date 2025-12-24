<script lang="ts">
    import { Loader2, ExternalLink } from "@lucide/svelte";

    let { imageKey, imageUrl, isLoading = $bindable() } = $props();
</script>

<main class="flex-1 flex flex-col bg-muted/10 relative overflow-hidden">
    <!-- Canvas Header -->
    <div
        class="h-14 flex items-center px-6 border-b border-border bg-background"
    >
        <span class="text-sm font-medium text-muted-foreground">Preview</span>
        <div class="ml-auto flex items-center gap-2">
            <!-- Dimensions Badge -->
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
            <div class="relative aspect-[1200/630] w-full bg-[#111]">
                {#key imageKey}
                    <img
                        src={imageUrl}
                        alt="OG Preview"
                        class="w-full h-full object-contain"
                        onloadstart={() => (isLoading = true)}
                        onload={() => (isLoading = false)}
                        onerror={() => (isLoading = false)}
                    />
                {/key}
                {#if isLoading}
                    <div
                        class="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-[2px]"
                    >
                        <Loader2 class="w-8 h-8 text-primary animate-spin" />
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
                    title="Open Image in New Tab"
                >
                    <ExternalLink size={16} />
                </a>
            </div>
        </div>
    </div>
</main>

<style>
    /* Minimal dot pattern for context without noise */
    .bg-dot-pattern {
        background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
        background-size: 24px 24px;
    }
    :global(.dark) .bg-dot-pattern {
        background-image: radial-gradient(#27272a 1px, transparent 1px);
    }
</style>
