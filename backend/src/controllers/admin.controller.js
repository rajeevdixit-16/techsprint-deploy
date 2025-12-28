import Complaint from "../models/complaint.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { calculatePriority } from "../services/priority.service.js";

/**
 * =====================================
 * GET WARD COMPLAINTS (Authority/Admin)
 * =====================================
 */
export const getWardComplaints = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "authority" && user.role !== "admin") {
    throw new ApiError(403, "Access denied");
  }

  const { status, category } = req.query;

  const filter = {
    wardId: user.wardId,
  };

  if (status) filter.status = status;
  if (category) filter.aiCategory = category;

  const complaints = await Complaint.find(filter)
    .sort({ priorityScore: -1 })
    .populate("reportedBy", "name email");

  res.json(
    new ApiResponse(200, complaints, "Ward complaints fetched successfully")
  );
});

/**
 * =====================================
 * UPDATE COMPLAINT STATUS (Authority)
 * =====================================
 */
export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const user = req.user;
  const { complaintId } = req.params;
  const { status, remarks } = req.body;

  if (user.role !== "authority") {
    throw new ApiError(403, "Only authority can update complaint status");
  }

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  // Ensure authority belongs to same ward
  if (complaint.wardId.toString() !== user.wardId) {
    throw new ApiError(403, "Not authorized for this ward");
  }

  complaint.status = status;
  complaint.authorityRemarks = remarks || complaint.authorityRemarks;
  complaint.statusUpdatedAt = new Date();

  if (status === "resolved") {
    complaint.resolvedAt = new Date();
  }

  // 🔥 Priority recalculation on status change
  complaint.priorityScore = calculatePriority(complaint);

  await complaint.save();

  res.json(
    new ApiResponse(200, complaint, "Complaint status updated successfully")
  );
});

/**
 * =====================================
 * GET ESCALATED COMPLAINTS (Admin)
 * =====================================
 */
export const getEscalations = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "admin") {
    throw new ApiError(403, "Admin access only");
  }

  const days = Number(req.query.days || 3);

  const thresholdDate = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  );

  const escalatedComplaints = await Complaint.find({
    status: { $ne: "resolved" },
    priorityScore: { $gte: 80 },
    createdAt: { $lte: thresholdDate },
  }).sort({ priorityScore: -1 });

  res.json(
    new ApiResponse(
      200,
      escalatedComplaints,
      "Escalated complaints fetched successfully"
    )
  );
});