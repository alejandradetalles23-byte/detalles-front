<script lang="ts">
  import { API_URL } from "$lib/db";
  
  let username = $state("");
  let password = $state("");
  let showPassword = $state(false);
  let error = $state("");
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = "";

    try {
        const formData = new FormData();
        formData.append("username", username.trim());
        formData.append("password", password.trim());

        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.detail || "Error al iniciar sesión");

        // Almacenar token (ejemplo simple en localStorage)
        localStorage.setItem("token", data.access_token);
        window.location.href = "/";
    } catch (err: any) {
        error = err.message;
    } finally {
        loading = false;
    }
  }
</script>

<div class="min-h-[80vh] flex items-center justify-center px-4 py-24 bg-neutral-50">
  <div class="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-neutral-100 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute -top-24 -right-24 w-48 h-48 bg-brand-red/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-violet/10 rounded-full blur-3xl"></div>

    <div class="text-center mb-10 relative">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-red to-brand-violet rounded-3xl text-white font-bold text-2xl mb-6 shadow-xl">
        AD
      </div>
      <h1 class="text-4xl font-black text-neutral-900 mb-2 font-serif tracking-tight">Bienvenido</h1>
      <p class="text-neutral-400 font-medium">Panel de administración Ale-Det</p>
    </div>

    {#if error}
      <div class="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {error}
      </div>
    {/if}

    <form onsubmit={handleSubmit} class="space-y-6 relative">
      <div>
        <label for="username" class="block text-sm font-bold text-neutral-700 mb-2 px-1">Usuario</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          required
          autocapitalize="none"
          autocorrect="off"
          spellcheck="false"
          autocomplete="username"
          class="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange outline-none transition-all placeholder:text-neutral-300"
          placeholder="Tu usuario"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-bold text-neutral-700 mb-2 px-1">Contraseña</label>
        <div class="relative group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              bind:value={password}
              required
              class="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange outline-none transition-all placeholder:text-neutral-300 pr-14"
              placeholder="••••••••"
            />
            <button 
                type="button"
                onclick={() => showPassword = !showPassword}
                class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-brand-orange transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
                {#if showPassword}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                {/if}
            </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full py-5 rounded-2xl bg-neutral-900 text-white font-black text-lg hover:bg-neutral-800 shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait"
      >
        {loading ? 'Iniciando sesión...' : 'Entrar al Panel'}
      </button>

      <div class="text-center pt-4">
        <a href="/" class="text-sm font-semibold text-neutral-400 hover:text-brand-red transition-colors">Volver a la tienda</a>
      </div>
    </form>
  </div>
</div>
