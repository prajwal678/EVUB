<script>
    // import { goto } from '$app/navigation';

  // Sample Events Data
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

  // New Event Data
  let newEvent = {
      eventID: "",
      eventName: "",
      eventDate: "",
      eventStartTime: "",
      eventEndTime: "",
      clubID: "",
      venueID: "",
  };

  function applyFilters() {
      filteredEvents = events.filter(event => {
          return (
              (!filters.eventDate || event.eventDate === filters.eventDate) &&
              (!filters.clubID || event.clubID === filters.clubID) &&
              (!filters.venueID || event.venueID === filters.venueID)
          );
      });
  }

  function addEvent() {
      if (
          newEvent.eventID &&
          newEvent.eventName &&
          newEvent.eventDate &&
          newEvent.eventStartTime &&
          newEvent.eventEndTime &&
          newEvent.clubID &&
          newEvent.venueID
      ) {
        events = [...events, { ...newEvent }];
      applyFilters(); // Update filtered events
      newEvent = { eventID: "", eventName: "", eventDate: "", eventStartTime: "", eventEndTime: "", clubID: "", venueID: "" };
    } else {
      alert("Please fill all fields.");
    }
  }

  function deleteEvent(eventID) {
      events = events.filter(event => event.eventID !== eventID);
      applyFilters();
  }

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
          <li><a href="/admindashboard">Home</a></li>
          <li><button on:click={handleLogout}>Logout</button></li>
      </ul>
  </nav>

  <!-- Dashboard Content -->
  <div class="content">
      <h1>Manage Events</h1>

      <!-- Add Event Section -->
      <section class="add-event-section">
          <h3>Add New Event</h3>
          <div class="add-event-form">
              <label>Event ID: <input type="text" bind:value={newEvent.eventID} /></label>
              <label>Event Name: <input type="text" bind:value={newEvent.eventName} /></label>
              <label>Event Date: <input type="date" bind:value={newEvent.eventDate} /></label>
              <label>Start Time: <input type="time" bind:value={newEvent.eventStartTime} /></label>
              <label>End Time: <input type="time" bind:value={newEvent.eventEndTime} /></label>
              <label>Club ID: <input type="text" bind:value={newEvent.clubID} /></label>
              <label>Venue ID: <input type="text" bind:value={newEvent.venueID} /></label>
              <button on:click={addEvent} class="primary-btn">Add Event</button>
          </div>
      </section>
<!-- 
      Filter Section -->
      <!-- <section class="filter-section">
          <h3>Filter Events</h3>
          <div class="filters">
              <label>Event Date: <input type="date" bind:value={filters.eventDate} on:change={applyFilters} /></label>
              <label>Club ID: <input type="text" placeholder="Enter Club ID" bind:value={filters.clubID} on:change={applyFilters} /></label>
              <label>Venue ID: <input type="text" placeholder="Enter Venue ID" bind:value={filters.venueID} on:change={applyFilters} /></label>
          </div>
      </section> -->

      <!-- Events Section -->
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
                      <th>Actions</th>
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
                              <td><button on:click={() => deleteEvent(event.eventID)} class="delete-btn">Delete</button></td>
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
  body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
  }

  .dashboard-container {
      display: flex;
      flex-direction: column;
  }

  .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #000;
      color: #fff;
      padding: 1rem;
  }

  .navbar h1 {
      margin: 0;
  }

  .navbar ul {
      list-style: none;
      display: flex;
      margin: 0;
  }

  .navbar li {
      margin-left: 1rem;
  }

  .navbar a, .navbar button {
      color: white;
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
  }

  .navbar button:hover, .navbar a:hover {
      text-decoration: underline;
  }

  .content {
      padding: 2rem;
  }

  .add-event-form, .filters {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
  }

  table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
  }

  th, td {
      border: 1px solid #ddd;
      padding: 8px;
  }

  th {
      background-color: #f4f4f4;
  }

  tr:nth-child(even) {
      background-color: #f9f9f9;
  }

  tr:hover {
      background-color: #f1f1f1;
  }

  .primary-btn {
      background-color: #007BFF;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
  }

  .primary-btn:hover {
      background-color: #0056b3;
  }

  .delete-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.4rem 0.8rem;
      cursor: pointer;
  }

  .delete-btn:hover {
      background-color: #a71d2a;
  }
   /* Add Event Section Styling */
   .add-event-section {
      margin: 2rem 0;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 8px;
  }

  .add-event-section h3 {
      margin-bottom: 1rem;
      color: #333;
  }

  .add-event-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem 2rem;
  }

  .add-event-form label {
      display: flex;
      flex-direction: column;
      font-weight: bold;
      color: #555;
  }

  .add-event-form input {
      margin-top: 0.5rem;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .add-event-form input:focus {
      outline: none;
      border-color: #007BFF;
      box-shadow: 0 0 3px rgba(0, 123, 255, 0.5);
  }

  .add-event-form .primary-btn {
      grid-column: span 2;
      justify-self: start;
      margin-top: 1rem;
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
  }

  .add-event-form .primary-btn:hover {
      background-color: #218838;
  }
</style>
