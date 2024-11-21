<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
  
    /**
	 * @type {{ email: any; } | null}
	 */
    let userData = null;
    let error = '';
  
    onMount(async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
  
      try {
          const response = await fetch('http://localhost:5173/user-profile', {
              headers: { 'Authorization': `Bearer ${token}` }
          });

          if (response.ok) {
              userData = await response.json();
          } else {
              error = 'Failed to fetch user data. Please log in again.';
              navigate('/login');
          }
      } catch (err) {
          console.error('Error fetching user data:', err);
          error = 'An error occurred while loading the dashboard.';
      }
    });
  </script>
  
  <div>
    <h2>User Dashboard</h2>
    {#if error}
      <p style="color: red;">{error}</p>
    {:else if userData}
      <p>Welcome, {userData.email}!</p>
      <!-- Add user-specific content here -->
    {:else}
      <p>Loading...</p>
    {/if}
  </div>