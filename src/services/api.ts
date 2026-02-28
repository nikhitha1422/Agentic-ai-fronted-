// API Configuration
// For ngrok: Set VITE_API_URL in .env.local to your ngrok backend URL
// Example: VITE_API_URL=https://xxxx.ngrok-free.app

const getBaseUrl = (): string => {
    // Check for environment variable first (for ngrok/production)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Default to public backend tunnel
    return 'https://ka-ichthyologic-talisha.ngrok-free.dev';
};

export const BASE_URL = getBaseUrl();
export const API_URL = `${BASE_URL}/api`;
