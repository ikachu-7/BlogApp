const { validateToken } = require("../utils/authentication");

function checkforAuth(cookieName) {
    return (req,res,next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) {
           return res.render("register");
        }
        try {
            const userPayload = validateToken(tokenCookieValue);
            req.USER = userPayload;
        } catch (error) {}
        next();
    }
}

module.exports = {
    checkforAuth,
}