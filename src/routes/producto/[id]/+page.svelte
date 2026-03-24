<script lang="ts">
  import { page } from "$app/state";
  import {
    getProduct, getWhatsAppLink, registerView, registerLike, registerUnlike,
    isLiked, saveLike, removeLike, getComments, postComment,
    type Product, type Comment
  } from "$lib/db";
  import { trackProductView } from "$lib/preferences";
  import { onMount } from "svelte";

  let product = $state<Product | null>(null);
  let loading = $state(true);
  let activePhoto = $state("");

  // Likes
  let liked = $state(false);
  let likeCount = $state(0);
  let likeLoading = $state(false);

  // Comentarios
  let comments = $state<Comment[]>([]);
  let commentAuthor = $state("");
  let commentContent = $state("");
  let submittingComment = $state(false);
  let commentSuccess = $state(false);
  let commentError = $state("");

  onMount(async () => {
    product = await getProduct(page.params.id);
    if (product) {
      activePhoto = product.photos[0];
      trackProductView(product.id);
      registerView(product.id);
      liked = isLiked(product.id);
      likeCount = product.likes;
      comments = await getComments(product.id);
    }
    loading = false;
  });

  const waLink = $derived(product ? getWhatsAppLink(product.title, product.price) : "");

  async function toggleLike() {
    if (!product || likeLoading) return;
    likeLoading = true;
    if (liked) {
      await registerUnlike(product.id);
      removeLike(product.id);
      liked = false;
      likeCount = Math.max(0, likeCount - 1);
    } else {
      await registerLike(product.id);
      saveLike(product.id);
      liked = true;
      likeCount = likeCount + 1;
    }
    likeLoading = false;
  }

  async function handleCommentSubmit(e: Event) {
    e.preventDefault();
    if (!product || !commentAuthor.trim() || !commentContent.trim()) return;
    submittingComment = true;
    commentError = "";
    const result = await postComment(product.id, commentAuthor.trim(), commentContent.trim());
    if (result) {
      comments = [...comments, result];
      commentAuthor = "";
      commentContent = "";
      commentSuccess = true;
      setTimeout(() => (commentSuccess = false), 3000);
    } else {
      commentError = "No se pudo publicar el comentario. Inténtalo de nuevo.";
    }
    submittingComment = false;
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-VE", { day: "2-digit", month: "long", year: "numeric" });
  }
</script>

{#if loading}
  <div class="h-[80vh] flex items-center justify-center">
    <div class="w-12 h-12 border-4 border-brand-rose border-t-transparent rounded-full animate-spin"></div>
  </div>
{:else if product}

<div class="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-24">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
    
    <!-- Left: Main Image & Thumbnails -->
    <div class="space-y-6">
      <div class="aspect-square bg-brand-blush/30 rounded-3xl overflow-hidden shadow-2xl shadow-brand-rose/10 border border-brand-blush/60">
        <img src={activePhoto} alt={product.title} class="w-full h-full object-cover" />
      </div>
      
      <div class="flex gap-4 overflow-x-auto pb-2">
        {#each product.photos as photo}
          <button 
            onclick={() => activePhoto = photo}
            class="w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all {activePhoto === photo ? 'border-brand-rose ring-4 ring-brand-rose/15' : 'border-transparent opacity-60 hover:opacity-100'}"
          >
            <img src={photo} alt="thumbnail" class="w-full h-full object-cover" />
          </button>
        {/each}
      </div>
    </div>

    <!-- Right: Product Info -->
    <div class="flex flex-col h-full py-4">
      <nav class="flex text-sm font-medium text-neutral-400 mb-6 gap-2">
        <a href="/" class="hover:text-brand-rose-dark text-xs uppercase tracking-widest font-bold">Inicio</a>
        <span>/</span>
        <a href="/arreglos" class="hover:text-brand-rose-dark">Arreglos</a>
        <span>/</span>
        <span class="text-neutral-800">{product.title}</span>
      </nav>

      <h1 class="text-5xl md:text-6xl font-black text-neutral-800 mb-4 font-serif">{product.title}</h1>
      <p class="text-3xl font-bold text-brand-rose-dark mb-4">${product.price.toFixed(2)}</p>

      <!-- Like button -->
      <div class="flex items-center gap-3 mb-8">
        <button
          onclick={toggleLike}
          disabled={likeLoading}
          class="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-bold text-sm transition-all duration-200
            {liked
              ? 'bg-brand-blush border-brand-rose text-brand-rose-dark hover:bg-brand-rose/20'
              : 'bg-white border-brand-blush text-neutral-500 hover:border-brand-rose hover:text-brand-rose-dark'}
            disabled:opacity-60"
          aria-label={liked ? 'Quitar me gusta' : 'Me gusta'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor" stroke-width="2"
            class="transition-transform duration-200 {liked ? 'scale-110' : 'scale-100'}"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {liked ? "Te gustó" : "Me gusta"}
          <span class="ml-1 text-xs font-normal opacity-70">{likeCount}</span>
        </button>
      </div>
      
      <div class="bg-brand-blush/30 rounded-2xl p-8 mb-8 border border-brand-blush/50">
        <h3 class="font-bold text-neutral-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Descripción del Arreglo
        </h3>
        <p class="text-neutral-600 leading-relaxed text-lg">
          {product.description}
          <br><br>
          Nuestros expertos floristas seleccionan meticulosamente cada pétalo para asegurar la frescura y elegancia que buscas. Este arreglo es ideal para aniversarios, cumpleaños o simplemente para decir "te quiero".
        </p>
      </div>

      <div class="mt-auto space-y-4">
        <a 
          href={waLink}
          target="_blank"
          class="flex items-center justify-center gap-3 w-full py-5 rounded-[2rem] bg-linear-to-r from-brand-rose to-brand-sky text-white font-black text-lg tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-brand-rose/30 font-sans"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.98zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          REALIZAR PEDIDO
        </a>
        <p class="text-center text-sm text-neutral-400">Atención personalizada inmediata</p>
      </div>
    </div>
  </div>

  <!-- ===================== SECCIÓN COMENTARIOS ===================== -->
  <div class="mt-20 border-t border-brand-blush/50 pt-16">
    <h2 class="text-3xl font-black text-neutral-800 font-serif mb-2">Comentarios</h2>
    <p class="text-neutral-400 text-sm mb-10">¿Qué te parece este arreglo? Déjanos tu opinión.</p>

    <!-- Formulario -->
    <form onsubmit={handleCommentSubmit} class="bg-brand-blush/30 rounded-3xl p-8 border border-brand-blush/50 mb-12 space-y-5">
      <h3 class="font-bold text-neutral-700 text-lg">Dejar un comentario</h3>

      <div class="flex flex-col gap-1">
        <label for="comment-author" class="text-sm font-semibold text-neutral-600">Tu nombre</label>
        <input
          id="comment-author"
          type="text"
          bind:value={commentAuthor}
          placeholder="Ej: María González"
          maxlength={100}
          required
          class="w-full rounded-xl border border-brand-blush bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 focus:border-brand-rose transition"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="comment-content" class="text-sm font-semibold text-neutral-600">Comentario</label>
        <textarea
          id="comment-content"
          bind:value={commentContent}
          placeholder="¿Qué piensas sobre este arreglo?"
          rows={4}
          maxlength={500}
          required
          class="w-full rounded-xl border border-brand-blush bg-white px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-rose/20 focus:border-brand-rose transition resize-none"
        ></textarea>
        <p class="text-xs text-neutral-400 text-right">{commentContent.length}/500</p>
      </div>

      {#if commentSuccess}
        <div class="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          ¡Comentario publicado exitosamente!
        </div>
      {/if}
      {#if commentError}
        <p class="text-red-400 text-sm font-medium">{commentError}</p>
      {/if}

      <button
        type="submit"
        disabled={submittingComment || !commentAuthor.trim() || !commentContent.trim()}
        class="px-8 py-3 rounded-full bg-linear-to-r from-brand-rose to-brand-sky text-white font-bold text-sm tracking-wide transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {#if submittingComment}
          Publicando…
        {:else}
          Publicar comentario
        {/if}
      </button>
    </form>

    <!-- Lista de comentarios -->
    {#if comments.length === 0}
      <div class="text-center py-16 text-neutral-400">
        <svg class="mx-auto mb-4 opacity-30" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <p class="font-semibold">Sé el primero en comentar este arreglo.</p>
      </div>
    {:else}
      <div class="space-y-6">
        {#each comments as comment (comment.id)}
          <div class="flex gap-4 items-start bg-white rounded-2xl p-6 border border-brand-blush/50 shadow-sm">
            <!-- Avatar inicial -->
            <div class="w-11 h-11 rounded-full bg-linear-to-br from-brand-rose to-brand-sky flex items-center justify-center text-white font-black text-lg shrink-0 select-none shadow-md">
              {comment.author_name.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1 flex-wrap">
                <span class="font-bold text-neutral-800">{comment.author_name}</span>
                <span class="text-xs text-neutral-400">{formatDate(comment.created_at)}</span>
              </div>
              <p class="text-neutral-600 leading-relaxed text-sm">{comment.content}</p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

{:else}
<div class="h-[60vh] flex flex-col items-center justify-center gap-4">
    <p class="text-2xl font-black text-neutral-800 font-serif">Arreglo no encontrado</p>
    <a href="/" class="px-6 py-3 rounded-full bg-linear-to-r from-brand-rose to-brand-sky text-white font-bold">Volver al inicio</a>
</div>
{/if}
