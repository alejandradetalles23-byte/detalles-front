<script lang="ts">
  import type { Product } from "$lib/db";
  
  interface Props {
    items: Product[];
  }
  let { items }: Props = $props();

  let currentIndex = $state(0);
  
  const next = () => currentIndex = (currentIndex + 1) % items.length;
  const prev = () => currentIndex = (currentIndex - 1 + items.length) % items.length;

  // Auto-slide 
  $effect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  });
</script>

<div class="relative w-full overflow-hidden rounded-[2rem] shadow-2xl bg-neutral-900 group aspect-[16/9] md:aspect-[21/9]">
  {#each items as item, i}
    <div 
        class="absolute inset-0 transition-all duration-1000 ease-in-out transform {i === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}"
    >
        <img 
            src={item.photos[0]} 
            alt={item.title} 
            class="w-full h-full object-cover opacity-60 scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-8 md:px-24">
            <div class="max-w-2xl animate-in fade-in slide-in-from-left duration-1000">
                <span class="text-brand-orange text-sm md:text-base font-bold tracking-widest uppercase mb-4 block">Oferta Exclusiva</span>
                <h2 class="text-4xl md:text-7xl font-serif font-black text-white mb-6 leading-tight">
                    {item.title}
                </h2>
                <div class="flex items-center gap-6">
                    <span class="text-3xl md:text-4xl font-bold text-white">${item.price.toFixed(2)}</span>
                    <a 
                        href="/producto/{item.id}"
                        class="px-8 py-4 rounded-full bg-white text-neutral-900 font-bold hover:bg-neutral-100 transition-all shadow-xl active:scale-95"
                    >
                        Ver Arreglo
                    </a>
                </div>
            </div>
        </div>
    </div>
  {/each}

  <!-- Controls -->
  <button 
    onclick={prev}
    class="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  <button 
    onclick={next}
    class="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>

  <!-- Dots -->
  <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
    {#each items as _, i}
      <button 
        onclick={() => currentIndex = i}
        class="w-2.5 h-2.5 rounded-full transition-all duration-300 {i === currentIndex ? 'bg-brand-red w-8' : 'bg-white/40 hover:bg-white/60'}"
      ></button>
    {/each}
  </div>
</div>
