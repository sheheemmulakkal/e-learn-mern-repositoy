import { app } from "./app";
import dotenv from "dotenv";
import dbConnection from "./config/db";

dotenv.config();
dbConnection();

app.listen(3000, () => {
  console.log("App listening on port 3000...");
});
