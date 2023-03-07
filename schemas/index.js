const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const connect = () => {
  mongoose
    .connect("mongodb+srv://sparta:sparta@cluster0.s8xsqwz.mongodb.net/?retryWrites=true&w=majority")
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;