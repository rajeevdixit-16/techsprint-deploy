import express from "express"
import { createComplaint,deleteComplaint,getAllComplaints, getComplaintById, getWardComplaints, updateComplaintStatus } from "../controllers/complaint.controller.js"

import auth from "../middleware/auth.middleware.js"

import upload, {uploadImage} from "../middleware/upload.middleware.js"

const router = express.Router();

// Create complaint
router.post("/",auth,upload.single("image"),uploadImage,createComplaint);

// get all complaints
router.get("/allComplaints",getAllComplaints)

// get complaints for authority
router.get("/ward",auth,getWardComplaints);

// get single complaint
router.get("/:complaintId",getComplaintById);

// Update status
router.put("/:complaintId",auth,updateComplaintStatus);

// delete complaint
router.delete("/:complaintId",auth,deleteComplaint);

export default router;