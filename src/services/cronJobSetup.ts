import cron from "node-cron";
import { StudentService } from "../services/implements/studentService";
const studentService = new StudentService();

export default function setupCronJob() {
  // Define the cron schedule (every Monday at 10 am)
  const cronSchedule = "0 10 * * 1";

  const job = cron.schedule(
    cronSchedule,
    () => {
      studentService.scheduledMail();
    },
    {
      scheduled: true,
      timezone: "UTC",
    }
  );

  job.start();
}
