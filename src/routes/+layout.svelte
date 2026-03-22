<script lang="ts">
	import { Footer, Navbar } from '$lib/components';
	import './layout.css';
	let { children } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <title>Alejandra Detalles | Arreglos Florales</title>
</svelte:head>

<div class="min-h-screen flex flex-col selection:bg-brand-violet selection:text-white">
    <Navbar />
    
    <main class="flex-grow">
        {@render children()}
    </main>

    <footer class="bg-neutral-900 text-neutral-400 py-16 px-4 md:px-24">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="text-center md:text-left">
                <h3 class="text-2xl font-serif font-bold text-white mb-2">Alejandra Detalles</h3>
                <p class="text-sm max-w-xs">Creamos momentos inolvidables a través de la belleza de las flores.</p>
            </div>
            <div class="flex gap-8 text-sm">
                <a href="#" class="hover:text-white transition-colors">Términos</a>
                <a href="#" class="hover:text-white transition-colors">Privacidad</a>
                <a href="/login" class="hover:text-white transition-colors">Admin</a>
            </div>
            <div class="text-xs text-neutral-600">
                &copy; 2024 Alejandra Detalles Arreglos Florales. Todos los derechos reservados.
            </div>
        </div>
    </footer>
</div>
