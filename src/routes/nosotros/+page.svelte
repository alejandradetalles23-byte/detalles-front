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
  <h1 class="text-6xl font-black text-neutral-900 dark:text-neutral-50 mb-8 font-serif">
    Sobre Alejandra Detalles
  </h1>
  <p class="text-2xl text-neutral-500 dark:text-neutral-400 leading-loose mb-12">
    {aboutText || "Cargando nuestra historia..."}
  </p>
  <div
    class="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-neutral-100 dark:border-neutral-800 mb-12"
  >
    <div class="space-y-4">
      <span class="text-5xl font-black text-brand-red">Fresco</span>
      <p class="text-sm font-bold uppercase tracking-widest text-neutral-400">
        Flores Seleccionadas
      </p>
    </div>
    <div class="space-y-4">
      <span class="text-5xl font-black text-brand-orange">Original</span>
      <p class="text-sm font-bold uppercase tracking-widest text-neutral-400">
        Diseños únicos
      </p>
    </div>
    <div class="space-y-4">
      <span class="text-5xl font-black text-brand-violet">Rápido</span>
      <p class="text-sm font-bold uppercase tracking-widest text-neutral-400">
        Entrega Inmediata
      </p>
    </div>
  </div>
</div>
