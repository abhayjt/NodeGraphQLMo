import jwt from "jsonwebtoken";

const getUserFromToken = (token) => {

    if (!token) {
        return null;
    }

    try {

        const actualToken = token.startsWith("Bearer ")
            ? token.substring(7)
            : token;

        const decoded = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        return decoded;

    } catch (error) {

        console.log("JWT Error:", error.message);

        return null;
    }
};

export default getUserFromToken;

