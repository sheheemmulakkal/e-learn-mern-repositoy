import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/db";
import cookieSession from "cookie-session";

import studentRouter from "./src/routes/studentRouter";
import { errorHandler } from "./src/middlewares/errorHandler";

dotenv.config();
dbConnection();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
  })
);

app.use(studentRouter);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("App listening on port 3000...");
});
