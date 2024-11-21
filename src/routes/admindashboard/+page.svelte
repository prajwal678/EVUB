<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
  
    /**
	 * @type {any[]}
	 */
    let users = [];
  
    onMount(async () => {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
  
      if (!token || role !== 'admin') {
        navigate('/login');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:5173/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        users = await response.json();
      } catch (err) {
        console.error('Failed to fetch users');
      }
    });
  </script>
  
  <div>
    <h2>Admin Dashboard</h2>
    <h3>User Management</h3>
    {#each users as user}
      <div>
        <p>{user.email}</p>
        <!-- Add admin actions like ban, edit roles -->
      </div>
    {:else}
      <p>No users found</p>
    {/each}
  </div>