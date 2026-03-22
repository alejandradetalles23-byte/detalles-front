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
            <div class="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
                <div class="absolute -right-8 -top-8 w-32 h-32 bg-green-50 rounded-full blur-3xl group-hover:bg-green-100/50 transition-all"></div>
                <div class="flex justify-between items-start">
                    <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 12 5 5L20 7"/></svg>
                    </div>
                </div>
                <div>
                    <span class="text-4xl font-black text-neutral-900">{stats.completed_sales}</span>
                    <p class="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mt-1">Ventas Completadas</p>
                </div>
            </div>

            <div class="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
                <div class="absolute -right-8 -top-8 w-32 h-32 bg-red-50 rounded-full blur-3xl"></div>
                <div class="flex justify-between items-start">
                    <div class="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </div>
                </div>
                <div>
                    <span class="text-4xl font-black text-neutral-900">{stats.cancelled_sales}</span>
                    <p class="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mt-1">Ventas Canceladas</p>
                </div>
            </div>

            <div class="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
                <div class="absolute -right-8 -top-8 w-32 h-32 bg-brand-violet/5 rounded-full blur-3xl"></div>
                <div class="flex justify-between items-start">
                    <div class="w-12 h-12 bg-brand-violet/10 rounded-2xl flex items-center justify-center text-brand-violet">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                </div>
                <div>
                    <span class="text-4xl font-black text-neutral-900">
                        {stats.most_viewed.reduce((acc, curr) => acc + curr.count, 0)}
                    </span>
                    <p class="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mt-1">Vistas Totales (Productos Top)</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Most Viewed (from API) -->
            <div class="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                <h3 class="text-xl font-bold text-neutral-900 mb-8 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V12m0 0a4.5 4.5 0 1 0 4.5 4.5M12 12a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5h.01"/></svg>
                    Arreglos más Vistos (Global)
                </h3>
                <div class="space-y-6">
                    {#each stats.most_viewed as item, i}
                        <div class="flex items-center justify-between group">
                            <div class="flex items-center gap-4">
                                <span class="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-xs font-black text-neutral-400 group-hover:bg-brand-violet group-hover:text-white transition-all">#{i+1}</span>
                                <span class="font-bold text-neutral-700">{item.name}</span>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="font-black text-neutral-900">{item.count}</span>
                            </div>
                        </div>
                    {/each}
                    {#if stats.most_viewed.length === 0}
                        <p class="text-neutral-400 text-sm italic">No hay datos de vistas aún.</p>
                    {/if}
                </div>
            </div>

            <!-- Mini Chart Visualization -->
            <div class="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm relative overflow-hidden">
                 <h3 class="text-xl font-bold text-neutral-900 mb-8">Tendencia de Vistas Top</h3>
                 <div class="h-48 flex items-end justify-between gap-2">
                    {#each stats.most_viewed as item, i}
                        <div class="flex-grow flex flex-col items-center gap-2">
                            <div class="w-full bg-brand-violet/10 rounded-t-xl group relative flex items-end justify-center" style="height: {Math.min(item.count * 10, 180)}px">
                                <div class="w-4/5 bg-brand-violet rounded-t-lg transition-all group-hover:bg-brand-orange h-0 group-hover:h-full animate-in slide-in-from-bottom"></div>
                            </div>
                        </div>
                    {/each}
                 </div>
            </div>
        </div>
    {/if}
</div>
