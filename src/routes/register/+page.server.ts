import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
    register: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const phone_no = formData.get('phone_no');
        const role = formData.get('role');
        const SRN = formData.get('SRN');

        // Validate form data
        if (!email || !password || !confirmPassword || password !== confirmPassword) {
            return { success: false, message: 'Invalid input' };
        }

        try {
            const response = await fetch('http://localhost:5173/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, firstName, lastName, phone_no, role })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            }

            return { success: false, message: data.message || 'Registration failed' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error connecting to the server' };
        }
    }
};
