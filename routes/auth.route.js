const express = require("express");
const router = express.Router();
const User = require("../schemas/user.schema.js");
const jwt = require("jsonwebtoken");

//로그인하기, 사용자 인증 API
router.post("/login", async(req, res)=> {
    try {
        const {nickname, password} = req.body;

        const user = await User.findOne({nickname, password});
        if(!user) {
            res.status(400).json({errorMessage: "닉네임 또는 패스워드를 확인해주세요."});
            return;
        }

        const token = jwt.sign({userId: user.userId}, "customized_secret_key");
        res.cookie("authorization", `Bearer ${token}`);
        return res.status(200).json({token});
    } catch (error) {
        res.status(404).json({errorMessage: error.message});
    } 
});

module.exports = router;