<script lang="ts">
  import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, type Product, type Category } from "$lib/db";
  import { onMount } from "svelte";

  let products = $state<Product[]>([]);
  let categories = $state<Category[]>([]);
  let loading = $state(true);
  let showModal = $state(false);
  let editingId = $state<number | null>(null);

  // Form states
  let title = $state("");
  let description = $state("");
  let price = $state(0);
  let categoryId = $state<number | null>(null);
  let files = $state<(File | null)[]>([null, null, null, null]);
  let saving = $state(false);

  onMount(async () => {
    await Promise.all([loadProducts(), loadCategories()]);
    loading = false;
  });

  async function loadProducts() {
    products = await getProducts();
  }

  async function loadCategories() {
    categories = await getCategories();
  }

  function openCreate() {
    editingId = null;
    title = "";
    description = "";
    price = 0;
    categoryId = null;
    files = [null, null, null, null];
    showModal = true;
  }

  function openEdit(p: Product) {
    editingId = p.id;
    title = p.title;
    description = p.description;
    price = p.price;
    categoryId = p.category_id || null;
    files = [null, null, null, null];
    showModal = true;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    saving = true;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());
    if (categoryId) formData.append("category_id", categoryId.toString());
    
    files.forEach((file, i) => {
        if (file) formData.append(`photo${i+1}`, file);
    });

    let success = false;
    if (editingId) {
        success = await updateProduct(editingId, formData);
    } else {
        success = await createProduct(formData);
    }

    if (success) {
        showModal = false;
        await loadProducts();
    }
    saving = false;
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este arreglo?")) return;
    if (await deleteProduct(id)) await loadProducts();
  }

  function handleFile(e: Event, index: number) {
    const input = e.target as HTMLInputElement;
    if (input.files) files[index] = input.files[0];
  }
</script>

<div class="space-y-8">
    <div class="flex justify-between items-center">
        <h3 class="text-3xl font-black text-neutral-900 flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-brand-violet"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
             Gestión de Arreglos
        </h3>
        <button 
            onclick={openCreate}
            class="px-8 py-4 bg-brand-violet text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
            Nuevo Arreglo
        </button>
    </div>

    {#if loading}
        <div class="h-64 flex items-center justify-center">
            <div class="w-12 h-12 border-4 border-brand-violet border-t-transparent rounded-full animate-spin"></div>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each products as p}
                <div class="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all">
                    <div class="aspect-square relative">
                        <img src={p.photos[0] || '/placeholder.png'} alt={p.title} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div class="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                            <button onclick={() => openEdit(p)} class="w-12 h-12 bg-white text-neutral-900 rounded-xl flex items-center justify-center hover:bg-brand-violet hover:text-white transition-all transform -translate-y-4 group-hover:translate-y-0 duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <button onclick={() => handleDelete(p.id)} class="w-12 h-12 bg-white text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-black text-neutral-900">{p.title}</h4>
                            <span class="text-brand-violet font-black">${p.price}</span>
                        </div>
                        <p class="text-xs text-neutral-400 font-bold uppercase tracking-widest">
                            {categories.find(c => c.id === p.category_id)?.name || 'Sin categoría'}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

{#if showModal}
    <div class="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <button onclick={() => showModal = false} class="absolute top-8 right-8 text-neutral-400 hover:text-neutral-900 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>

            <form onsubmit={handleSubmit} class="p-12 space-y-8">
                <h3 class="text-3xl font-black text-neutral-900 font-serif">
                    {editingId ? 'Editar Arreglo' : 'Nuevo Arreglo Floral'}
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 px-1">Título del Arreglo</label>
                            <input type="text" bind:value={title} required class="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 font-bold" />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 px-1">Precio ($)</label>
                                <input type="number" bind:value={price} required class="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 font-bold" />
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 px-1">Categoría</label>
                                <select bind:value={categoryId} class="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 font-bold appearance-none">
                                    <option value={null}>Sin categoría</option>
                                    {#each categories as cat}
                                        <option value={cat.id}>{cat.name}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 px-1">Descripción</label>
                            <textarea bind:value={description} required rows="4" class="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 font-medium resize-none"></textarea>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <label class="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 px-1">Fotos (Máximo 4)</label>
                        <div class="grid grid-cols-2 gap-4">
                            {#each [0, 1, 2, 3] as i}
                                <div class="aspect-square bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 relative overflow-hidden group">
                                    {#if files[i]}
                                        <img src={URL.createObjectURL(files[i]!)} alt="preview" class="w-full h-full object-cover" />
                                    {:else}
                                        <div class="absolute inset-0 flex flex-col items-center justify-center text-neutral-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                            <span class="text-[8px] font-black mt-2">FOTO {i+1}</span>
                                        </div>
                                    {/if}
                                    <input type="file" accept="image/*" onchange={(e) => handleFile(e, i)} class="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            {/each}
                        </div>
                        <p class="text-[9px] text-neutral-400 italic">Nota: Al editar, subir fotos nuevas reemplazará las anteriores.</p>
                    </div>
                </div>

                <div class="flex justify-end gap-4 pt-4">
                    <button type="button" onclick={() => showModal = false} class="px-8 py-4 text-neutral-400 font-black tracking-widest uppercase text-xs hover:text-neutral-900 transition-all">Cancelar</button>
                    <button type="submit" disabled={saving} class="px-10 py-4 btn-primary rounded-2xl shadow-xl disabled:opacity-50">
                        {saving ? 'GUARDANDO...' : editingId ? 'ACTUALIZAR' : 'CREAR ARREGLO'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
