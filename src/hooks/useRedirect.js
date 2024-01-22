import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router";

// Custom hook to handle redirection based on user authentication status
export const useRedirect = (userAuthStatus) => {
    const history = useHistory(); // useHistory hook to enable navigation

    useEffect(() => {
        // Function to handle the component mounting logic
        const handleMount = async () => {
            try {
                // Attempt to refresh the token
                await axios.post("/dj-rest-auth/token/refresh/");

                // If the user is logged in, redirect to the home page
                if (userAuthStatus === "loggedIn") {
                    history.push("/");
                }
            } catch (err) {
                // If the token refresh fails, implying the user is not logged in
                if (userAuthStatus === "loggedOut") {
                    // Redirect to the home page for logged out users
                    history.push("/");
                }
            }
        };

        // Call the handleMount function when the component mounts
        handleMount();
    }, [history, userAuthStatus]); // Dependencies for useEffect: history and userAuthStatus
};

// This hook useRedirect is designed to redirect users based on their authentication status. It tries to refresh the authentication token upon mounting. If successful and the user is logged in, it redirects to the home page. If the token refresh fails, implying the user is not logged in, it also redirects to the home page. This behavior is dependent on the userAuthStatus parameter.





