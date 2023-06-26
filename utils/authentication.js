const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const createTokenForUser = (user) => {
    const payload = {
        fullName: user.fullName,
        _id: user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
    };
    const token = jwt.sign(payload,secret);
    return token;
}

const validateToken = (token) => {
    const payload = jwt.verify(token,secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken
}