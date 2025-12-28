import Vote from "../models/vote.model.js";
import Complaint from "../models/complaint.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { calculatePriority } from "../services/priority.service.js";

/**
 * =====================================
 * UPVOTE A COMPLAINT (Citizen)
 * =====================================
 */
export const upvoteComplaint = asyncHandler(async (req, res) => {
  const user = req.user;
  const { complaintId } = req.params;

  if (user.role !== "citizen") {
    throw new ApiError(403, "Only citizens can upvote complaints");
  }

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  // Create vote (DB-level unique index prevents duplicates)
  try {
    await Vote.create({
      complaintId,
      userId: user._id,
    });
  } catch (err) {
    // Duplicate upvote handling
    if (err.code === 11000) {
      throw new ApiError(400, "You have already upvoted this complaint");
    }
    throw err;
  }

  // Increase upvote count
  complaint.upvoteCount += 1;

  // 🔥 Recalculate priority
  complaint.priorityScore = calculatePriority(complaint);

  await complaint.save();

  res.json(
    new ApiResponse(200, null, "Complaint upvoted successfully")
  );
});

/**
 * =====================================
 * REMOVE UPVOTE (Citizen)
 * =====================================
 */
export const removeUpvote = asyncHandler(async (req, res) => {
  const user = req.user;
  const { complaintId } = req.params;

  if (user.role !== "citizen") {
    throw new ApiError(403, "Only citizens can remove upvotes");
  }

  const vote = await Vote.findOneAndDelete({
    complaintId,
    userId: user._id,
  });

  if (!vote) {
    throw new ApiError(400, "You have not upvoted this complaint");
  }

  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  // Decrease upvote count safely
  if (complaint.upvoteCount > 0) {
    complaint.upvoteCount -= 1;
  }

  // 🔥 Recalculate priority
  complaint.priorityScore = calculatePriority(complaint);

  await complaint.save();

  res.json(
    new ApiResponse(200, null, "Upvote removed successfully")
  );
});
