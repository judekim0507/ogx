<script lang="ts">
    import { Copy, Link, Check, Code } from "@lucide/svelte";
    import { onMount } from "svelte";

    let {
        copyUrl,
        imageUrl,
        templates,
        selectedCategory,
        selectedTemplate,
        selectTemplate,
    } = $props();

    let copied = $state(false);
    let origin = $state("");

    onMount(() => {
        origin = window.location.origin;
    });

    function handleCopy() {
        copyUrl();
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }
</script>

<aside
    class="w-[300px] bg-sidebar border-l border-sidebar-border flex flex-col h-full text-sidebar-foreground"
>
    <!-- Top Section: API URL -->
    <div class="p-4 flex flex-col gap-4 border-b border-sidebar-border">
        <div>
            <h2
                class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
                Generated URL
            </h2>
        </div>

        <div
            class="bg-muted/30 rounded-md border border-sidebar-border p-3 relative group"
        >
            <div
                class="text-[11px] font-mono text-foreground break-all leading-relaxed"
            >
                <span class="text-muted-foreground">{origin}</span>{imageUrl}
            </div>

            <button
                onclick={handleCopy}
                class="absolute top-2 right-2 p-1.5 rounded-md bg-background border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Copy URL"
            >
                {#if copied}
                    <Check size={14} class="text-green-500" />
                {:else}
                    <Copy size={14} />
                {/if}
            </button>
        </div>

        <button
            onclick={handleCopy}
            class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-xs font-medium transition-all shadow-sm"
        >
            <Link size={14} />
            Copy Full URL
        </button>
    </div>

    <!-- Integration Snippets -->
    <div class="p-4 flex flex-col gap-6 flex-1">
        <div>
            <h2
                class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3"
            >
                Integration
            </h2>

            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <div
                        class="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5"
                    >
                        <Code size={12} />
                        HTML
                    </div>
                    <div
                        class="bg-muted/10 rounded-md border border-sidebar-border p-2 overflow-x-auto"
                    >
                        <code
                            class="text-[10px] font-mono text-muted-foreground whitespace-pre block"
                        >
                            &lt;meta property="og:image" content="{origin}{imageUrl}"
                            /&gt;
                        </code>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <div
                        class="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5"
                    >
                        <Code size={12} />
                        Markdown
                    </div>
                    <div
                        class="bg-muted/10 rounded-md border border-sidebar-border p-2 overflow-x-auto"
                    >
                        <code
                            class="text-[10px] font-mono text-muted-foreground whitespace-pre block"
                        >
                            ![OG Image]({origin}{imageUrl})
                        </code>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer Info -->
    <div class="p-4 border-t border-sidebar-border mt-auto">
        <div class="text-[10px] text-muted-foreground text-center">
            ogx is open source. <a
                href="https://github.com/judekim0507/ogx"
                class="underline hover:text-foreground transition-all"
                target="_blank"
                rel="noopener noreferrer">View on GitHub</a
            >
        </div>
    </div>
</aside>
