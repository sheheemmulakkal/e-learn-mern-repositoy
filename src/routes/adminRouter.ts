import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { isAdminAuth } from "../middlewares/currentUser";

const router = Router();
const adminController = new AdminController();

router.post("/login", adminController.login);
router.get("/get-students", isAdminAuth, adminController.getAllStudents);
router.get("/get-instructors", isAdminAuth, adminController.getAllInstructors);
router.patch("/block-student", isAdminAuth, adminController.blockStudent);
router.patch("/unblock-student", isAdminAuth, adminController.unblockStudent);
router.patch("/block-instructor", isAdminAuth, adminController.blockInstructor);
router.patch(
  "/unblock-instructor",
  isAdminAuth,
  adminController.unblockInstructor
);

router.get("/categories", isAdminAuth, adminController.getAllCategories);
router.post("/category", isAdminAuth, adminController.addCategory);
router.put("/category", isAdminAuth, adminController.editCategory);
router.patch("/list-category", isAdminAuth, adminController.listCategory);
router.patch("/unlist-category", isAdminAuth, adminController.unlistCategory);

router.get("/levels", isAdminAuth, adminController.getAllLevels);
router.post("/level", isAdminAuth, adminController.addLevel);
router.put("/level", isAdminAuth, adminController.editLevel);
router.patch("/list-level", isAdminAuth, adminController.listLevel);
router.patch("/unlist-level", isAdminAuth, adminController.unlistLevel);

router.get("/languages", isAdminAuth, adminController.getAllLanguages);
router.post("/language", isAdminAuth, adminController.addLanguage);
router.put("/language", isAdminAuth, adminController.editLanguage);
router.patch("/list-language", isAdminAuth, adminController.listLanguage);
router.patch("/unlist-language", isAdminAuth, adminController.unlistLanguage);

router.get("/courses", isAdminAuth, adminController.getAllCourses);
router.get("/pending-course", isAdminAuth, adminController.getPendingCourses);
router.get("/rejected-course", isAdminAuth, adminController.getRejectedCourses);
router.get("/course/:courseId", isAdminAuth, adminController.getSingleCourse);
router.get("/approved-course", isAdminAuth, adminController.getApprovedCourses);
router.patch("/list-course", isAdminAuth, adminController.listCourse);
router.patch("/unlist-course", isAdminAuth, adminController.unlistCourse);
router.patch("/approve-course", isAdminAuth, adminController.approveCourse);
router.patch("/reject-course", isAdminAuth, adminController.rejectCourse);
router.get("/dashboard", adminController.adminDashBoard);
router.get("/course/:id/module");
router.patch("/list-module");
router.patch("/unlist-module");

export default router;
