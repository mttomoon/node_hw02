const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3001;

const usersRouter = require('./routes/users.route.js');
const authRouter = require('./routes/auth.route.js');
const postsRouter = require('./routes/posts.route.js');
const commentsRouter = require('./routes/comments.route.js');
const connect = require("./schemas");
connect();

app.use(express.json()); //req 객체 안에 있는 body를 사용하기 위해서는 이 코드로 미들웨어 등록해야지만 사용 가능
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static("assets"));
app.use("/api", [ usersRouter, authRouter, postsRouter, commentsRouter ]);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});