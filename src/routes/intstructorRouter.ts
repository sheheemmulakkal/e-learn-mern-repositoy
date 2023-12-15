import { Router } from "express";
import { InstructorController } from "../controllers/instructorController";
import { signupValidation, courseValidation } from "../middlewares/validations";
import { isInstructorAuth } from "../middlewares/currentUser";
import { validateRequest } from "../middlewares/validateRequest";

import { upload } from "../middlewares/multer";

const instructorController = new InstructorController();
const router = Router();

router.post(
  "/signup",
  signupValidation,
  validateRequest,
  instructorController.signup
);
router.post("/resend-otp", instructorController.resendOtp);
router.post("/verify-otp", instructorController.VerifyInstructor);
router.post("/login", instructorController.login);
router.get("/my-courses", isInstructorAuth, instructorController.getMycourses);
router.get(
  "/course/:courseId",
  isInstructorAuth,
  instructorController.getSingleCourse
);
router.post(
  "/course",
  isInstructorAuth,
  courseValidation,
  validateRequest,
  instructorController.addCourse
);
router.put("/course", isInstructorAuth, instructorController.updateCourse);
router.patch(
  "/delete-course",
  isInstructorAuth,
  instructorController.deleteCourse
);
router.get(
  "/all-categories",
  isInstructorAuth,
  instructorController.getAllCategories
);
router.post(
  "/create-module",
  upload.single("file"),
  instructorController.createModule
);
router.put(
  "/add-course-image",
  upload.single("image"),
  instructorController.updateCourseImage
);
router.post(
  "/verify-forgot-password-otp",
  instructorController.forgotPasswordOtpVerification
);
router.post("/forgot-password", instructorController.resetForgottedPassword);
router.post("/add-chapter", isInstructorAuth, instructorController.addChapter);
export default router;
