<script lang="ts">
    import { onMount } from "svelte";
    import { API_URL } from "$lib/db";

    let address = $state("Edo. Aragua, Venezuela");
    let mapsUrl = $state("");
    let whatsapp = $state("");

    onMount(async () => {
        try {
            const res = await fetch(`${API_URL}/settings/`);
            const data = await res.json();
            address = data.address || "Edo. Aragua, Venezuela";
            mapsUrl = data.maps_url || "";
            whatsapp = data.whatsapp_number || "";
        } catch (e) {
            console.error("Footer settings fetch error:", e);
        }
    });

    const formatWhatsapp = (num: string) => {
        return `https://wa.me/${num.replace(/[^0-9]/g, '')}`;
    };
</script>

<footer class="bg-neutral-900 text-neutral-400 py-20 px-4 md:px-12 border-t border-neutral-800 relative z-20">
    <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 px-4">
            <div class="col-span-1 md:col-span-2 space-y-6">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-brand-red via-brand-orange to-brand-violet rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        AD
                    </div>
                    <span class="text-3xl font-serif font-black text-white tracking-tight">Ale-Det</span>
                </div>
                <p class="text-lg max-w-sm font-medium leading-relaxed">
                    Transformamos sentimientos en arte floral. En Ale-Det cada pétalo cuenta una historia de frescura y elegancia.
                </p>
                <div class="flex gap-4">
                    <!-- Social Icons Mockups -->
                    <button class="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-brand-red hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></button>
                    <button class="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></button>
                </div>
            </div>
            
            <div class="space-y-6">
                <h4 class="text-white font-bold uppercase tracking-widest text-sm">Explora</h4>
                <ul class="space-y-4">
                    <li><a href="/" class="hover:text-brand-orange transition-colors">Inicio</a></li>
                    <li><a href="/arreglos" class="hover:text-brand-orange transition-colors">Arreglos</a></li>
                    <li><a href="/nosotros" class="hover:text-brand-orange transition-colors">Sobre Nosotros</a></li>
                    <li><a href="/login" class="hover:text-brand-orange transition-colors">Admin Panel</a></li>
                </ul>
            </div>

            <div class="space-y-6">
                <h4 class="text-white font-bold uppercase tracking-widest text-sm">Contacto</h4>
                <ul class="space-y-4">
                    <li>
                        {#if mapsUrl}
                            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" class="flex items-start gap-3 hover:text-white transition-colors group">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="group-hover:scale-110 transition-transform"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span class="leading-tight">{address}</span>
                            </a>
                        {:else}
                            <div class="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span class="leading-tight">{address}</span>
                            </div>
                        {/if}
                    </li>
                    <li>
                        {#if whatsapp}
                             <a href={formatWhatsapp(whatsapp)} target="_blank" rel="noopener noreferrer" class="flex items-start gap-3 text-brand-orange font-bold hover:scale-105 transition-transform origin-left">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                WhatsApp Directo
                            </a>
                        {/if}
                    </li>
                </ul>
            </div>
        </div>

        <div class="pt-12 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p class="text-sm">© 2024 Alejandra Detalles. Todos los derechos reservados.</p>
            <div class="flex items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-tighter">Hecho con</span>
                <span class="text-brand-red">❤</span>
                <span class="text-xs font-bold uppercase tracking-tighter">para ti</span>
            </div>
        </div>
    </div>
</footer>
