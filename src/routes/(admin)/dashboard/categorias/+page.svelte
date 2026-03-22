<script lang="ts">
  import { API_URL, getCategories, type Category } from "$lib/db";
  import { onMount } from "svelte";

  let categories = $state<Category[]>([]);
  let newName = $state("");
  let loading = $state(true);
  let saving = $state(false);

  let editingId = $state<number | null>(null);
  let editName = $state("");

  async function updateCategory(id: number) {
    if (!editName) return;
    try {
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ name: editName })
        });
        if (res.ok) {
            editingId = null;
            await loadCategories();
        }
    } catch (e) {
        console.error(e);
    }
  }

  function startEdit(cat: Category) {
    editingId = cat.id;
    editName = cat.name;
  }

  async function loadCategories() {
    categories = await getCategories();
    loading = false;
  }

  onMount(() => {
    loadCategories();
  });

  async function addCategory(e: SubmitEvent) {
    e.preventDefault();
    if (!newName) return;
    saving = true;

    try {
        const res = await fetch(`${API_URL}/categories/`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ name: newName })
        });
        if (res.ok) {
            newName = "";
            await loadCategories();
        }
    } catch (e) {
        console.error(e);
    } finally {
        saving = false;
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm("¿Eliminar esta categoría? Se desvinculará de los arreglos.")) return;
    
    try {
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) await loadCategories();
    } catch (e) {
        console.error(e);
    }
  }
</script>

<div class="max-w-4xl space-y-8 sm:space-y-12">
    <div class="bg-white p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border border-neutral-100 shadow-sm">
        <h3 class="text-xl sm:text-3xl font-black text-neutral-900 mb-6 sm:mb-8 flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-brand-violet w-6 h-6 sm:w-8 sm:h-8"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
             Gestión de Categorías
        </h3>

        <form onsubmit={addCategory} class="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
            <input 
                type="text" 
                bind:value={newName} 
                placeholder="Nueva categoría (ej: Cumpleaños)" 
                class="flex-grow px-4 sm:px-6 py-3 sm:py-4 bg-neutral-50 border border-neutral-200 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 focus:border-brand-violet transition-all font-bold text-neutral-900 "
            />
            <button 
                type="submit" 
                disabled={saving || !newName}
                class="w-full sm:w-auto px-8 py-3 sm:py-4 bg-brand-violet text-white font-black rounded-xl sm:rounded-2xl shadow-lg disabled:opacity-50 hover:scale-[1.02] sm:hover:scale-105 transition-all"
            >
                {saving ? '...' : 'Añadir'}
            </button>
        </form>

        <div class="space-y-4">
            {#if loading}
                <p class="text-neutral-400 animate-pulse">Cargando categorías...</p>
            {:else}
                {#each categories as cat}
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-neutral-50 rounded-xl sm:rounded-2xl group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-neutral-100 gap-3 sm:gap-0">
                        {#if editingId === cat.id}
                            <input 
                                type="text" 
                                bind:value={editName} 
                                class="w-full sm:flex-grow px-3 py-2 bg-white border border-brand-violet rounded-lg sm:rounded-xl outline-none font-bold sm:mr-4 text-neutral-900"
                            />
                            <div class="flex justify-end gap-2">
                                <button onclick={() => updateCategory(cat.id)} class="p-2 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                                </button>
                                <button onclick={() => editingId = null} class="p-2 sm:p-2 text-neutral-400 hover:bg-neutral-100 rounded-lg shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                </button>
                            </div>
                        {:else}
                            <span class="text-lg sm:text-xl font-bold text-neutral-700 px-2 truncate leading-tight">{cat.name}</span>
                            <div class="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                    onclick={() => startEdit(cat)}
                                    class="p-2 sm:p-3 text-neutral-400 hover:text-brand-violet hover:bg-brand-violet/5 rounded-lg sm:rounded-xl transition-all shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                                </button>
                                <button 
                                    onclick={() => deleteCategory(cat.id)}
                                    class="p-2 sm:p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                            </div>
                        {/if}
                    </div>
                {/each}
                {#if categories.length === 0}
                    <p class="text-neutral-400 italic">No hay categorías creadas.</p>
                {/if}
            {/if}
        </div>
    </div>
</div>
