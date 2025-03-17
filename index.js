const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const app = express();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
    //we should store this in dotenv file
  await mongoose.connect(
    "mongodb+srv://abhi7033:Abhi%407033@cluster0.m7f6z.mongodb.net/coursea"
  );
  app.listen(3000);
  console.log("Listening");
  
}

main()
