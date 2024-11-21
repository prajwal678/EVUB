<script lang="ts">
  import { navigate } from 'svelte-routing';

  let SRN = '';
  let firstName = '';
  let lastName = '';
  let email = '';
  let phone_no = '';
  let password = '';
  let confirmPassword = '';
  let role = 'user';
  let error = '';
  let successMessage = '';

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      successMessage = '';
      return;
    }

    error = '';
    successMessage = '';

    const payload = {
      SRN,
      firstName,
      lastName,
      email,
      phone_no,
      pwd: password,
      role,
    };

    console.log('Payload being sent to server:', payload);

    try {
      const response = await fetch('http://localhost:5173/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Response from server:', result);

      if (response.ok) {
        successMessage = 'Registration successful! Redirecting to login...';
        error = '';
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        error = result.message || 'Registration failed. Please try again.';
        successMessage = '';
      }
    } catch (err) {
      console.error('Error connecting to the server:', err);
      error = 'Error connecting to the server. Please try again later.';
    }
  };
</script>

<div class="app-container">
  <header class="app-title-bar">
    <h1>EVUB</h1>
  </header>

  <div class="register-container">
    <h2>Register</h2>

    <form on:submit={handleSubmit}>
      <input type="text" bind:value={firstName} placeholder="First Name" required />
      <input type="text" bind:value={lastName} placeholder="Last Name" required />
      <input type="text" bind:value={SRN} placeholder="SRN" required />
      <input type="email" bind:value={email} placeholder="Email" required />
      <input type="text" bind:value={phone_no} placeholder="Phone No." required />
      <input type="password" bind:value={password} placeholder="Password" required />
      <input type="password" bind:value={confirmPassword} placeholder="Confirm Password" required />

      <div class="role-selection">
        <label>
          <input type="radio" bind:group={role} value="user" /> User
        </label>
        <label>
          <input type="radio" bind:group={role} value="admin" /> Admin
        </label>
      </div>

      <button type="submit">Register</button>

      {#if error}
        <p class="error-message">{error}</p>
      {/if}

      {#if successMessage}
        <p class="success-message">{successMessage}</p>
      {/if}
    </form>
    <p>Already have an account? <a href="/login">Login</a></p>
  </div>
</div>


<style>
  /* App Container */
  .app-container {
      font-family: Arial, sans-serif;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f9f9f9;
  }

  /* App Title Bar */
  .app-title-bar {
      background-color: #060606;
      color: white;
      padding: 1rem;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .app-title-bar h1 {
      margin: 0;
      font-size: 1.8rem;
  }

  /* Register Container */
  .register-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
  }

  form {
      background: #ffffff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
  }

  h2 {
      margin-bottom: 1rem;
      color: #333;
      text-align: center;
  }

  input {
      width: 100%;
      padding: 0.8rem;
      margin: 0.5rem 0;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
  }

  input:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
  }

  /* Role Selection Styling */
  .role-selection {
      display: flex;
      justify-content: space-between;
      margin: 1rem 0;
  }

  .role-selection label {
      font-size: 1rem;
      color: #333;
  }

  button {
      width: 100%;
      padding: 0.8rem;
      margin-top: 1rem;
      background: #020202;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
  }

  button:hover {
      background-color: #0056b3;
  }

  .error-message {
      color: red;
      font-size: 0.9rem;
      margin-top: 0.5rem;
      text-align: center;
  }

  a {
      color: #007bff;
      text-decoration: none;
  }

  a:hover {
      text-decoration: underline;
  }

  form + p {
      margin-top: 1rem;
      text-align: center;
  }
</style>
