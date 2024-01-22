import { rest } from "msw"; // Importing 'rest' from Mock Service Worker (MSW) library

const baseURL = "https://d-r-framework-03171bbf61e6.herokuapp.com/"; // Base URL for the API

export const handlers = [
    // MSW handler for GET requests to the user endpoint
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
        // Returning a mock response for user data
        return res(
            ctx.json({
                "pk": 19,
                "username": "user2",
                "email": "",
                "first_name": "",
                "last_name": "",
                "profile_id": 19,
                "profile_image": "https://res.cloudinary.com/h-pereira/image/upload/v1/media/images/3_ha7bhb"
            })
        );
    }),

    // MSW handler for POST requests to the logout endpoint
    rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
        // Returning a mock response with a status code of 200 (OK) for logout
        return res(ctx.status(200));
    }),
];

// These handlers are part of the MSW setup, which allows you to intercept network requests and return mocked responses. This is especially useful in testing environments to simulate different backend responses without making actual API calls. The first handler mocks the response for a user data request, and the second one simulates a successful logout operation.