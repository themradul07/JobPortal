import express from "express";
import { createCompany, createJob, deleteCompany, deleteJob, getAllActiveJobs, getAllApplicationsForJob, getAllCompany, getCompanyDetails, getSingleJob, updateApplication, updateJob } from "../controllers/job.js";
import { isAuth } from "../middleware/auth.js";
import uploadFile from "../middleware/multer.js";

const router = express.Router();

router.post("/create/new", isAuth, uploadFile, createCompany);
router.delete("/company/:companyId", isAuth, deleteCompany);
router.delete("/job/:jobId", isAuth, deleteJob);
router.post("/new", isAuth, createJob);
router.put("/:jobId", isAuth, updateJob);
router.get("/company/all", isAuth, getAllCompany);
router.get("/company/:id", isAuth, getCompanyDetails);
router.get("/all", getAllActiveJobs);
router.get("/:jobId",  getSingleJob);
router.get("/:jobId/applications", isAuth, getAllApplicationsForJob);
router.put("/update/:id", isAuth, updateApplication);

export default router;