<script lang="ts">
  import { ProductCard } from "$lib/components";
  import { getProducts, type Product } from "$lib/db";
  import { onMount } from "svelte";
  
  let products = $state<Product[]>([]);
  let loading = $state(true);
  let query = $state("");
  
  onMount(async () => {
    products = await getProducts();
    loading = false;
  });

  let results = $derived(
    products.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())
    )
  );
</script>

<div class="max-w-7xl mx-auto px-4 md:px-12 py-16">
  <div class="mb-12">
    <h1 class="text-5xl font-black mb-8 font-serif text-center leading-tight">Encuentra el Arreglo Perfecto</h1>
    
    <div class="max-w-2xl mx-auto relative group">
        <input 
            type="text" 
            bind:value={query}
            placeholder="Buscar por nombre o descripción..."
            class="w-full px-8 py-5 rounded-full bg-white border border-neutral-100 shadow-2xl focus:ring-8 focus:ring-brand-orange/5 focus:border-brand-orange outline-none transition-all text-xl font-bold pr-16"
        />
        <div class="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-brand-orange transition-all scale-125">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
    </div>
  </div>

  {#if loading}
    <div class="h-64 flex items-center justify-center">
        <div class="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if query && results.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {#each results as product}
        <ProductCard {product} />
      {/each}
    </div>
  {:else if query && results.length === 0}
    <div class="text-center py-24 bg-neutral-50 rounded-4xl border border-dashed border-neutral-200">
        <p class="text-neutral-400 text-xl font-black font-serif italic mb-2">"No hay resultados para esta búsqueda"</p>
        <p class="text-xs uppercase tracking-widest text-neutral-300 font-bold">¡Prueba con otras palabras o colores!</p>
    </div>
  {:else}
    <div class="text-center py-24 opacity-30 flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <p class="mt-4 text-neutral-500 font-bold">Escribe algo para empezar a buscar...</p>
    </div>
  {/if}
</div>
