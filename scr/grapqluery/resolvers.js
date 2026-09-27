import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const createToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

const resolvers = {
    Query: {
        users: async (_, __, context) => {
            if (!context.user) {
                throw new Error("Authentication required");
            }

            return await User.find().select("-password");
        },

        me: async (_, __, context) => {
            if (!context.user) {
                throw new Error("Authentication required");
            }

            return await User.findById(context.user.userId)
                .select("-password");
        }
    },

    Mutation: {
        register: async (_, { name, email, password }) => {

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                throw new Error("Email already registered");
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = await User.create({
                name,
                email,
                password: hashedPassword
            });

            const token = createToken(user);

            return {
                token,
                user
            };
        },

        login: async (_, { email, password }) => {

            const user = await User.findOne({ email });

            if (!user) {
                throw new Error("Invalid email or password");
            }

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                throw new Error("Invalid email or password");
            }

            const token = createToken(user);

            return {
                token,
                user
            };
        }
    }
};

export default resolvers;