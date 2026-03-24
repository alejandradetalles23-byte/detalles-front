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

  // Swipe logic para móviles
  let touchStartX = 0;
  let touchEndX = 0;
  
  function handleTouchStart(e: TouchEvent) {
      touchStartX = e.changedTouches[0].screenX;
  }
  
  function handleTouchEnd(e: TouchEvent) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
  }
  
  function handleSwipe() {
      if (touchEndX < touchStartX - 50) next();
      if (touchEndX > touchStartX + 50) prev();
  }
</script>

<div 
  class="relative w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-brand-rose/10 bg-neutral-900 group aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9]"
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
>
  {#each items as item, i}
    <div 
        class="absolute inset-0 transition-all duration-1000 ease-in-out transform {i === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}"
    >
        <img 
            src={item.photos[0]} 
            alt={item.title} 
            class="w-full h-full object-cover opacity-60 scale-105"
        />
        <div class="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-[#2d2235]/90 via-[#2d2235]/60 to-transparent flex items-end md:items-center px-6 py-20 md:py-0 md:px-24">
            <div class="max-w-2xl w-full text-center md:text-left mb-8 md:mb-0">
                <span class="text-brand-gold text-xs md:text-base font-bold tracking-widest uppercase mb-3 md:mb-4 block">Oferta Exclusiva</span>
                <h2 class="text-4xl sm:text-5xl md:text-7xl font-serif font-black text-white mb-4 md:mb-6 leading-tight drop-shadow-lg md:drop-shadow-none">
                    {item.title}
                </h2>
                <div class="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <span class="text-3xl md:text-4xl font-bold text-brand-rose-dark md:text-white drop-shadow-md md:drop-shadow-none">${item.price.toFixed(2)}</span>
                    <a 
                        href="/producto/{item.id}"
                        class="px-8 py-3.5 md:py-4 rounded-full bg-linear-to-r from-brand-rose to-brand-sky text-white font-bold hover:shadow-lg hover:shadow-brand-rose/30 transition-all shadow-xl active:scale-95 text-sm md:text-base w-full md:w-auto"
                    >
                        Ver Arreglo
                    </a>
                </div>
            </div>
        </div>
    </div>
  {/each}

  <!-- Controls (Desktop Only) -->
  <button 
    onclick={prev}
    class="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white items-center justify-center hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  <button 
    onclick={next}
    class="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white items-center justify-center hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>

  <!-- Dots -->
  <div class="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
    {#each items as _, i}
      <button 
        onclick={() => currentIndex = i}
        class="w-2.5 h-2.5 rounded-full transition-all duration-300 {i === currentIndex ? 'bg-brand-rose w-6 md:w-8' : 'bg-white/40 hover:bg-white/60'}"
      ></button>
    {/each}
  </div>
</div>
