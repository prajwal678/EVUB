<script>

    let email = '';
    let password = '';
    let error = '';
  
    async function handleLogin() {
        try {
            const response = await fetch('http://localhost:5173/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, pwd: password })
            });
            const data = await response.json();
  
            if (response.status === 404) {
                error = 'User not registered';
            }
            else if (response.ok && data.token) {
                // localStorage.setItem('authToken', data.token);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('email', data.email);

                if (data.role === 'admin') {
                    window.location.href = '/admindashboard';
                } else {
                  window.location.href = '/userdashboard';
                }
            }
            else {
                error = 'Invalid credentials';
            }
        }
        catch (err) {
            error = 'Login failed. Please try again later.';
        }
    }
  </script>
  
  <div class="app-container">
    <!-- App Title Bar -->
    <header class="app-title-bar">
      <h1>EVUB</h1>
    </header>
  
    <!-- Login Form -->
    <div class="login-container">
      <h2>Login</h2>
      <form on:submit|preventDefault={handleLogin}>
        <input type="email" bind:value={email} placeholder="Email" required />
        <input type="password" bind:value={password} placeholder="Password" required />
        <button type="submit">Login</button>
        {#if error}
          <p class="error-message">{error}</p>
        {/if}
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
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
      background-color: #000000;
      color: white;
      padding: 1rem;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
  
    .app-title-bar h1 {
      margin: 0;
      font-size: 1.8rem;
    }
  
    /* Login Container */
    .login-container {
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
  
    button {
      width: 100%;
      padding: 0.8rem;
      margin-top: 1rem;
      background: #020303;
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
  