const express = require("express");
const router = express.Router();
const User = require("../schemas/user.schema.js");
const authMiddleware = require("../middlewares/auth-middleware.js");

//유저 가입하기, 회원 가입
router.post('/users', async(req, res)=>{
  const {email, nickname, password, confirmPassword} = req.body;
  
  const isExistUser = await User.findOne({$or: [{email},{nickname}]});
  const nicknamePattern = /^[a-zA-Z0-9]{3,}$/;

  if (!nicknamePattern.test(nickname)) {
    res.status(400).json({errorMessage: "닉네임은 3자 이상, 영문, 숫자로만 구성되어야합니다."});
    return;
  } else if (isExistUser) {
    res.status(400).json({errorMessage: "이메일 또는 닉네임이 이미 사용중입니다."});
    return;
  } else if (password.length <= 4) {
    res.status(400).json({errorMessage: "패스워드는 4글자 이상이어야합니다."});
    return;
  } else if (password.includes(nickname)) {
    res.status(400).json({errorMessage: "패스워드에는 닉네임이 포함되어선 안됩니다."});
    return;
  } else if (password !== confirmPassword) {
    res.status(400).json({"errorMessage": "패스워드가 일치하지 않습니다."});
    return;
  } 

  try {
    await User.create({email, nickname, password});
    return res.status(201).json({success:true, "message": "회원 가입에 성공하였습니다."});
  } catch (error) {
    res.status(404).json({errorMessage: error.message});
  }
  
});

module.exports = router;