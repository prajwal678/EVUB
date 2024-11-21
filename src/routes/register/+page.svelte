<script>
  import { navigate } from "svelte-routing";

  let email = '';
  let password = '';
  let confirmPassword = '';
  let role = 'user';  // Default role is user
  let error = '';

  async function handleRegister() {
      if (password !== confirmPassword) {
          error = 'Passwords do not match';
          return;
      }

      try {
          const response = await fetch('http://localhost:5173/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, role })  // Include role in request
          });

          const data = await response.json();
          console.log(data);

          if (response.ok && data.token) {
              localStorage.setItem('authToken', data.token);
              localStorage.setItem('userRole', data.role);
              navigate(data.role === 'admin' ? '/admindashboard' : '/userdashboard');
          } else {
              error = data.message || 'Registration failed. Please try again.';
          }
      } catch (err) {
          console.error(err); // Log any error in the catch block
          error = 'Registration failed. Please try again later.';
      }
  }
</script>

<div>
  <h2>Register</h2>
  <form on:submit|preventDefault={handleRegister}>
      <input type="email" bind:value={email} placeholder="Email" required />
      <input type="password" bind:value={password} placeholder="Password" required />
      <input type="password" bind:value={confirmPassword} placeholder="Confirm Password" required />

      <div>
          <label>
              <input type="radio" bind:group={role} value="user" /> User
          </label>
          <label>
              <input type="radio" bind:group={role} value="admin" /> Admin
          </label>
      </div>

      <button type="submit">Register</button>
      {#if error}
          <p style="color: red;">{error}</p>
      {/if}
  </form>
  <p>Already have an account? <a href="/login">Login</a></p>
</div>
