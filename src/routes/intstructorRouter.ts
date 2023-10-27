import { Router } from "express";
import { InstructorController } from "../controllers/instructorController";
import { signupValidation } from "../middlewares/validations";
import { validateRequest } from "../middlewares/validateRequest";

const instructorController = new InstructorController();
const router = Router();

router.post("/signup", 
  signupValidation,
  validateRequest,
  instructorController.signup
);
router.post("/resend-otp", instructorController.resendOtp);
router.post("/verify-otp", instructorController.VerifyInstructor);
router.post("/login", instructorController.login);

export default router;