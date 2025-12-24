<script lang="ts">
    import { Copy, Link, Check, Code, ChevronDown } from "@lucide/svelte";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import SvelteIcon from "./icons/SvelteIcon.svelte";
    import ReactIcon from "./icons/ReactIcon.svelte";
    import VueIcon from "./icons/VueIcon.svelte";
    import HtmlIcon from "./icons/HtmlIcon.svelte";

    let {
        copyUrl,
        imageUrl,
        templates,
        selectedCategory,
        selectedTemplate,
        selectTemplate,
        currentFields = [],
    } = $props();

    let copied = $state(false);
    let origin = $state("");
    let mode = $state<"fixed" | "dynamic">("dynamic");
    let selectedFramework = $state("svelte");
    let frameworkOpen = $state(false);

    const frameworks = [
        { id: "svelte", name: "Svelte/Kit", icon: SvelteIcon },
        { id: "react", name: "React/Next.js", icon: ReactIcon },
        { id: "vue", name: "Vue/Nuxt", icon: VueIcon },
        { id: "html", name: "Plain HTML", icon: HtmlIcon },
    ];

    // Break up script tags to prevent Svelte parser from recognizing them
    const scriptOpen = '<' + 'script>';
    const scriptClose = '</' + 'script>';

    onMount(() => {
        origin = window.location.origin;
    });

    function handleCopy() {
        copyUrl();
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }

    // Get param keys from currentFields (non-advanced only)
    let paramKeys = $derived(
        currentFields.filter((f: any) => !f.advanced).map((f: any) => f.key)
    );

    // Generate dynamic URL with variables
    let dynamicUrl = $derived.by(() => {
        const base = `/og/${selectedTemplate}`;
        if (paramKeys.length === 0) return base;
        const params = paramKeys.map((k: string) => `${k}=\${${k}}`).join("&");
        return `${base}?${params}`;
    });

    // Selected framework info
    let selectedFrameworkInfo = $derived(
        frameworks.find(f => f.id === selectedFramework)
    );

    // Framework-specific snippets
    let snippet = $derived.by(() => {
        const paramsStr = paramKeys.join(", ");

        if (mode === "fixed") {
            switch (selectedFramework) {
                case "svelte":
                    return `<svelte:head>
  <meta property="og:image" content="${origin}${imageUrl}" />
</svelte:head>`;
                case "react":
                    return `export const metadata = {
  openGraph: {
    images: ['${origin}${imageUrl}'],
  },
};`;
                case "vue":
                    return `useHead({
  meta: [
    { property: 'og:image', content: '${origin}${imageUrl}' },
  ],
});`;
                case "html":
                default:
                    return `<meta property="og:image" content="${origin}${imageUrl}" />`;
            }
        } else {
            // Dynamic mode
            switch (selectedFramework) {
                case "svelte":
                    return `${scriptOpen}
  export let data;
  const { ${paramsStr} } = data;
${scriptClose}

<svelte:head>
  <meta property="og:image" content={\`${origin}${dynamicUrl}\`} />
</svelte:head>`;
                case "react":
                    return `export async function generateMetadata({ params }) {
  const { ${paramsStr} } = params;
  return {
    openGraph: {
      images: [\`${origin}${dynamicUrl}\`],
    },
  };
}`;
                case "vue":
                    return `const { ${paramsStr} } = useRoute().params;

useHead({
  meta: [
    { property: 'og:image', content: \`${origin}${dynamicUrl}\` },
  ],
});`;
                case "html":
                default:
                    return `<!-- Replace variables with your data -->
<meta property="og:image" content="${origin}${dynamicUrl}" />`;
            }
        }
    });
</script>

<aside
    class="w-[300px] bg-sidebar border-l border-sidebar-border flex flex-col h-full text-sidebar-foreground"
>
    <!-- Top Section: Mode Toggle + URL -->
    <div class="p-4 flex flex-col gap-4 border-b border-sidebar-border">
        <div class="flex items-center justify-between">
            <h2
                class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
                Generated URL
            </h2>
        </div>

        <!-- Modern Toggle -->
        <div class="flex p-1 bg-muted/30 rounded-lg border border-sidebar-border">
            <button
                onclick={() => mode = "dynamic"}
                class="flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all {mode === 'dynamic'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'}"
            >
                Dynamic
            </button>
            <button
                onclick={() => mode = "fixed"}
                class="flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all {mode === 'fixed'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'}"
            >
                Fixed
            </button>
        </div>

        <!-- URL Display -->
        <div
            class="bg-muted/30 rounded-md border border-sidebar-border p-3 relative group"
        >
            <div
                class="text-[11px] font-mono text-foreground break-all leading-relaxed"
            >
                {#if mode === "fixed"}
                    <span class="text-muted-foreground">{origin}</span>{imageUrl}
                {:else}
                    <span class="text-muted-foreground">{origin}</span>{dynamicUrl}
                {/if}
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
    <div class="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
        <div>
            <h2
                class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3"
            >
                Integration
            </h2>

            <!-- Framework Selector -->
            <div class="relative mb-3">
                <button
                    onclick={() => frameworkOpen = !frameworkOpen}
                    class="w-full flex items-center justify-between px-3 py-2 text-xs bg-background border border-input hover:bg-accent/50 rounded-md transition-all"
                >
                    {#if selectedFrameworkInfo}
                        <span class="flex items-center gap-2 font-medium">
                            <svelte:component
                                this={selectedFrameworkInfo.icon}
                                size={14}
                                class="text-muted-foreground"
                            />
                            {selectedFrameworkInfo.name}
                        </span>
                    {/if}
                    <ChevronDown size={12} class="text-muted-foreground {frameworkOpen ? 'rotate-180' : ''} transition-transform" />
                </button>

                {#if frameworkOpen}
                    <div
                        transition:slide={{ duration: 100 }}
                        class="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg overflow-hidden"
                    >
                        {#each frameworks as fw}
                            <button
                                onclick={() => { selectedFramework = fw.id; frameworkOpen = false; }}
                                class="w-full px-3 py-2 text-xs text-left flex items-center gap-2 hover:bg-accent/50 {selectedFramework === fw.id ? 'text-foreground bg-accent/30' : 'text-muted-foreground'}"
                            >
                                <svelte:component
                                    this={fw.icon}
                                    size={14}
                                />
                                {fw.name}
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Code Snippet -->
            <div class="flex flex-col gap-2">
                <div
                    class="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5"
                >
                    <Code size={12} />
                    {selectedFrameworkInfo?.name}
                </div>
                <div
                    class="bg-muted/10 rounded-md border border-sidebar-border p-3 overflow-x-auto"
                >
                    <code
                        class="text-[10px] font-mono text-muted-foreground whitespace-pre block leading-relaxed"
                    >{snippet}</code>
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
