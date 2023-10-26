import { Router } from "express";
import { StudentController } from "../controllers/studentController";
import { signupValidation } from "../middlewares/validations";
import { validateRequest } from "../middlewares/validateRequest";

const studentController = new StudentController();
const router = Router();

router.post(
  "/signup",
  signupValidation,
  validateRequest,
  studentController.signup
);

router.post("/resend-otp",
  studentController.resendOtp
);

router.post(
  "/verify-otp",
  studentController.verifyStudent
);

router.post(
  "/login",
  studentController.login
);

router.get("/logout",
  studentController.signout
);

export default router;
