<script lang="ts">
  import { getCategories, getProducts, type Category, type Product } from "$lib/db";
  import { onMount } from "svelte";

  let loading = $state(true);
  let categoriesWithImage = $state<{id: number, name: string, image: string | null}[]>([]);

  onMount(async () => {
    try {
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        categoriesWithImage = cats.map((cat: Category) => {
            const prod = prods.find((p: Product) => p.category_id === cat.id && p.photos && p.photos.length > 0);
            return {
                id: cat.id,
                name: cat.name,
                image: prod ? prod.photos[0] : null
            };
        });
    } catch (e) {
        console.error(e);
    } finally {
        loading = false;
    }
  });
</script>

<div class="max-w-7xl mx-auto px-4 md:px-12 py-16">
    <div class="mb-16 text-center">
        <h1 class="text-5xl font-black mb-4 font-serif text-neutral-800 leading-tight">Nuestras <span class="bg-clip-text text-transparent bg-linear-to-r from-brand-rose-dark to-brand-sky-dark">Categorías</span></h1>
        <p class="text-neutral-500 font-medium text-lg max-w-2xl mx-auto">Explora nuestras creaciones florales organizadas por ocasión. Encuentra exactamente lo que buscas para ese momento especial.</p>
    </div>

    {#if loading}
        <div class="h-64 flex items-center justify-center">
            <div class="w-12 h-12 border-4 border-brand-rose border-t-transparent rounded-full animate-spin"></div>
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {#each categoriesWithImage as cat}
                <a 
                    href="/buscar?category={cat.id}" 
                    class="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-rose/10 transition-all duration-300 border border-brand-blush/60 transform hover:-translate-y-2"
                >
                    <div class="aspect-square bg-brand-blush/30 relative overflow-hidden">
                        {#if cat.image}
                            <img src={cat.image} alt={cat.name} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        {:else}
                            <div class="w-full h-full flex flex-col items-center justify-center text-brand-rose/30 p-6 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mb-4"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/></svg>
                                <span class="text-xs uppercase tracking-widest font-bold">Sin Imagen</span>
                            </div>
                        {/if}
                        <div class="absolute inset-0 bg-linear-to-t from-[#2d2235]/80 via-[#2d2235]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        <div class="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                            <h3 class="text-2xl font-black text-white drop-shadow-lg">{cat.name}</h3>
                            <div class="flex items-center gap-2 mt-2 text-brand-rose opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                <span class="text-sm font-bold uppercase tracking-widest">Ver Arreglos</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </div>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
        
        {#if categoriesWithImage.length === 0}
            <div class="text-center py-24 bg-brand-blush/30 rounded-4xl border border-dashed border-brand-rose/20">
                <p class="text-neutral-400 text-xl font-black font-serif italic mb-2">"Aún no hay categorías creadas"</p>
            </div>
        {/if}
    {/if}
</div>
