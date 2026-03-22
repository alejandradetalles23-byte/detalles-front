<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import { ThemeToggle } from "$lib/components";
  
  let user_logged = $state(false);
  let mobileMenuOpen = $state(false);

  onMount(() => {
    user_logged = !!localStorage.getItem("token");
  });

  function logout() {
    localStorage.removeItem("token");
    user_logged = false;
    window.location.href = "/";
  }

  const links = [
    { name: "Inicio", href: "/" },
    { name: "Arreglos", href: "/arreglos" },
    { name: "Búsqueda", href: "/buscar" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Contacto", href: "/contacto" },
  ];
</script>

<nav class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-100 dark:border-neutral-800 transition-colors duration-500 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-20 items-center">
      <!-- Logo -->
      <div class="flex-shrink-0 flex items-center gap-2">
        <a href="/" class="group flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-brand-red via-brand-orange to-brand-violet rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
            AD
          </div>
          <span class="hidden lg:inline text-xl font-serif font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-red to-brand-violet whitespace-nowrap">
            Alejandra Detalles
          </span>
        </a>
      </div>

      <!-- Desktop Links (Visible from 768px/md) -->
      <div class="hidden md:flex flex-grow items-center justify-center lg:justify-start lg:ml-12 space-x-6 lg:space-x-8">
        {#each links as link}
          <a
            href={link.href}
            class="text-neutral-600 dark:text-neutral-400 hover:text-brand-orange dark:hover:text-brand-orange font-medium transition-colors {page.url.pathname === link.href ? 'text-brand-red dark:text-brand-red border-b-2 border-brand-red' : ''}"
          >
            {link.name}
          </a>
        {/each}
      </div>

      <!-- Left items (Login/Logout) (Visible from 768px/md) -->
      <div class="hidden md:flex items-center gap-6">
        <ThemeToggle />
        
        {#if user_logged}
          <div class="flex items-center gap-4">
            <a href="/dashboard" class="px-5 py-2.5 rounded-xl text-brand-violet text-sm font-bold hover:bg-brand-violet hover:text-white transition-all border border-brand-violet/20">
              Panel Admin
            </a>
            <button onclick={logout} class="px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-brand-red transition-all cursor-pointer">
              Cerrar Sesión
            </button>
          </div>
        {:else}
          <a href="/login" class="px-6 py-2.5 rounded-full bg-neutral-900 dark:bg-white dark:text-neutral-900 icon-glow text-white text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md active:scale-95">
            Iniciar Sesión
          </a>
        {/if}
      </div>

      <!-- Mobile menu button (Hidden from 768px/md) -->
      <div class="md:hidden flex items-center gap-1">
        <button 
          onclick={() => mobileMenuOpen = !mobileMenuOpen} 
          class="p-2 text-neutral-600 dark:text-neutral-300 flex flex-col gap-1.5 focus:outline-none"
          aria-label="Menu"
        >
          <div class="w-7 h-1 bg-neutral-900 dark:bg-white rounded-full transition-all {mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}"></div>
          <div class="w-7 h-1 bg-neutral-900 dark:bg-white rounded-full transition-all {mobileMenuOpen ? 'opacity-0' : ''}"></div>
          <div class="w-7 h-1 bg-neutral-900 dark:bg-white rounded-full transition-all {mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}"></div>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu dropdown -->
  {#if mobileMenuOpen}
    <div class="md:hidden bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 shadow-xl animate-in slide-in-from-top duration-300">
      <div class="px-6 py-8 space-y-4">
        <div class="flex justify-between items-center mb-6">
           <span class="text-xs font-black uppercase text-neutral-400 tracking-widest">Apariencia</span>
           <ThemeToggle />
        </div>
        {#each links as link}
          <a
            href={link.href}
            onclick={() => mobileMenuOpen = false}
            class="block px-4 py-3 rounded-2xl text-lg font-bold text-neutral-700 dark:text-neutral-200 hover:text-brand-violet transition-all {page.url.pathname === link.href ? 'text-brand-violet dark:text-brand-violet' : ''}"
          >
            {link.name}
          </a>
        {/each}
        
        <div class="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
             {#if user_logged}
                <a href="/dashboard" onclick={() => mobileMenuOpen = false} class="block w-full text-center py-4 rounded-2xl text-brand-violet font-black border border-brand-violet/20 hover:bg-brand-violet/5 transition-colors">PANEL ADMIN</a>
                <button onclick={logout} class="w-full text-center py-4 rounded-2xl text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer transition-colors">Cerrar Sesión</button>
             {:else}
                <a href="/login" onclick={() => mobileMenuOpen = false} class="block w-full text-center py-5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black tracking-widest uppercase text-sm">Iniciar Sesión</a>
             {/if}
        </div>
      </div>
    </div>
  {/if}
</nav>

<style>
  /* Svelte 5 style section remains for custom tweaks if needed */
</style>
