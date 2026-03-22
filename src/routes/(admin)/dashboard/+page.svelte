<script lang="ts">
  import { getStats, type Stats } from "$lib/db";
  import { onMount } from "svelte";

  let stats = $state<Stats | null>(null);
  let loading = $state(true);

  onMount(async () => {
    stats = await getStats();
    loading = false;
  });
</script>

<div class="space-y-12 max-w-7xl">
    {#if loading}
        <div class="h-64 flex items-center justify-center">
            <div class="w-12 h-12 border-4 border-brand-violet border-t-transparent rounded-full animate-spin"></div>
        </div>
    {:else if stats}
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <div class="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group ">
                <div class="absolute -right-8 -top-8 w-32 h-32 bg-brand-violet/5 rounded-full blur-3xl transition-all"></div>
                <div class="flex justify-between items-start">
                    <div class="w-12 h-12 bg-brand-violet/10 rounded-2xl flex items-center justify-center text-brand-violet ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                </div>
                <div>
                    <span class="text-4xl font-black text-neutral-900 ">
                        {stats.most_viewed.reduce((acc, curr) => acc + curr.count, 0)}
                    </span>
                    <p class="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mt-1">Vistas Totales (Productos Top)</p>
                </div>
            </div>

            <!-- Likes Totales -->
            <div class="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group ">
                <div class="absolute -right-8 -top-8 w-32 h-32 bg-red-50 rounded-full blur-3xl transition-all"></div>
                <div class="flex justify-between items-start">
                    <div class="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </div>
                </div>
                <div>
                    <span class="text-4xl font-black text-neutral-900 ">
                        {stats.most_liked.reduce((acc, curr) => acc + curr.count, 0)}
                    </span>
                    <p class="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mt-1">Likes Recibidos (Productos Top)</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Most Viewed (from API) -->
            <div class="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm ">
                <h3 class="text-xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V12m0 0a4.5 4.5 0 1 0 4.5 4.5M12 12a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5h.01"/></svg>
                    Arreglos más Vistos
                </h3>
                <div class="space-y-6">
                    {#each stats.most_viewed as item, i}
                        <div class="flex items-center justify-between group">
                            <div class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-xs font-black text-neutral-400 group-hover:bg-brand-violet group-hover:text-white transition-all">#{i+1}</span>
                                <span class="font-bold text-neutral-700 ">{item.name}</span>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="font-black text-neutral-900 ">{item.count}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Most Liked (new) -->
            <div class="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm ">
                <h3 class="text-xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    Arreglos con más "Me gusta"
                </h3>
                <div class="space-y-6">
                    {#each stats.most_liked as item, i}
                        <div class="flex items-center justify-between group">
                            <div class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-xs font-black text-neutral-400 group-hover:bg-red-500 group-hover:text-white transition-all">#{i+1}</span>
                                <span class="font-bold text-neutral-700 ">{item.name}</span>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="font-black text-neutral-900 ">{item.count}</span>
                            </div>
                        </div>
                    {/each}
                    {#if stats.most_liked.length === 0}
                        <p class="text-neutral-400 text-sm italic">Sin "me gusta" registrados.</p>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>
