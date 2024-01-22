import { useEffect, useRef, useState } from "react";

// Custom hook to handle outside click behavior for a component
const useClickOutsideToggle = () => {
    const [expanded, setExpanded] = useState(false); // State to track the expanded/collapsed status
    const ref = useRef(null); // Ref to track the DOM element

    useEffect(() => {
        // Function to handle click outside the referenced element
        const handleClickOutside = (event) => {
            // Check if the click is outside of the element
            if (ref.current && !ref.current.contains(event.target)) {
                setExpanded(false); // Collapse the element
            }
        };

        // Adding event listener for mouse up event
        document.addEventListener("mouseup", handleClickOutside);

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
        };
    }, [ref]); // Dependency array includes ref to re-attach event listener if the ref changes

    // Returning the expanded state, the setter function, and the ref
    return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle;

// This code implements a custom React hook useClickOutsideToggle, which provides a mechanism to handle clicks outside a referenced DOM element. It's useful for implementing behaviors like closing a dropdown menu or modal when a user clicks outside of it. The hook utilizes useState for managing the expanded state, useRef to reference the DOM element, and useEffect to handle the side effects related to adding and removing event listeners.