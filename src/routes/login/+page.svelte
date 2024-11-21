<script>
  import { navigate } from "svelte-routing";

  let email = '';
  let password = '';
  let error = '';

  async function handleLogin() {
      try {
          const response = await fetch('http://localhost:5173/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });
          const data = await response.json();

          if (response.status === 404) {
              error = 'User not registered';
          } else if (response.ok && data.token) {
              localStorage.setItem('authToken', data.token);
              localStorage.setItem('userRole', data.role);

              if (data.role === 'admin') {
                  navigate('/admindashboard');
              } else {
                  navigate('/userdashboard');
              }
          } else {
              error = 'Invalid credentials';
          }
      } catch (err) {
          error = 'Login failed. Please try again later.';
      }
  }
</script>

<div>
  <h2>Login</h2>
  <form on:submit|preventDefault={handleLogin}>
      <input type="email" bind:value={email} placeholder="Email" required />
      <input type="password" bind:value={password} placeholder="Password" required />
      <button type="submit">Login</button>
      {#if error}
          <p>{error}</p>
      {/if}
  </form>
  <p>Don't have an account? <a href="/register">Register</a></p>
</div>
