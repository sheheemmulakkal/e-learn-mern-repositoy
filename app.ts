import express from "express";
import cookieSession from "cookie-session";
import studentRouter from "./src/routes/studentRouter";
import instrutorRouter from "./src/routes/intstructorRouter";
import { errorHandler } from "./src/middlewares/errorHandler";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
  })
);
app.use("/instructor", instrutorRouter);
app.use(studentRouter);
app.use(errorHandler);

export { app };