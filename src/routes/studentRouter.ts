import { Router } from "express";
import { StudentController } from "../controllers/studentController";
import { signupValidation } from "../middlewares/validations";
import { validateRequest } from "../middlewares/validateRequest";
import { isStudentAuth } from "../middlewares/currentUser";

import { upload } from "../middlewares/multer";

const studentController = new StudentController();
const router = Router();

router.post(
  "/signup",
  signupValidation,
  validateRequest,
  studentController.signup
);

router.post("/resend-otp", studentController.resendOtp);
router.post("/verify-otp", studentController.verifyStudent);
router.post("/login", studentController.login);
router.get("/courses", studentController.getCourses);
router.patch(
  "/change-password",
  isStudentAuth,
  studentController.updatePassword
);
router.put("/update-profile", isStudentAuth, studentController.udateProfile);
router.put(
  "/update-profile-image",
  isStudentAuth,
  upload.single("image"),
  studentController.udateProfileImage
);
router.get("/course/:courseId", studentController.getSingleCourse);
router.get("/search-course", studentController.searchCourses);
router.post(
  "/verify-forgot-password-otp",
  studentController.forgotPasswordOtpVerification
);
router.post("/forgot-password", studentController.resetForgottedPassword);
router.post("/create-payment-intent", studentController.stripePaymentIntent);
router.post("/create-payment", isStudentAuth, studentController.enrollCourse);

export default router;
