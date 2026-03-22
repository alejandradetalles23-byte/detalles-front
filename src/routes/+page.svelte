<script lang="ts">
  import { Carousel, ProductCard } from "$lib/components";
  import { getProducts, type Product, getSettings } from "$lib/db";
  import { onMount } from "svelte";

  let products = $state<Product[]>([]);
  let loading = $state(true);
  let whatsapp = $state("");

  onMount(async () => {
    const [prods, settings] = await Promise.all([getProducts(), getSettings()]);
    products = prods;
    if (settings) whatsapp = settings.whatsapp_number || "";
    loading = false;
  });

  const getWhatsappUrl = (num: string) => {
    return `https://wa.me/${num.replace(/[^0-9]/g, "")}`;
  };
</script>

<div class="px-4 md:px-12 py-8 max-w-7xl mx-auto space-y-16 mb-24 transition-colors duration-500">
  {#if loading}
    <div class="h-[60vh] flex items-center justify-center">
      <div
        class="w-12 h-12 border-4 border-brand-violet border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
  {:else}
    <!-- Hero Carousel -->
    {#if products.length > 0}
      <Carousel items={products} />
    {/if}

    <!-- Products Section -->
    <section id="productos">
      <div
        class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
      >
        <div>
          <h2
            class="text-4xl md:text-5xl font-black text-neutral-900 mb-4 tracking-tight"
          >
            Nuestros Arreglos
          </h2>
          <p class="text-neutral-500 max-w-lg font-medium">
            Descubre nuestra colección para cada ocasión especial.
          </p>
        </div>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
      >
        {#each products as product}
          <ProductCard {product} />
        {/each}
      </div>
    </section>
  {/if}

  <!-- CTA Section -->
  <section
    class="bg-gradient-to-br from-brand-red/90 via-brand-orange to-brand-violet rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-white/10 opacity-20 pointer-events-none"
    ></div>
    <h2 class="text-4xl md:text-6xl font-black mb-8 relative z-10">
      ¿Buscas algo personalizado?
    </h2>
    <p class="text-xl opacity-90 mb-12 max-w-2xl mx-auto relative z-10">
      Contáctanos directamente por WhatsApp y diseñaremos el arreglo perfecto
      para ti.
    </p>
    <a
      href={getWhatsappUrl(whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block px-10 py-5 bg-white text-neutral-900 rounded-full font-black text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95 relative z-10"
    >
      Hablar con Florista
    </a>
  </section>
</div>
