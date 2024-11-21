<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';

  const isAuthenticated = writable(false);

  onMount(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      goto('/login');
    } else if (userRole === 'admin') {
      goto('/admindashboard');
    } else {
      goto('/userdashboard');
    }
  });

  
  function logout() {
        if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        }
        isAuthenticated.set(false);
        goto('/login');
    }
</script>

<nav>
  {#if $isAuthenticated}
    <button on:click={logout}>Logout</button>
  {:else}
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  {/if}
</nav>


<slot />
