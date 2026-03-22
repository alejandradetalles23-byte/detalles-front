<script lang="ts">
  import { API_URL, getCategories } from "$lib/db";
  import { onMount } from "svelte";
  
  let whatsapp = $state("");
  let aboutText = $state("");
  let adminName = $state("Administrador");
  let address = $state("Edo. Aragua, Venezuela");
  let mapsUrl = $state("");
  let logoUrl = $state<string | null>(null);
  let avatarUrl = $state<string | null>(null);
  
  let logoFile = $state<File | null>(null);
  let avatarFile = $state<File | null>(null);
  
  let saving = $state(false);
  let success = $state(false);
  let loading = $state(true);

  onMount(async () => {
    try {
        const res = await fetch(`${API_URL}/settings/`);
        const data = await res.json();
        whatsapp = data.whatsapp_number;
        aboutText = data.about_us;
        logoUrl = data.logo_url;
        avatarUrl = data.admin_avatar_url;
        adminName = data.admin_name || "Administrador";
        address = data.address || "Edo. Aragua, Venezuela";
        mapsUrl = data.maps_url || "";
    } catch (e) {
        console.error(e);
    } finally {
        loading = false;
    }
  });

  async function handleSave(e: SubmitEvent) {
    e.preventDefault();
    saving = true;
    
    const formData = new FormData();
    formData.append("whatsapp_number", whatsapp);
    formData.append("about_us", aboutText);
    formData.append("admin_name", adminName);
    formData.append("address", address);
    formData.append("maps_url", mapsUrl);
    if (logoFile) formData.append("logo", logoFile);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
        const res = await fetch(`${API_URL}/settings/`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            body: formData
        });
        
        if (res.ok) {
            success = true;
            const updated = await (await fetch(`${API_URL}/settings/`)).json();
            logoUrl = updated.logo_url;
            avatarUrl = updated.admin_avatar_url;
            setTimeout(() => success = false, 3000);
        }
    } catch (e) {
        console.error(e);
    } finally {
        saving = false;
    }
  }

  function handleFile(e: Event, type: 'logo' | 'avatar') {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        if (type === 'logo') logoFile = input.files[0];
        else avatarFile = input.files[0];
    }
  }
</script>

<div class="max-w-4xl space-y-12">
    {#if loading}
        <div class="h-64 flex items-center justify-center">
            <div class="w-12 h-12 border-4 border-brand-violet border-t-transparent rounded-full animate-spin"></div>
        </div>
    {:else}
    <div class="bg-white p-12 rounded-[3rem] border border-neutral-100 shadow-sm relative overflow-hidden group">
        <div class="absolute -top-32 -right-32 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl group-hover:bg-brand-orange/10 transition-all"></div>
        
        <h3 class="text-3xl font-black text-neutral-900 mb-2 font-serif flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-brand-orange"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Configuración General
        </h3>
        <p class="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mb-10 px-1">Personaliza tu perfil, marca y ubicación</p>

        {#if success}
            <div class="mb-8 p-4 bg-green-50 text-green-600 rounded-2xl font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 border border-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                Configuración guardada exitosamente
            </div>
        {/if}

        <form onsubmit={handleSave} class="space-y-10 relative">
            <!-- Media Upload Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                    <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest px-2">Logo Principal</label>
                    <div class="relative aspect-video bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center overflow-hidden group">
                        {#if logoUrl || logoFile}
                            <img src={logoFile ? URL.createObjectURL(logoFile) : logoUrl} alt="Logo" class="w-full h-full object-contain p-4" />
                        {:else}
                            <svg class="text-neutral-300" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        {/if}
                        <input type="file" accept="image/*" onchange={(e) => handleFile(e, 'logo')} class="absolute inset-0 opacity-0 cursor-pointer" />
                        <div class="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-xs font-black tracking-widest">CAMBIAR LOGO</div>
                    </div>
                </div>

                <div class="space-y-4">
                    <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest px-2">Avatar del Admin</label>
                    <div class="relative w-32 h-32 bg-neutral-50 rounded-full border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center overflow-hidden group mx-auto">
                        {#if avatarUrl || avatarFile}
                            <img src={avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl} alt="Avatar" class="w-full h-full object-cover" />
                        {:else}
                             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AleDet" alt="default avatar" class="w-full h-full opacity-50" />
                        {/if}
                        <input type="file" accept="image/*" onchange={(e) => handleFile(e, 'avatar')} class="absolute inset-0 opacity-0 cursor-pointer" />
                         <div class="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-[8px] font-black tracking-widest uppercase">Cambiar Foto</div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-neutral-100 pt-10">
                <div>
                    <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 px-2">Nombre del Administrador</label>
                    <input type="text" bind:value={adminName} required class="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 focus:border-brand-violet transition-all text-lg font-bold" />
                </div>
                <div>
                    <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 px-2">WhatsApp de Contacto</label>
                    <input type="text" bind:value={whatsapp} required class="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 focus:border-brand-violet transition-all text-xl font-bold font-mono" />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 px-2">Dirección Física</label>
                    <div class="flex items-center gap-4 group">
                         <div class="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-500 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <input type="text" bind:value={address} required class="flex-grow px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 focus:border-brand-violet transition-all text-lg font-bold" />
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 px-2">Enlace Google Maps</label>
                    <input type="url" bind:value={mapsUrl} placeholder="https://maps.app.goo.gl/..." class="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 focus:border-brand-violet transition-all text-sm font-medium" />
                </div>
            </div>

            <div>
                <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 px-2">Texto "Sobre Nosotros"</label>
                <textarea 
                    bind:value={aboutText} 
                    required 
                    rows="4"
                    class="w-full px-6 py-6 bg-neutral-50 border border-neutral-200 rounded-3xl outline-none focus:ring-4 focus:ring-brand-violet/10 focus:border-brand-violet transition-all text-lg leading-relaxed resize-none"
                ></textarea>
            </div>

            <div class="pt-6 border-t border-neutral-100 flex justify-end">
                <button 
                    type="submit" 
                    disabled={saving}
                    class="px-12 py-5 rounded-2xl bg-neutral-900 text-white font-black tracking-widest hover:bg-neutral-800 transition-all shadow-2xl disabled:opacity-50"
                >
                    {saving ? 'GUARDANDO...' : 'GUARDAR CONFIGURACIÓN AD'}
                </button>
            </div>
        </form>
    </div>
    {/if}
</div>
