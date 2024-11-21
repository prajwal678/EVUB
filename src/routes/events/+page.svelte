<script>
  
    let events = [
      { eventID: "EVT002", eventName: "Art Exhibition", eventDate: "2024-11-21", eventStartTime: "10:00:00", eventEndTime: "17:00:00", clubID: "C002", venueID: "VEN002" },
      { eventID: "EVT003", eventName: "Drama Fest", eventDate: "2024-11-21", eventStartTime: "14:00:00", eventEndTime: "17:00:00", clubID: "C003", venueID: "VEN003" },
      { eventID: "EVT004", eventName: "Tech Talk", eventDate: "2024-11-22", eventStartTime: "11:00:00", eventEndTime: "13:00:00", clubID: "C004", venueID: "VEN004" },
      {eventID: 'EVT001', eventName: 'MoDeRn ArT', eventDate: '2024-11-22', eventStartTime: '10:00:00', eventEndTime: '14:00:00', clubID: 'C001', venueID: 'VEN001'},
      { eventID: "EVT001", eventName: "Music Night", eventDate: "2024-11-23", eventStartTime: "18:00:00", eventEndTime: "21:00:00", clubID: "C001", venueID: "VEN001" },
      {eventID: 'EVT002', eventName: 'Science Fair', eventDate: '2024-11-23', eventStartTime: '09:00:00', eventEndTime: '17:00:00', clubID: 'C002', venueID: 'VEN002'},
    ];
    // Filter State
    let filters = {
      eventDate: "",
      clubID: "",
      venueID: "",
    };
  
    // Filtered events list
    let filteredEvents = events;
  
    function applyFilters() {
      filteredEvents = events.filter(event => {
        return (
          (!filters.eventDate || event.eventDate === filters.eventDate) &&
          (!filters.clubID || event.clubID === filters.clubID) &&
          (!filters.venueID || event.venueID === filters.venueID)
        );
      });
    }
  
    /**
     * @param {string} eventID
     */
    // function navigateToRegister(eventID) {
    //   navigate(`/register_event/?eventID=${eventID}`);
    // }
  
    function setEventID(eventID) {
    localStorage.setItem('eventID', eventID);
    window.location.href = '/register_event'; // Redirect to the register event page
  }
    // function handleLogout() {
    //   localStorage.removeItem("authToken");
    //   localStorage.removeItem("userRole");
    //   navigate("/login");
    // }
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
      <h1>Events</h1>
      <section class="filter-section">
        <h3>Filter Events</h3>
        <div class="filters">
          <label>
            Event Date:
            <input type="date" bind:value={filters.eventDate} on:change={applyFilters} />
          </label>
          <label>
            Club ID:
            <input type="text" placeholder="Enter Club ID" bind:value={filters.clubID} on:change={applyFilters} />
          </label>
          <label>
            Venue ID:
            <input type="text" placeholder="Enter Venue ID" bind:value={filters.venueID} on:change={applyFilters} />
          </label>
        </div>
      </section>
  
      <section class="events-section">
        <h3>Event Details</h3>
        <table>
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Event Name</th>
              <th>Event Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Club ID</th>
              <th>Venue ID</th>
              <th>Register</th>
            </tr>
          </thead>
          <tbody>
            {#if filteredEvents.length > 0}
              {#each filteredEvents as event}
                <tr>
                  <td>{event.eventID}</td>
                  <td>{event.eventName}</td>
                  <td>{event.eventDate}</td>
                  <td>{event.eventStartTime}</td>
                  <td>{event.eventEndTime}</td>
                  <td>{event.clubID}</td>
                  <td>{event.venueID}</td>
                  <td>
                    <button on:click={() => setEventID(event.eventID)}>Register</button>
                  </td>
                </tr>
              {/each}
            {:else}
              <tr>
                <td colspan="8" style="text-align: center;">No events match the filters.</td>
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
  
    .filter-section {
      margin-bottom: 2rem;
    }
  
    .filter-section .filters {
      display: flex;
      gap: 1rem;
    }
  
    .filter-section label {
      display: flex;
      flex-direction: column;
      font-size: 0.9rem;
    }
  
    .filter-section input {
      padding: 0.5rem;
      font-size: 1rem;
    }
  
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
  
    .events-section td[colspan="8"] {
      color: #888;
      font-style: italic;
    }
  
    .events-section button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 4px;
    }
  
    .events-section button:hover {
      background-color: #45a049;
    }
  </style>
  