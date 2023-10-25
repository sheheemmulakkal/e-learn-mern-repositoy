
import mongoose from "mongoose";

export default async function() {
  await mongoose.connect( process.env.DATABASE_URL! )
    .then(() => {
      console.log("Database connected successfully...");
    })
    .catch((err) => {
      console.log("Database connection failed...",err.message);
        
    });
}