<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  let userData = $state(null);
  let error = $state('');
  /**
     * @type {string | any[]}
     */
  let todaysEvents = $state([]);

  function tokenIsExpired(token) {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 < Date.now();
  }

  onMount(async () => {
      const token = localStorage.getItem('authToken');
      if (!token || tokenIsExpired(token)) {
        localStorage.removeItem('authToken');
        navigate('/login');
      }

      try {
          const userResponse = await fetch('http://localhost:5173/userprofile', {
              headers: { 'Authorization': `Bearer ${token}` }
          });

          if (userResponse.ok) {
              userData = await userResponse.json();
          } else {
              error = 'Failed to fetch user data. Please log in again.';
              window.location.hred = '/login';
          }

      } catch (err) {
          console.error('Error fetching user data:', err);
          error = 'An error occurred while loading the dashboard.';
      }

      // Fetch today's events
      try {
          const eventsResponse = await fetch('http://localhost:5173/events/filter', {
              headers: { 'Authorization': `Bearer ${token}` }
          });

          if (eventsResponse.ok) {
              todaysEvents = await eventsResponse.json();
          } else {
              console.error('Error fetching today’s events');
          }
      } catch (err) {
          console.error('Error fetching events:', err);
      }
  });

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
          <li><button onclick={handleLogout}>Logout</button></li>
      </ul>
  </nav>
  

  <!-- Dashboard Content -->
  <div class="content">
      <h1>Welcome to Your Dashboard</h1>
      {#if error}
          <p style="color: red;">{error}</p>
      {:else if userData}
          <p>Welcome, {userData.email}!</p>
      {/if}

      <!-- Display Today's Events -->
      <!-- <section class="events-section">
          <h3>Today's Events</h3>
          {#if todaysEvents.length > 0}
              <ul>
                  {#each todaysEvents as event}
                      <li>
                          <h4>{event.eventName}</h4>
                          <p>Organized by: {event.clubName}</p>
                          <p>Venue: {event.venueName}</p>
                          <p>Time: {event.eventStartTime} - {event.eventEndTime}</p>
                      </li>
                  {/each}
              </ul>
          {:else}
              <p>No events scheduled for today.</p>
          {/if}
      </section> -->
      <!-- Display Today's Events -->
<section class="events-section">
  <h3>Today's Events</h3>
  <table>
    <thead>
      <tr>
        <th>Event Name</th>
        <th>Event Date</th>
        <th>Start Time</th>
        <th>End Time</th>
        <th>Club ID</th>
        <th>Venue ID</th>
      </tr>
    </thead>
    <tbody>
      {#if todaysEvents.length > 0}
        {#each todaysEvents as event}
          <tr>
            <td>{event.eventName}</td>
            <td>{event.eventDate}</td>
            <td>{event.eventStartTime}</td>
            <td>{event.eventEndTime}</td>
            <td>{event.clubID}</td>
            <td>{event.venueID}</td>
          </tr>
        {/each}
      {:else}
        <tr>
          <td colspan="6" style="text-align: center;">No events scheduled for today.</td>
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

  .events-section {
      margin-top: 2rem;
  }

  /* .events-section ul {
      list-style: none;
      padding: 0;
  }

  .events-section li {
      margin: 1rem 0;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
  }

  .events-section h4 {
      margin: 0 0 0.5rem;
  } */

  .events-section table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  .events-section th,
  .events-section td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .events-section th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  .events-section tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .events-section tr:hover {
    background-color: #ddd;
  }

  .events-section td[colspan="6"] {
    color: #888;
    font-style: italic;
  }
</style>
