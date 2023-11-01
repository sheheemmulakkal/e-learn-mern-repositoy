import express from "express";
import cors from "cors";

import studentRouter from "./src/routes/studentRouter";
import instrutorRouter from "./src/routes/intstructorRouter";
import { errorHandler } from "./src/middlewares/errorHandler";

const app = express();

app.use(cors({
  origin: "http://localhost:5174",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/instructor", instrutorRouter);
app.use(studentRouter);
app.use(errorHandler);

export { app };