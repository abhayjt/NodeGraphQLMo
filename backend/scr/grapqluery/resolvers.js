import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";


// ========================================
// CREATE TOKEN
// ========================================

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


// ========================================
// FORMAT USER
// ========================================

const formatUser = (user) => {

    if (!user) {
        return null;
    }

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
            ? user.createdAt.toISOString()
            : null,
        updatedAt: user.updatedAt
            ? user.updatedAt.toISOString()
            : null
    };

};


// ========================================
// AUTH CHECK
// ========================================

const requireAuth = (context) => {

    if (!context || !context.user) {
        throw new Error("Authentication required");
    }

    if (!context.user.userId) {
        throw new Error("Authentication required");
    }

    return context.user.userId;

};


// ========================================
// RESOLVERS
// ========================================

const resolvers = {

    // ========================================
    // QUERY
    // ========================================

    Query: {

        // ------------------------------------
        // GET ALL USERS
        // ------------------------------------

        users: async (_, __, context) => {

            requireAuth(context);

            const users = await User.find()
                .sort({ createdAt: -1 });

            return users.map(formatUser);

        },


        // ------------------------------------
        // GET CURRENT USER
        // ------------------------------------

        me: async (_, __, context) => {

            const userId = requireAuth(context);

            console.log(
                "CURRENT USER ID:",
                userId
            );

            const user = await User.findById(userId);

            if (!user) {
                throw new Error("User not found");
            }

            return formatUser(user);

        }

    },


    // ========================================
    // MUTATION
    // ========================================

    Mutation: {

        // ------------------------------------
        // REGISTER
        // ------------------------------------

        register: async (
            _,
            { name, email, password }
        ) => {

            const normalizedEmail =
                email.toLowerCase().trim();

            const existingUser =
                await User.findOne({
                    email: normalizedEmail
                });

            if (existingUser) {
                throw new Error(
                    "Email already registered"
                );
            }

            const hashedPassword =
                await bcrypt.hash(password, 10);

            const user = await User.create({

                name: name.trim(),

                email: normalizedEmail,

                password: hashedPassword

            });

            const token =
                createToken(user);

            return {

                token,

                user: formatUser(user)

            };

        },


        // ------------------------------------
        // LOGIN
        // ------------------------------------

        login: async (
            _,
            { email, password }
        ) => {

            const normalizedEmail =
                email.toLowerCase().trim();

            const user =
                await User.findOne({
                    email: normalizedEmail
                });

            if (!user) {
                throw new Error(
                    "Invalid email or password"
                );
            }

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {
                throw new Error(
                    "Invalid email or password"
                );
            }

            const token =
                createToken(user);

            return {

                token,

                user: formatUser(user)

            };

        },


        // ------------------------------------
        // UPDATE USER
        // ------------------------------------

        updateUser: async (
            _,
            { id, name, email },
            context
        ) => {

            const loggedInUserId =
                requireAuth(context);

            console.log(
                "Logged in user:",
                loggedInUserId
            );

            console.log(
                "User being updated:",
                id
            );


            // User can update only own profile
            if (loggedInUserId !== id) {

                throw new Error(
                    "You can only update your own profile"
                );

            }


            const user =
                await User.findById(id);

            if (!user) {

                throw new Error(
                    "User not found"
                );

            }


            // Update name

            if (
                name !== undefined &&
                name !== null
            ) {

                user.name =
                    name.trim();

            }


            // Update email

            if (
                email !== undefined &&
                email !== null
            ) {

                const normalizedEmail =
                    email.toLowerCase().trim();


                const existingUser =
                    await User.findOne({

                        email: normalizedEmail,

                        _id: {
                            $ne: id
                        }

                    });


                if (existingUser) {

                    throw new Error(
                        "Email already registered by another user"
                    );

                }


                user.email =
                    normalizedEmail;

            }


            const updatedUser =
                await user.save();


            console.log(
                "UPDATED USER:",
                updatedUser._id.toString()
            );


            return formatUser(
                updatedUser
            );

        },


        // ------------------------------------
        // DELETE USER
        // ------------------------------------

        deleteUser: async (
            _,
            { id },
            context
        ) => {

            const loggedInUserId =
                requireAuth(context);


            console.log(
                "Logged in user:",
                loggedInUserId
            );

            console.log(
                "User being deleted:",
                id
            );


            // User can delete only own account
            if (loggedInUserId !== id) {

                throw new Error(
                    "You can only delete your own account"
                );

            }


            const user =
                await User.findById(id);

            if (!user) {

                throw new Error(
                    "User not found"
                );

            }


            await User.findByIdAndDelete(id);


            return true;

        }

    }

};


export default resolvers;

