<script lang="ts">
  import { onMount } from "svelte";
  import { getSettings } from "$lib/db";
  import "../../layout.css";
  
  let { children } = $props();
  let username = $state("Administrador");
  let avatarUrl = $state<string | null>(null);

  onMount(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return;
    }
    
    const settings = await getSettings();
    if (settings) {
        username = settings.admin_name || "Administrador";
        avatarUrl = settings.admin_avatar_url;
    }
  });

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
</script>

<div class="min-h-screen bg-brand-blush/20 flex">
  <!-- Sidebar -->
  <aside class="w-64 bg-white/80 backdrop-blur-xl border-r border-brand-blush/40 flex flex-col hidden md:flex">
    <div class="p-8 border-b border-brand-blush/30 flex items-center gap-3">
        <div class="w-10 h-10 bg-linear-to-br from-brand-rose to-brand-sky rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-rose/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V12m0 0a4.5 4.5 0 1 0 4.5 4.5M12 12a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5h.01"/></svg>
        </div>
        <span class="font-serif font-black text-lg text-neutral-800 leading-tight">Alejandra Detalles<br><span class="text-[9px] font-sans font-extrabold text-neutral-400 uppercase tracking-tighter">Panel de Administración</span></span>
    </div>

    <nav class="flex-grow p-6 space-y-2">
        <a href="/dashboard" class="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-blush/40 font-bold text-neutral-600 hover:text-brand-rose-dark transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Resumen
        </a>
        <a href="/dashboard/arreglos" class="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-blush/40 font-bold text-neutral-600 hover:text-brand-rose-dark transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
            Arreglos
        </a>
        <a href="/dashboard/categorias" class="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-blush/40 font-bold text-neutral-600 hover:text-brand-rose-dark transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            Categorías
        </a>
        <a href="/dashboard/perfil" class="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-blush/40 font-bold text-neutral-600 hover:text-brand-rose-dark transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Perfil
        </a>
        <a href="/dashboard/config" class="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-blush/40 font-bold text-neutral-600 hover:text-brand-rose-dark transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Configuración
        </a>
    </nav>

    <div class="mt-auto p-6 space-y-4">
        <a href="/" class="flex items-center gap-3 p-3 rounded-xl bg-brand-blush/40 font-bold text-neutral-600 hover:bg-brand-blush transition-all text-sm">
            Ver Tienda
        </a>
        <button onclick={logout} class="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 font-bold text-red-400 hover:bg-red-100 transition-all text-sm cursor-pointer">
            Cerrar Sesión
        </button>
    </div>
  </aside>

  <!-- Mobile Sidebar (Floating Bottom) -->
  <nav class="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-brand-blush/50 rounded-[2.5rem] shadow-2xl shadow-brand-rose/10 z-50 p-2 flex justify-around items-center">
    <a href="/dashboard" class="p-4 rounded-3xl text-neutral-400 hover:text-brand-rose-dark transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
    </a>
    <a href="/dashboard/arreglos" class="p-4 rounded-3xl text-neutral-400 hover:text-brand-rose-dark transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
    </a>
    <a href="/dashboard/categorias" class="p-4 rounded-3xl text-neutral-400 hover:text-brand-rose-dark transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
    </a>
    <a href="/dashboard/config" class="p-4 rounded-3xl text-neutral-400 hover:text-brand-rose-dark transition-all">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
    </a>
  </nav>

  <!-- Main Content -->
  <main class="flex-grow p-6 md:p-12 overflow-y-auto pb-32 md:pb-12">
    <header class="flex justify-between items-center mb-10 md:mb-12">
        <div class="flex items-center gap-4">
            <div class="md:hidden w-10 h-10 bg-linear-to-br from-brand-rose to-brand-sky rounded-xl flex items-center justify-center text-white ring-4 ring-brand-rose/10">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V12m0 0a4.5 4.5 0 1 0 4.5 4.5M12 12a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5h.01"/></svg>
            </div>
            <div>
                <h2 class="text-2xl md:text-3xl font-black text-neutral-800 tracking-tight leading-none">Panel AD</h2>
                <p class="text-neutral-400 font-bold uppercase tracking-widest text-[9px] mt-2">Hola, {username}</p>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <div class="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-brand-blush/50 border-2 border-white shadow-sm flex items-center justify-center">
                <img src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt="avatar" class="w-full h-full object-cover" />
            </div>
        </div>
    </header>

    {@render children()}
  </main>
</div>
