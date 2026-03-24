<script lang="ts">
  import { getSettings } from "$lib/db";
  import { onMount } from "svelte";

  let aboutText = $state("");

  onMount(async () => {
    const settings = await getSettings();
    if (settings) aboutText = settings.about_us || "";
  });
</script>

<div class="max-w-4xl mx-auto px-4 md:px-12 py-24 text-center">
  <h1 class="text-6xl font-black mb-8 font-serif leading-tight">
    Sobre <span class="bg-clip-text text-transparent bg-linear-to-r from-brand-rose-dark to-brand-sky-dark">Alejandra Detalles</span>
  </h1>
  <p class="text-2xl text-neutral-500 leading-loose mb-12">
    {aboutText || "Cargando nuestra historia..."}
  </p>
  <div
    class="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-brand-blush/50 mb-12"
  >
    <div class="space-y-4">
      <span class="text-5xl font-black text-brand-rose-dark">Fresco</span>
      <p class="text-sm font-bold uppercase tracking-widest text-neutral-400">
        Flores Seleccionadas
      </p>
    </div>
    <div class="space-y-4">
      <span class="text-5xl font-black text-brand-gold">Original</span>
      <p class="text-sm font-bold uppercase tracking-widest text-neutral-400">
        Diseños únicos
      </p>
    </div>
    <div class="space-y-4">
      <span class="text-5xl font-black text-brand-sky-dark">Rápido</span>
      <p class="text-sm font-bold uppercase tracking-widest text-neutral-400">
        Entrega Inmediata
      </p>
    </div>
  </div>
</div>
