<script lang="ts">
  import { onMount } from "svelte";

  let isDark = $state(false);

  onMount(() => {
    // Check initial theme
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      isDark = true;
    }
  });

  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }
</script>

<button
  onclick={toggleTheme}
  class="relative w-16 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-violet/50 group overflow-hidden border border-neutral-300 dark:border-neutral-700 shadow-inner"
  aria-label="Toggle Theme"
>
  <!-- Sun/Moon icons with transition -->
  <div
    class="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      class="text-orange-500 {isDark ? 'opacity-30' : 'opacity-100'} transition-opacity"
    >
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      class="text-violet-400 {isDark ? 'opacity-100' : 'opacity-30'} transition-opacity"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  </div>

  <!-- Sliding Handle -->
  <div
    class="w-6 h-6 bg-white dark:bg-neutral-200 rounded-full shadow-md transition-transform duration-300 flex items-center justify-center {isDark ? 'translate-x-8' : 'translate-x-0'}"
  >
    <div class="w-1 h-1 bg-neutral-200 dark:bg-neutral-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
</button>
