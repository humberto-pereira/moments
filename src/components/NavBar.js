import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import logo from "../assets/logo.png"; // Logo image import
import styles from "../styles/NavBar.module.css"; // Custom CSS module for styling
import { NavLink } from "react-router-dom"; // NavLink for navigation with react-router
import {
    useCurrentUser,
    useSetCurrentUser,
} from "../contexts/CurrentUserContext"; // Custom hooks for current user context
import Avatar from "./Avatar"; // Avatar component import
import axios from "axios"; // Axios for HTTP requests
import useClickOutsideToggle from "../hooks/useClickOutsideToggle"; // Custom hook for click outside behavior
import { removeTokenTimestamp } from "../utils/utils"; // Utility function import

const NavBar = () => {
    const currentUser = useCurrentUser(); // Getting the current user data
    const setCurrentUser = useSetCurrentUser(); // Function to update the current user

    // Custom hook for handling navbar toggle on click outside
    const { expanded, setExpanded, ref } = useClickOutsideToggle();

    // Function to handle sign out logic
    const handleSignOut = async () => {
        try {
            await axios.post("dj-rest-auth/logout/"); // Logout request
            setCurrentUser(null); // Resetting the current user on successful logout
            removeTokenTimestamp(); // Removing token timestamp
        } catch (err) {
            // Error handling (currently commented out)
            // console.log(err);
        }
    };

    // JSX for the "Add post" link
    const addPostIcon = (
        <NavLink
            className={styles.NavLink}
            activeClassName={styles.Active}
            to="/posts/create"
        >
            <i className="far fa-plus-square"></i>Add post
        </NavLink>
    );

    // JSX for navigation icons when logged in
    const loggedInIcons = (
        <>
            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/feed"
            >
                <i className="fas fa-stream"></i>Feed
            </NavLink>
            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/liked"
            >
                <i className="fas fa-heart"></i>Liked
            </NavLink>
            <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
                <i className="fas fa-sign-out-alt"></i>Sign out
            </NavLink>
            <NavLink
                className={styles.NavLink}
                to={`/profiles/${currentUser?.profile_id}`}
            >
                <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
            </NavLink>
        </>
    );

    // JSX for navigation icons when logged out
    const loggedOutIcons = (
        <>
            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/signin"
            >
                <i className="fas fa-sign-in-alt"></i>Sign in
            </NavLink>
            <NavLink
                to="/signup"
                className={styles.NavLink}
                activeClassName={styles.Active}
            >
                <i className="fas fa-user-plus"></i>Sign up
            </NavLink>
        </>
    );

    // Main NavBar component return
    return (
        <Navbar
            expanded={expanded} // State for controlling navbar expansion
            className={styles.NavBar}
            expand="md" // Breakpoint for navbar collapse
            fixed="top" // Fixed position at the top
        >
            <Container>
                <NavLink to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="logo" height="45" /> {/* Logo image */}
                    </Navbar.Brand>
                </NavLink>
                {currentUser && addPostIcon} {/* Show "Add post" only for logged-in users */}
                <Navbar.Toggle
                    ref={ref}
                    onClick={() => setExpanded(!expanded)} // Toggle for expanding/collapsing the navbar
                    aria-controls="basic-navbar-nav"
                />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto text-left"> {/* Navigation items */}
                        <NavLink
                            exact
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                            to="/"
                        >
                            <i className="fas fa-home"></i>Home
                        </NavLink>

                        {currentUser ? loggedInIcons : loggedOutIcons} {/* Conditional rendering based on user's login state */}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
