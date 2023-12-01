import express from "express";
import cors from "cors";
import { createServer } from "http";
import { io } from "./src/services/socketIoService";
import studentRouter from "./src/routes/studentRouter";
import instrutorRouter from "./src/routes/intstructorRouter";
import adminRouter from "./src/routes/adminRouter";
import { errorHandler } from "./src/middlewares/errorHandler";

const app = express();

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

const httpServer = createServer(app);
io.attach(httpServer);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/instructor", instrutorRouter);
app.use("/admin", adminRouter);
app.use(studentRouter);
app.use(errorHandler);

export { httpServer };
