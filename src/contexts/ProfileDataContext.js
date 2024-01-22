import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults"; // Custom axios instances for requests and responses
import { useCurrentUser } from "../contexts/CurrentUserContext"; // Hook to access the current user
import { followHelper, unfollowHelper } from "../utils/utils"; // Utility functions for follow and unfollow logic

// Context creation for Profile Data and its setter function
const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

// Custom hooks for accessing our contexts
export const useProfileData = () => useContext(ProfileDataContext); // Hook to access the profile data
export const useSetProfileData = () => useContext(SetProfileDataContext); // Hook to update the profile data

export const ProfileDataProvider = ({ children }) => {
    // State for storing profile data
    const [profileData, setProfileData] = useState({
        pageProfile: { results: [] }, // Data for the page profile
        popularProfiles: { results: [] }, // Data for popular profiles
    });

    const currentUser = useCurrentUser(); // Getting the current user

    // Function to handle follow action
    const handleFollow = async (clickedProfile) => {
        try {
            const { data } = await axiosRes.post("/followers/", {
                followed: clickedProfile.id,
            });

            // Updating profile data after follow action
            setProfileData((prevState) => ({
                ...prevState,
                pageProfile: {
                    results: prevState.pageProfile.results.map((profile) =>
                        followHelper(profile, clickedProfile, data.id)
                    ),
                },
                popularProfiles: {
                    ...prevState.popularProfiles,
                    results: prevState.popularProfiles.results.map((profile) =>
                        followHelper(profile, clickedProfile, data.id)
                    ),
                },
            }));
        } catch (err) {
            // Error handling (currently commented out)
            // console.log(err);
        }
    };

    // Function to handle unfollow action
    const handleUnfollow = async (clickedProfile) => {
        try {
            await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);

            // Updating profile data after unfollow action
            setProfileData((prevState) => ({
                ...prevState,
                pageProfile: {
                    results: prevState.pageProfile.results.map((profile) =>
                        unfollowHelper(profile, clickedProfile)
                    ),
                },
                popularProfiles: {
                    ...prevState.popularProfiles,
                    results: prevState.popularProfiles.results.map((profile) =>
                        unfollowHelper(profile, clickedProfile)
                    ),
                },
            }));
        } catch (err) {
            // Error handling (currently commented out)
            // console.log(err);
        }
    };

    // useEffect to fetch popular profiles on component mount or when currentUser changes
    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(
                    "/profiles/?ordering=-followers_count"
                );
                // Updating popular profiles data
                setProfileData((prevState) => ({
                    ...prevState,
                    popularProfiles: data,
                }));
            } catch (err) {
                // Error handling (currently commented out)
                // console.log(err);
            }
        };

        handleMount();
    }, [currentUser]); // Dependency array to trigger effect when currentUser changes

    // Rendering the provider components, passing down the profile data and functions
    return (
        <ProfileDataContext.Provider value={profileData}>
            <SetProfileDataContext.Provider
                value={{ setProfileData, handleFollow, handleUnfollow }}
            >
                {/* Rendering children components inside the provider */}
                {children}
            </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
    );
};

// These comments provide a clear understanding of the structure and functionality of the ProfileDataProvider component, its contexts, and the custom hooks for profile data management. The comments are placed correctly according to JSX syntax, ensuring no warnings from ESLint.