import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { isAdminAuth } from "../middlewares/currentUser";

const router = Router();
const adminController = new AdminController();

router.post("/login", adminController.login);
router.get("/get-students",isAdminAuth, adminController.getAllStudents);
router.get("/get-instructors",isAdminAuth, adminController.getAllInstructors);
router.patch("/block-student",isAdminAuth, adminController.blockStudent);
router.patch("/unblock-student",isAdminAuth, adminController.unblockStudent);
router.patch("/block-instructor",isAdminAuth, adminController.blockInstructor);
router.patch("/unblock-instructor",isAdminAuth, adminController.unblockInstructor);


export default router;
