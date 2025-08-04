import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear the authentication token
        localStorage.removeItem('authToken');
        
        // Also, update any global auth state (e.g., using Context or Redux)
        // Forcing a storage event for other tabs, or using a broadcast channel might be needed here
        // for immediate effect in other open tabs if not using global state that handles this.
        window.dispatchEvent(new Event("storage")); // Trigger storage event for Header to pick up

        console.log('User logged out, authToken removed, redirecting to login.');
        navigate('/login');
    }, [navigate]);

    // This component typically doesn't render anything visible as it just redirects
    return null; 
}; 