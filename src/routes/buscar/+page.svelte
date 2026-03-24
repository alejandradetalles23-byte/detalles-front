<script lang="ts">
  import { ProductCard } from "$lib/components";
  import { getProducts, type Product, getCategories, type Category } from "$lib/db";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  
  let products = $state<Product[]>([]);
  let categories = $state<Category[]>([]);
  let loading = $state(true);
  let query = $state("");

  let categoryId = $derived(page.url.searchParams.get("category"));

  onMount(async () => {
    const [p, c] = await Promise.all([getProducts(), getCategories()]);
    products = p;
    categories = c;
    loading = false;
  });

  let results = $derived(
    products.filter(p => {
        const matchesCategory = categoryId ? p.category_id?.toString() === categoryId : true;
        const matchesQuery = !query || 
                             p.title.toLowerCase().includes(query.toLowerCase()) || 
                             p.description.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
    })
  );
  let categoryName = $derived(categories.find(c => c.id.toString() === categoryId)?.name);
</script>

<div class="max-w-7xl mx-auto px-4 md:px-12 py-16">
  <div class="mb-12">
    <h1 class="text-5xl font-black mb-8 font-serif text-center leading-tight">
        {#if categoryName}
            Arreglos en: <span class="text-brand-rose-dark">{categoryName}</span>
        {:else}
            Encuentra el <span class="bg-clip-text text-transparent bg-linear-to-r from-brand-rose-dark to-brand-sky-dark">Arreglo Perfecto</span>
        {/if}
    </h1>
    
    <div class="max-w-2xl mx-auto relative group">
        <input 
            type="text" 
            bind:value={query}
            placeholder="Buscar por nombre o descripción..."
            class="w-full px-8 py-5 rounded-full bg-white border border-brand-blush shadow-xl shadow-brand-rose/5 focus:ring-8 focus:ring-brand-rose/10 focus:border-brand-rose outline-none transition-all text-xl font-bold pr-16"
        />
        <div class="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-brand-rose transition-all scale-125">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
    </div>
  </div>

  {#if loading}
    <div class="h-64 flex items-center justify-center">
        <div class="w-12 h-12 border-4 border-brand-rose border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if (query || categoryId) && results.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each results as product}
        <ProductCard {product} />
      {/each}
    </div>
  {:else if (query || categoryId) && results.length === 0}
    <div class="text-center py-24 bg-brand-blush/30 rounded-4xl border border-dashed border-brand-rose/20">
        <p class="text-neutral-400 text-xl font-black font-serif italic mb-2">"No hay resultados para esta búsqueda o categoría"</p>
        <p class="text-xs uppercase tracking-widest text-neutral-300 font-bold">¡Prueba con otras palabras o limpia la selección!</p>
    </div>
  {:else}
    <div class="text-center py-24 opacity-30 flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <p class="mt-4 text-neutral-500 font-bold">Escribe algo para empezar a buscar...</p>
    </div>
  {/if}
</div>
