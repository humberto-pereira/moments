import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults"; // Custom axios instances
import { useHistory } from "react-router";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils"; // Utility functions

// Creating two contexts: one for getting the current user, one for setting the current user
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// Custom hooks for accessing our contexts
export const useCurrentUser = () => useContext(CurrentUserContext); // Hook to access the current user
export const useSetCurrentUser = () => useContext(SetCurrentUserContext); // Hook to update the current user

// Provider component for CurrentUserContext
export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // State to store the current user
    const history = useHistory(); // useHistory hook for navigation

    // Function to fetch current user data on mount
    const handleMount = async () => {
        try {
            const { data } = await axiosRes.get("dj-rest-auth/user/"); // Request to get user data
            setCurrentUser(data); // Setting the fetched data to currentUser state
        } catch (err) {
            // Error handling (currently commented out)
            // console.log(err);
        }
    };

    // useEffect to call handleMount on component mount
    useEffect(() => {
        handleMount();
    }, []);

    // useMemo to setup axios interceptors
    useMemo(() => {
        // Request interceptor for axiosReq
        axiosReq.interceptors.request.use(
            async (config) => {
                // Check if the token needs to be refreshed
                if (shouldRefreshToken()) {
                    try {
                        await axios.post("/dj-rest-auth/token/refresh/"); // Refreshing token
                    } catch (err) {
                        // On error, sign out the user and redirect to sign-in page
                        setCurrentUser((prevCurrentUser) => {
                            if (prevCurrentUser) {
                                history.push("/signin");
                            }
                            return null;
                        });
                        removeTokenTimestamp(); // Removing token timestamp
                        return config;
                    }
                }
                return config; // Return the config if no token refresh is needed
            },
            (err) => {
                return Promise.reject(err); // Reject the promise on error
            }
        );

        // Response interceptor for axiosRes
        axiosRes.interceptors.response.use(
            (response) => response, // Simply return the response
            async (err) => {
                // On receiving a 401 status code
                if (err.response?.status === 401) {
                    try {
                        await axios.post("/dj-rest-auth/token/refresh/"); // Attempt to refresh the token
                    } catch (err) {
                        // On error, sign out the user and redirect to sign-in
                        setCurrentUser((prevCurrentUser) => {
                            if (prevCurrentUser) {
                                history.push("/signin");
                            }
                            return null;
                        });
                        removeTokenTimestamp(); // Remove token timestamp
                    }
                    return axios(err.config); // Retry the request with new config
                }
                return Promise.reject(err); // Reject the promise on error
            }
        );
    }, [history]); // Dependency array includes history to ensure updated history object is used

    // Rendering the provider components, passing down the current user and setter function
    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {/* Rendering children components inside the provider */}
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};
