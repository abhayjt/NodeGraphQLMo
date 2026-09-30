import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import connectDB from "./db.js";

import typeDefs from "./scr/grapqluery/typeDefs.js";
import resolvers from "./scr/grapqluery/resolvers.js";

import getUserFromToken from "./scr/middleware/auth.js";


const app = express();


// ==============================
// DATABASE
// ==============================

connectDB();


// ==============================
// SERVER
// ==============================

const startServer = async () => {

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    await server.start();


    // ==============================
    // MIDDLEWARE
    // ==============================

    app.use(
        cors({
            origin: "http://localhost:5174",
            credentials: true
        })
    );

    app.use(express.json());


    // ==============================
    // GRAPHQL
    // ==============================

app.use(
    "/graphql",
    expressMiddleware(server, {
        context: async ({ req }) => {

            const token = req.headers.authorization;

           // console.log("Authorization:", token);

            const user = getUserFromToken(token);

            //console.log("Authenticated user:", user);

            return {
                user
            };
        }
    })
);



    // ==============================
    // PORT
    // ==============================

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

        console.log(
            `GraphQL API http://localhost:${PORT}/graphql`
        );

    });
};


startServer();

