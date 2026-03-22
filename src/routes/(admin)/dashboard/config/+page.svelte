<script lang="ts">
  import { API_URL, getCategories } from "$lib/db";
  import { onMount } from "svelte";
  
  let whatsapp = $state("");
  let aboutText = $state("");
  let adminName = $state("Administrador");
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
        <p class="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mb-10 px-1">Personaliza tu perfil y marca Alejandra Detalles</p>

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

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 px-2">Nombre del Administrador</label>
                    <input type="text" bind:value={adminName} required class="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 focus:border-brand-violet transition-all text-lg font-bold" />
                </div>
                <div>
                    <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 px-2">WhatsApp de Contacto</label>
                    <div class="flex items-center gap-4 group">
                        <div class="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shrink-0 shadow-sm transition-all group-focus-within:bg-green-500 group-focus-within:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.98zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        </div>
                        <input type="text" bind:value={whatsapp} required class="flex-grow px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 focus:border-brand-violet transition-all text-xl font-bold font-mono" />
                    </div>
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
