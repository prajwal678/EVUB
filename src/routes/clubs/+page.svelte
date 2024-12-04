<script>
    import { navigate } from "svelte-routing";
  
    let clubs = [
      { clubID: "C001", clubName: "Music Club", clubDescription: "A place for music lovers to showcase their talent." },
      { clubID: "C002", clubName: "Art Club", clubDescription: "A hub for creative and artistic students." },
      { clubID: "C003", clubName: "Drama Club", clubDescription: "For those who love acting and drama." },
      { clubID: "C004", clubName: "Tech Club", clubDescription: "Exploring the latest in technology and innovation." },
    ];
  
    function handleLogout() {
    console.log("Logging out...");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    window.location.href = "/login"; // Redirect to the login page
  }
  </script>
  
  <div class="dashboard-container">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <h1>EVUB</h1>
      <ul>
        <li><a href="/userdashboard">Home</a></li>
        <li><a href="/clubs">Clubs</a></li>
        <li><a href="/events">Events</a></li>
        <li><button on:click={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  
    <!-- Dashboard Content -->
    <div class="content">
      <h1>Clubs</h1>
      <section class="clubs-section">
        <!-- <h3>Club Details</h3> -->
        <table>
          <thead>
            <tr>
              <th>Club ID</th>
              <th>Club Name</th>
              <th>Club Description</th>
            </tr>
          </thead>
          <tbody>
            {#if clubs.length > 0}
              {#each clubs as club}
                <tr>
                  <td>{club.clubID}</td>
                  <td>{club.clubName}</td>
                  <td>{club.clubDescription}</td>
                </tr>
              {/each}
            {:else}
              <tr>
                <td colspan="3" style="text-align: center;">No clubs available.</td>
              </tr>
            {/if}
          </tbody>
        </table>
      </section>
    </div>
  </div>
  
  <style>
    /* General Styling */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
  
    .dashboard-container {
      display: flex;
      flex-direction: column;
    }
  
    /* Navigation Bar */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #000000;
      color: white;
      padding: 1rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  
    .navbar h1 {
      margin: 0;
    }
  
    .navbar ul {
      list-style: none;
      display: flex;
      margin: 0;
      padding: 0;
    }
  
    .navbar li {
      margin: 0 1rem;
    }
  
    .navbar a {
      color: white;
      text-decoration: none;
    }
  
    .navbar button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 1rem;
    }
  
    .navbar button:hover,
    .navbar a:hover {
      text-decoration: underline;
    }
  
    /* Content Section */
    .content {
      padding: 2rem;
    }
  
    .clubs-section {
      margin-top: 2rem;
    }
  
    .clubs-section table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
  
    .clubs-section th,
    .clubs-section td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
  
    .clubs-section th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
  
    .clubs-section tr:nth-child(even) {
      background-color: #f9f9f9;
    }
  
    .clubs-section tr:hover {
      background-color: #ddd;
    }
  
    .clubs-section td[colspan="3"] {
      color: #888;
      font-style: italic;
    }
  </style>
  