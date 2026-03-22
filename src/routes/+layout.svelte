<script lang="ts">
  import { Footer, Navbar } from "$lib/components";
  import "./layout.css";
  let { children } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
  <title>Alejandra Detalles | Arreglos Florales</title>
</svelte:head>

<div
  class="min-h-screen flex flex-col selection:bg-brand-violet selection:text-white"
>
  <Navbar />

  <main class="flex-grow">
    {@render children()}
  </main>

  <Footer />
</div>
