<script lang="ts">
  import type { Product } from "$lib/db";
  import { getWhatsAppLink, registerLike } from "$lib/db";
  import { onMount } from "svelte";

  interface Props {
    product: Product;
  }
  let { product }: Props = $props();
  let liked = $state(false);

  onMount(() => {
    liked = localStorage.getItem(`liked_${product.id}`) === 'true';
  });

  async function toggleLike() {
    if (liked) return; 
    liked = true;
    localStorage.setItem(`liked_${product.id}`, 'true');
    await registerLike(product.id);
  }

  const waLink = getWhatsAppLink(product.title, product.price);
</script>

<div class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 flex flex-col h-full transform hover:-translate-y-1">
  <!-- Image -->
  <div class="relative aspect-[4/5] overflow-hidden">
    <a href="/producto/{product.id}" class="block w-full h-full">
        <img
        src={product.photos[0]}
        alt={product.title}
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
    </a>
    
    <!-- Heart Button -->
    <button 
        onclick={toggleLike}
        class="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 {liked ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm text-neutral-400 hover:text-red-500 hover:scale-110'}"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
    </button>

    <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <span class="text-white text-sm font-medium">Ver detalles</span>
    </div>
  </div>

  <!-- Content -->
  <div class="p-6 flex flex-col flex-grow">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-bold text-neutral-800 line-clamp-1">{product.title}</h3>
      <span class="text-lg font-bold text-brand-red">${product.price.toFixed(2)}</span>
    </div>
    <p class="text-neutral-500 text-sm line-clamp-2 mb-6 flex-grow">
      {product.description}
    </p>

    <!-- Button -->
    <a
      href={waLink}
      target="_blank"
      class="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 text-white font-black text-sm tracking-wide transition-all active:scale-[0.98] shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
         <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.98zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
      PEDIR POR WHATSAPP
    </a>
  </div>
</div>
