const jwt = require("jsonwebtoken");
const User = require("../schemas/user.schema.js");

module.exports = async (req, res, next) => {
    const {Authorization} = req.cookies;
    const [authType, authToken] = (Authorization ?? "").split(" ");

    if(authType !== "Bearer" || !authToken) {
        res.status(400).json({errorMessage: "전달된 쿠키에서 오류가 발생하였습니다."});
        return;
    }

    try {
        const {userId} = jwt.verify(authToken, "customized_secret_key");
        const user = await User.findById(userId);
        res.locals.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({errorMessage: "로그인 후에 이용할 수 있는 기능입니다."});
        return;
    }
}