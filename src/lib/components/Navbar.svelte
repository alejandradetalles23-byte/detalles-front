<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import { getSettings } from "$lib/db";

  let user_logged = $state(false);
  let mobileMenuOpen = $state(false);
  
  let logoUrl = $state<string | null>(null);
  let avatarUrl = $state<string | null>(null);
  let adminName = $state("Admin");

  onMount(async () => {
    user_logged = !!localStorage.getItem("token");
    const settings = await getSettings();
    if (settings) {
        logoUrl = settings.logo_url;
        avatarUrl = settings.admin_avatar_url;
        adminName = settings.admin_name || "Admin";
    }
  });

  function logout() {
    localStorage.removeItem("token");
    user_logged = false;
    window.location.href = "/";
  }

  const links = [
    { name: "Inicio", href: "/" },
    { name: "Arreglos", href: "/arreglos" },
    { name: "Categorías", href: "/categorias" },
    { name: "Búsqueda", href: "/buscar" },
    { name: "Nosotros", href: "/nosotros" },
  ];
</script>

<nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-100 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-20 items-center">
      <!-- Logo -->
      <div class="flex-shrink-0 flex items-center gap-2">
        <a href="/" class="group flex items-center gap-2">
          <div class="w-10 h-10 {logoUrl ? '' : 'bg-gradient-to-br from-brand-red via-brand-orange to-brand-violet'} rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform overflow-hidden shrink-0">
             {#if logoUrl}
                <img src={logoUrl} alt="Logo" class="w-full h-full object-cover bg-white" />
             {:else}
                AD
             {/if}
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
            class="text-neutral-600 hover:text-brand-orange font-bold transition-all {page.url.pathname === link.href ? 'text-brand-red border-b-2 border-brand-red' : ''}"
          >
            {link.name}
          </a>
        {/each}
      </div>

      <!-- Left items (Login/Logout) (Visible from 768px/md) -->
      <div class="hidden md:flex items-center gap-6">
        {#if user_logged}
          <div class="flex items-center gap-3">
            <a href="/dashboard" class="group flex items-center gap-2 px-1.5 py-1.5 pr-4 rounded-full border border-brand-violet/20 hover:bg-brand-violet/5 hover:border-brand-violet/40 transition-all shadow-sm">
                <div class="w-7 h-7 rounded-full bg-brand-violet/10 overflow-hidden flex items-center justify-center border border-white shrink-0 shadow-sm">
                    <img src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminName}`} alt="avatar" class="w-full h-full object-cover">
                </div>
                <span class="text-brand-violet text-sm font-bold truncate max-w-[120px] group-hover:text-brand-violet transition-colors">Panel {adminName}</span>
            </a>
            <button onclick={logout} class="px-2 py-2 text-neutral-400 hover:text-brand-red transition-all cursor-pointer rounded-full hover:bg-red-50" title="Cerrar Sesión">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </button>
          </div>
        {:else}
          <a href="/login" class="px-6 py-2.5 rounded-full bg-neutral-900 icon-glow text-white text-sm font-semibold hover:bg-neutral-800 transition-all shadow-md active:scale-95">
            Iniciar Sesión
          </a>
        {/if}
      </div>

      <!-- Mobile menu button (Hidden from 768px/md) -->
      <div class="md:hidden flex items-center gap-1">
        <button 
          onclick={() => mobileMenuOpen = !mobileMenuOpen} 
          class="p-2 text-black flex flex-col gap-1.5 focus:outline-none"
          aria-label="Menu"
        >
          <div class="w-7 h-1 bg-black rounded-full transition-all {mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}"></div>
          <div class="w-7 h-1 bg-black rounded-full transition-all {mobileMenuOpen ? 'opacity-0' : ''}"></div>
          <div class="w-7 h-1 bg-black rounded-full transition-all {mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}"></div>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu dropdown -->
  {#if mobileMenuOpen}
    <div class="md:hidden bg-white border-t border-neutral-100 shadow-xl animate-in slide-in-from-top duration-300">
      <div class="px-6 py-8 space-y-4">
        {#each links as link}
          <a
            href={link.href}
            onclick={() => mobileMenuOpen = false}
            class="block px-4 py-3 rounded-2xl text-lg font-bold text-neutral-700 hover:text-brand-violet transition-all {page.url.pathname === link.href ? 'text-brand-violet' : ''}"
          >
            {link.name}
          </a>
        {/each}
        
        <div class="pt-6 mt-6 border-t border-neutral-100 space-y-3">
             {#if user_logged}
                <a href="/dashboard" onclick={() => mobileMenuOpen = false} class="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-brand-violet/20 hover:bg-brand-violet/5 transition-colors">
                    <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm">
                        <img src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminName}`} alt="avatar" class="w-full h-full object-cover">
                    </div>
                    <span class="text-brand-violet font-black">Panel {adminName}</span>
                </a>
                <button onclick={logout} class="w-full text-center py-4 rounded-2xl text-red-600 font-bold hover:bg-red-50 cursor-pointer transition-colors">Cerrar Sesión</button>
             {:else}
                <a href="/login" onclick={() => mobileMenuOpen = false} class="block w-full text-center py-5 rounded-2xl bg-neutral-900 text-white font-black tracking-widest uppercase text-sm">Iniciar Sesión</a>
             {/if}
        </div>
      </div>
    </div>
  {/if}
</nav>

<style>
  /* Svelte 5 style section remains for custom tweaks if needed */
</style>
