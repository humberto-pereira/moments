import React, { useState } from "react";
import axios from "axios";

// Importing React Bootstrap components for layout and UI elements
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

// React Router components for navigation
import { Link, useHistory } from "react-router-dom";

// Importing CSS modules for custom styles
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

// Contexts and custom hooks for user management and redirection
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimestamp } from "../../utils/utils";

function SignInForm() {
    const setCurrentUser = useSetCurrentUser(); // Hook for setting the current user
    useRedirect("loggedIn"); // Redirects if user is already logged in

    // State for managing user input for sign-in
    const [signInData, setSignInData] = useState({ username: "", password: "" });
    const { username, password } = signInData; // Destructuring for easier access

    // State for handling validation errors
    const [errors, setErrors] = useState({});

    const history = useHistory(); // useHistory hook for navigation

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents default form submission behavior
        try {
            // Post request to login endpoint
            const { data } = await axios.post("/dj-rest-auth/login/", signInData);
            setCurrentUser(data.user); // Setting the current user on successful login
            setTokenTimestamp(data); // Updating token timestamp
            history.goBack(); // Navigate to the previous page
        } catch (err) {
            setErrors(err.response?.data); // Setting validation errors received from the server
        }
    };

    // Function to handle changes in input fields
    const handleChange = (event) => {
        setSignInData({
            ...signInData,
            [event.target.name]: event.target.value, // Updating the sign-in data with user input
        });
    };

    // Rendering the sign-in form
    return (
        <Row className={styles.Row}>
            <Col className="my-auto p-0 p-md-2" md={6}>
                {/* Container for the form elements */}
                <Container className={`${appStyles.Content} p-4 `}>
                    <h1 className={styles.Header}>sign in</h1>
                    <Form onSubmit={handleSubmit}>
                        {/* Username input field */}
                        <Form.Group controlId="username">
                            <Form.Label className="d-none">Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                name="username"
                                className={styles.Input}
                                value={username}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {/* Display errors for username */}
                        {errors.username?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}

                        {/* Password input field */}
                        <Form.Group controlId="password">
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                className={styles.Input}
                                value={password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {/* Display errors for password */}
                        {errors.password?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}

                        {/* Sign-in button */}
                        <Button
                            className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
                            type="submit"
                        >
                            Sign in
                        </Button>

                        {/* Display non-field specific errors */}
                        {errors.non_field_errors?.map((message, idx) => (
                            <Alert key={idx} variant="warning" className="mt-3">
                                {message}
                            </Alert>
                        ))}
                    </Form>
                </Container>

                {/* Link to sign-up page */}
                <Container className={`mt-3 ${appStyles.Content}`}>
                    <Link className={styles.Link} to="/signup">
                        Don't have an account? <span>Sign up now!</span>
                    </Link>
                </Container>
            </Col>

            {/* Right-hand side image for aesthetics */}
            <Col
                md={6}
                className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
                >
                <Image
                    className={`${appStyles.FillerImage}`}
                    src={"https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero.jpg"}
                />
            </Col>
        </Row>
    );
}

export default SignInForm;


/*Context and Hooks: It uses the useSetCurrentUser context to set the current user's state upon successful sign-in and the useRedirect hook to redirect the user if they are already logged in.

State Management: The component manages its state using the useState hook for signInData (to store username and password) and errors (to handle any validation errors).

Form Handling:

handleSubmit: An asynchronous function that handles the form submission. It prevents the default form submission, makes a POST request to the login endpoint, and updates the current user's state. If there's an error (like invalid credentials), it captures and displays these errors.
handleChange: Updates the signInData state whenever the user types in the username or password fields.
Rendering: The component is rendered as a form within a responsive grid layout:

Form Fields: There are input fields for the username and password. Validation errors are displayed under each field using the Alert component from React Bootstrap.
Sign-in Button: A button to submit the form.
Navigation Links: A link to the sign-up page for users who don't have an account.
Aesthetic Image: On larger screens, an image is displayed beside the form for visual appeal.
*/
