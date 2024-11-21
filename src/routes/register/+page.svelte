<script>
    let email = '';
    let password = '';
    let confirmPassword = '';
    let firstName = '';
    let lastName = '';
    let phone_no = '';
    let role = 'user';
    let error = '';
</script>

<div>
    <form method="post" action="?/register">
        <h2>Register</h2>
        <input type="text" bind:value={firstName} name="firstName" placeholder="First Name" required />
        <input type="text" bind:value={lastName} name="lastName" placeholder="Last Name" required />
        <input type="email" bind:value={email} name="email" placeholder="Email" required />
        <input type="password" bind:value={password} name="password" placeholder="Password" required />
        <input type="password" bind:value={confirmPassword} name="confirmPassword" placeholder="Confirm Password" required />
        <input type="tel" bind:value={phone_no} name="phone_no" placeholder="Phone Number" required />


        <div>
            <label>
                <input type="radio" bind:group={role} name="role" value="user" /> User
            </label>
            <label>
                <input type="radio" bind:group={role} name="role" value="admin" /> Admin
            </label>
        </div>

        <button type="submit">Register</button>
        {#if error}
            <p style="color: red;">{error}</p>
        {/if}
    </form>
    <p>Already have an account? <a href="/login">Login</a></p>
</div>
