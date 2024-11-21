<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
  
    const isAuthenticated = writable(false);
  
    function logout() {
        if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        }
        isAuthenticated.set(false);
        goto('/login');
    }
  
    $: {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const currentPath = $page.url.pathname;

      if (!token && currentPath !== '/login' && currentPath !== '/register') {
      goto('/login');
    } else if (token && userRole === 'admin' && currentPath !== '/admindashboard') {
      goto('/admindashboard');
    } else if (token && userRole === 'user' && currentPath !== '/userdashboard') {
      goto('/userdashboard');
    }
    }
  }
  </script>
  
  <nav>
    {#if typeof localStorage !== 'undefined' && localStorage.getItem('authToken')}
      <button onclick={logout}>Logout</button>
    {:else}
      <a href="/login">Login</a>
      <a href="/register">Register</a>
    {/if}
  </nav>
  
  <slot />