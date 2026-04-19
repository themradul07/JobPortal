import express from "express";
import { isAuth } from "../middleware/auth";
import { addSkillToUser, applyForJob, deleteSkillFromUser, getAllapplications, getUserProfile, myProfile, updateProfilePic, updateResume, updateUserProfile } from "../controllers/user";
import uploadFile from "../middleware/multer";
const router = express.Router();

router.get('/me', isAuth, myProfile);
router.get('/:userId', isAuth, getUserProfile);
router.put("/update/profile", isAuth, updateUserProfile);
router.put("/update/pic", isAuth, uploadFile, updateProfilePic);
router.put("/update/resume", isAuth, uploadFile, updateResume);
router.put("/add/skill", isAuth, addSkillToUser);
router.put("/delete/skill", isAuth, deleteSkillFromUser);  
router.post("/apply/:jobId", isAuth, applyForJob); 
router.get("/applications/all", isAuth, getAllapplications);

export default router;