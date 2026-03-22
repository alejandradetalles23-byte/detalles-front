<script lang="ts">
  import { ProductCard } from "$lib/components";
  import { getProducts, type Product } from "$lib/db";
  import { onMount } from "svelte";
  
  let products = $state<Product[]>([]);
  let loading = $state(true);

  onMount(async () => {
    products = await getProducts();
    loading = false;
  });
</script>

<div class="max-w-7xl mx-auto px-4 md:px-12 py-16">
  <div class="mb-12">
    <h1 class="text-5xl font-black text-neutral-900 mb-4 font-serif leading-tight">Arreglos Florales</h1>
    <p class="text-neutral-500 font-medium">Explora nuestras categorías exclusivas diseñadas por Alejandra Detalles.</p>
  </div>

  {#if loading}
    <div class="h-64 flex items-center justify-center">
        <div class="w-12 h-12 border-4 border-brand-violet border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each products as product}
        <ProductCard {product} />
      {/each}
      {#if products.length === 0}
        <div class="col-span-full text-center py-24 bg-neutral-50 rounded-4xl border border-dashed border-neutral-200">
            <p class="text-neutral-400 font-bold uppercase tracking-widest">No hay arreglos disponibles actualmente</p>
        </div>
      {/if}
    </div>
  {/if}
</div>
