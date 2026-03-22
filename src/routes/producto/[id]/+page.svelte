<script lang="ts">
  import { page } from "$app/state";
  import { getProduct, getWhatsAppLink, registerView, type Product } from "$lib/db";
  import { trackProductView } from "$lib/preferences";
  import { onMount } from "svelte";

  let product = $state<Product | null>(null);
  let loading = $state(true);
  let activePhoto = $state("");

  onMount(async () => {
    product = await getProduct(page.params.id);
    if (product) {
        activePhoto = product.photos[0];
        trackProductView(product.id); // Local tracking
        registerView(product.id);    // Backend tracking
    }
    loading = false;
  });

  const waLink = $derived(product ? getWhatsAppLink(product.title, product.price) : "");
</script>

{#if loading}
  <div class="h-[80vh] flex items-center justify-center">
    <div class="w-12 h-12 border-4 border-brand-violet border-t-transparent rounded-full animate-spin"></div>
  </div>
{:else if product}

<div class="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-24">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
    
    <!-- Left: Main Image & Thumbnails -->
    <div class="space-y-6">
      <div class="aspect-square bg-neutral-100 rounded-3xl overflow-hidden shadow-2xl border border-neutral-100">
        <img src={activePhoto} alt={product.title} class="w-full h-full object-cover" />
      </div>
      
      <div class="flex gap-4 overflow-x-auto pb-2">
        {#each product.photos as photo}
          <button 
            onclick={() => activePhoto = photo}
            class="w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all {activePhoto === photo ? 'border-brand-red ring-4 ring-brand-red/10' : 'border-transparent opacity-60 hover:opacity-100'}"
          >
            <img src={photo} alt="thumbnail" class="w-full h-full object-cover" />
          </button>
        {/each}
      </div>
    </div>

    <!-- Right: Product Info -->
    <div class="flex flex-col h-full py-4">
      <nav class="flex text-sm font-medium text-neutral-400 mb-6 gap-2">
        <a href="/" class="hover:text-brand-orange text-xs uppercase tracking-widest font-bold">Inicio</a>
        <span>/</span>
        <a href="/arreglos" class="hover:text-brand-orange">Arreglos</a>
        <span>/</span>
        <span class="text-neutral-900">{product.title}</span>
      </nav>

      <h1 class="text-5xl md:text-6xl font-black text-neutral-900 mb-4 font-serif">{product.title}</h1>
      <p class="text-3xl font-bold text-brand-red mb-8">${product.price.toFixed(2)}</p>
      
      <div class="bg-neutral-50 rounded-2xl p-8 mb-8 border border-neutral-100">
        <h3 class="font-bold text-neutral-900 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Descripción del Arreglo
        </h3>
        <p class="text-neutral-600 leading-relaxed text-lg">
          {product.description}
          <br><br>
          Nuestros expertos floristas seleccionan meticulosamente cada pétalo para asegurar la frescura y elegancia que buscas. Este arreglo es ideal para aniversarios, cumpleaños o simplemente para decir "te quiero".
        </p>
      </div>

      <div class="mt-auto space-y-4">
        <a 
          href={waLink}
          target="_blank"
          class="flex items-center justify-center gap-3 w-full py-5 rounded-[2rem] bg-gradient-to-r from-red-600 to-blue-600 text-white font-black text-lg tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-red-600/30 font-sans"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.98zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          REALIZAR PEDIDO
        </a>
        <p class="text-center text-sm text-neutral-400">Atención personalizada inmediata</p>
      </div>
    </div>
  </div>
</div>
{:else}
<div class="h-[60vh] flex flex-col items-center justify-center gap-4">
    <p class="text-2xl font-black text-neutral-900 font-serif">Arreglo no encontrado</p>
    <a href="/" class="px-6 py-3 rounded-full bg-neutral-900 text-white font-bold">Volver al inicio</a>
</div>
{/if}
