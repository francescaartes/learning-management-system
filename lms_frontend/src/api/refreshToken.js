import axios from "axios";

export const refreshToken = async () => {
    try {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) {
            console.error("No refresh token available.");
            return null;
        }

        const response = await axios.post('w', { refresh });

        if (response.data?.access) {
            localStorage.setItem('access', response.data.access);
            console.log("Access Token Refreshed! -refreshToken");
            return response.data.access;
        } else {
            console.error("Failed to refresh access token: no access token returned.");
            return null;
        }
    } catch (err) {
        console.error('Token refresh failed:', err);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return null;
    }
};
