<script lang="ts">
  import { API_URL } from "$lib/db";
  
  let currentPassword = $state("");
  let newPassword = $state("");
  let newEmail = $state("");
  let verificationCode = $state("");
  let showConfirmEmail = $state(false);
  let loading = $state(false);
  let message = $state({ text: "", type: "" });

  async function updatePassword(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    try {
        const formData = new FormData();
        formData.append("current_password", currentPassword);
        formData.append("new_password", newPassword);

        const res = await fetch(`${API_URL}/auth/change-password`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Error al cambiar contraseña");
        message = { text: "Contraseña actualizada con éxito", type: "success" };
        currentPassword = "";
        newPassword = "";
    } catch (err: any) {
        message = { text: err.message, type: "error" };
    } finally {
        loading = false;
    }
  }

  async function requestEmailChange(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    try {
        const formData = new FormData();
        formData.append("new_email", newEmail);

        const res = await fetch(`${API_URL}/auth/request-email-change`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            body: formData
        });
        if (!res.ok) throw new Error("Error al solicitar cambio");
        showConfirmEmail = true;
        message = { text: "Código enviado a tu nuevo correo", type: "info" };
    } catch (err: any) {
        message = { text: err.message, type: "error" };
    } finally {
        loading = false;
    }
  }

  async function confirmEmailChange(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    try {
        const formData = new FormData();
        formData.append("new_email", newEmail);
        formData.append("code", verificationCode);

        const res = await fetch(`${API_URL}/auth/confirm-email-change`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            body: formData
        });
        if (!res.ok) throw new Error("Código inválido o expirado");
        message = { text: "Email actualizado con éxito", type: "success" };
        showConfirmEmail = false;
        newEmail = "";
        verificationCode = "";
    } catch (err: any) {
        message = { text: err.message, type: "error" };
    } finally {
        loading = false;
    }
  }
</script>

<div class="max-w-4xl space-y-12">
    {#if message.text}
        <div class="p-6 rounded-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 {message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}">
            {message.text}
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Change Password -->
        <div class="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm">
            <h3 class="text-xl font-black text-neutral-900 mb-8 font-serif">Seguridad</h3>
            <form onsubmit={updatePassword} class="space-y-6">
                <div>
                    <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-2 px-1">Contraseña Actual</label>
                    <input type="password" bind:value={currentPassword} required class="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 focus:border-brand-violet transition-all" />
                </div>
                <div>
                    <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-2 px-1">Nueva Contraseña</label>
                    <input type="password" bind:value={newPassword} required class="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 focus:border-brand-violet transition-all" />
                </div>
                <button type="submit" disabled={loading} class="w-full py-4 rounded-2xl btn-primary text-sm shadow-xl">Actualizar Contraseña</button>
            </form>
        </div>

        <!-- Change Email -->
        <div class="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-sm relative overflow-hidden">
            <h3 class="text-xl font-black text-neutral-900 mb-8 font-serif">Email de la Cuenta</h3>
            
            {#if !showConfirmEmail}
                <form onsubmit={requestEmailChange} class="space-y-6">
                    <div>
                        <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-2 px-1">Nuevo Correo Electrónico</label>
                        <input type="email" bind:value={newEmail} required class="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-violet/10 focus:border-brand-violet transition-all" placeholder="nuevo@ejemplo.com" />
                    </div>
                    <button type="submit" disabled={loading} class="w-full py-4 rounded-2xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-all text-sm shadow-xl">Solicitar Cambio</button>
                </form>
            {:else}
                <form onsubmit={confirmEmailChange} class="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div class="p-4 bg-brand-violet/5 rounded-2xl text-xs font-bold text-brand-violet">
                        Hemos enviado un código a {newEmail}
                    </div>
                    <div>
                        <label class="block text-xs font-black text-neutral-400 uppercase tracking-widest mb-2 px-1">Código de Verificación</label>
                        <input type="text" bind:value={verificationCode} required class="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange transition-all text-center text-2xl font-black tracking-[10px]" placeholder="000000" />
                    </div>
                    <button type="submit" disabled={loading} class="w-full py-4 rounded-2xl btn-primary text-sm shadow-xl">Confirmar Email</button>
                    <button type="button" onclick={() => showConfirmEmail = false} class="w-full text-center text-xs font-bold text-neutral-400 hover:text-neutral-600">Cancelar cambio</button>
                </form>
            {/if}
        </div>
    </div>
</div>
