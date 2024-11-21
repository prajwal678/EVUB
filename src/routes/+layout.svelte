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
      
      if (!token) {
        goto('/login');
      } else if (userRole === 'admin' && $page.url.pathname !== '/admindashboard') {
        goto('/admindashboard');
      } else if (userRole === 'user' && $page.url.pathname !== '/userdashboard') {
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