import { rest } from "msw";

const baseURL = "https://d-r-framework-03171bbf61e6.herokuapp.com/";

export const handlers = [
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
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
    rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
        return res(ctx.status(200));
    }),
];