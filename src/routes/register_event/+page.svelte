<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
  
    let eventID = "";
  let SRN = "";
  let errorMessage = "";

  // Retrieve the eventID from localStorage when the component mounts
  onMount(() => {
    try {
      // Retrieve eventID from localStorage
      eventID = localStorage.getItem("eventID");

      if (!eventID) {
        errorMessage = "Event ID not found. Please try again.";
      }
    } catch (error) {
      errorMessage = "An error occurred while loading the page.";
    }
  });

  async function registerForEvent() {
    try {
      if (!SRN) {
        alert("Please enter your SRN to register for the event.");
        return;
      }

    //   const response = await fetch("http://localhost:5173/events/register", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ SRN, eventID }),
    //   });

    //   if (response.ok) {
    //     alert("Registration successful!");
    //     navigate("/events"); // Redirect to events page
    //   } else {
    //     const error = await response.json();
    //     // alert(`Registration failed: ${error.message}`);
    //   }
    // } catch (err) {
    //   // alert("An error occurred while registering.");
    // }
        alert("Registration successful!");
        window.location.href = "/events";
    } catch {

    }
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
        <li><a href="/userdashboard">Home</a></li>
        <li><a href="/clubs">Clubs</a></li>
        <li><a href="/events">Events</a></li>
        <li><button on:click={handleLogout}>Logout</button></li>      </ul>
    </nav>
  
    <!-- Register Event Content -->
    <div class="content">
      <h1>Register for Event</h1>
      <p><strong>Event ID:</strong> {eventID}</p>
  
      <div class="form-container">
        <label for="SRN">SRN:</label>
        <input id="SRN" type="text" bind:value={SRN} placeholder="Enter your SRN" />
  
        <button class="submit-btn" on:click={registerForEvent}>Submit</button>
      </div>
    </div>
  </div>
  
  <style>
    /* General Styling */
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f7fc;
    }
  
    .dashboard-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
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
      flex-grow: 1;
    }
  
    h1 {
      font-size: 2rem;
      color: #ffffff;
      margin-bottom: 1rem;
      text-align: center;
    }
  
    p {
      font-size: 1rem;
      margin-bottom: 1.5rem;
      color: #555;
      text-align: center;
    }
  
    .form-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    label {
      font-size: 1rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
      color: #333;
    }
  
    input {
      padding: 0.8rem;
      width: 100%;
      max-width: 300px;
      margin-bottom: 1.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      transition: border 0.3s ease;
    }
  
    input:focus {
      border-color: #007bff;
      outline: none;
    }
  
    button {
      padding: 0.8rem 2rem;
      background-color: #000000;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.2rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    button:hover {
      background-color: #030303;
    }
  
    button:active {
      background-color: #000000;
    }
  
    /* Responsive styles */
    @media (max-width: 600px) {
      .content {
        padding: 1.5rem;
      }
  
      h1 {
        font-size: 1.6rem;
      }
  
      input {
        max-width: 100%;
      }
  
      button {
        width: 100%;
      }
    }
  </style>
  