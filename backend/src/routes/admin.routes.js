import express from "express";
import {
  getWardComplaints,
  updateComplaintStatus,
  getEscalations,
} from "../controllers/admin.controller.js";

import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// Authority dashboard – ward complaints
router.get(
  "/complaints",
  auth,
  getWardComplaints
);

// Update complaint status
router.patch(
  "/complaints/:complaintId/status",
  auth,
  updateComplaintStatus
);

// Escalation list (admin only)
router.get(
  "/escalations",
  auth,
  getEscalations
);

export default router;
