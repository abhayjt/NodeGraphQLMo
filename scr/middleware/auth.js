import jwt   from 'jsonwebtoken'

const getUserFromToken = (token) => {
    try {
        if (!token) {
            return null;
        }

        const decoded = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.JWT_SECRET
        );

        return decoded;
    } catch (error) {
        return null;
    }
};



export default getUserFromToken;