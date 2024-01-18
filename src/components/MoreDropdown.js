import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";
import { useHistory } from "react-router";

// ThreeDots: A forwardRef component to pass a ref down to the DOM node for the Dropdown
const ThreeDots = React.forwardRef(({ onClick }, ref) => (
    // Icon for the dropdown toggle
    <i
        className="fas fa-ellipsis-v" // Using Font Awesome's vertical ellipsis icon
        ref={ref} // Ref forwarding for DOM access
        onClick={(e) => {
            e.preventDefault(); // Prevents default actions like page reload
            onClick(e); // Propagates the onClick event
        }}
    />
));

// MoreDropdown: Dropdown component for general actions like Edit and Delete
export const MoreDropdown = ({ handleEdit, handleDelete }) => {
    return (
        <Dropdown className="ml-auto" drop="left"> {/* Bootstrap dropdown aligned to the left */}
            <Dropdown.Toggle as={ThreeDots} /> {/* Using ThreeDots as the dropdown toggle */}

            <Dropdown.Menu
                className="text-center" // Center aligns text inside the dropdown
                popperConfig={{ strategy: "fixed" }} // Config for Popper.js (used for positioning)
            >
                {/* Dropdown item for the Edit action */}
                <Dropdown.Item
                    className={styles.DropdownItem}
                    onClick={handleEdit}
                    aria-label="edit" // Accessibility label
                >
                    <i className="fas fa-edit" /> {/* Edit icon */}
                </Dropdown.Item>

                {/* Dropdown item for the Delete action */}
                <Dropdown.Item
                    className={styles.DropdownItem}
                    onClick={handleDelete}
                    aria-label="delete" // Accessibility label
                >
                    <i className="fas fa-trash-alt" /> {/* Delete icon */}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

// ProfileEditDropdown: Dropdown for profile-related actions (edit profile, username, password)
export const ProfileEditDropdown = ({ id }) => {
    const history = useHistory(); // useHistory hook for navigation

    return (
        <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left"> {/* Dropdown with left alignment and custom styling */}
            <Dropdown.Toggle as={ThreeDots} /> {/* Dropdown toggle using the ThreeDots component */}

            <Dropdown.Menu> {/* Dropdown menu for profile editing */}
                {/* Item for editing the profile */}
                <Dropdown.Item
                    onClick={() => history.push(`/profiles/${id}/edit`)}
                    aria-label="edit-profile" // Accessibility label
                >
                    <i className="fas fa-edit" /> edit profile {/* Edit profile icon and text */}
                </Dropdown.Item>

                {/* Item for editing the username */}
                <Dropdown.Item
                    onClick={() => history.push(`/profiles/${id}/edit/username`)}
                    aria-label="edit-username" // Accessibility label
                >
                    <i className="far fa-id-card" /> change username {/* Change username icon and text */}
                </Dropdown.Item>

                {/* Item for editing the password */}
                <Dropdown.Item
                    onClick={() => history.push(`/profiles/${id}/edit/password`)}
                    aria-label="edit-password" // Accessibility label
                >
                    <i className="fas fa-key" /> change password {/* Change password icon and text */}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};
