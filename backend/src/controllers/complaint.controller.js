import Complaint from "../models/complaint.model.js";
import Ward from "../models/ward.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Services
import { analyzeComplaintWithAI } from "../services/ai.service.js";
import { calculatePriority } from "../services/priority.service.js";

/**
 * ===============================
 * CREATE COMPLAINT (Citizen)
 * ===============================
 */
export const createComplaint = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "citizen") {
    throw new ApiError(403, "Only citizens can report complaints");
  }

  const { description, location } = req.body;
  const imageUrl = req.imageUrl;

  if (
    !description ||
    !imageUrl ||
    !location ||
    !location.lat ||
    !location.lng
  ) {
    throw new ApiError(400, "Description, image and location are required");
  }

  const lat = Number(location.lat);
  const lng = Number(location.lng);

  if (isNaN(lat) || isNaN(lng)) {
    throw new ApiError(400, "Latitude and longitude must be numbers");
  }

  /**
   * Ward detection (existing logic – unchanged)
   */
  const ward = await Ward.findOne({
    boundary: {
      $geoIntersects: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
    },
  });

  if (!ward) {
    throw new ApiError(404, "Ward not found for this location");
  }

  /**
   * STEP 1: Create complaint immediately (FAST UX)
   */
  const complaint = await Complaint.create({
    reportedBy: user._id,
    description,
    imageUrl,
    location: {
      lat,
      lng,
    },
    wardId: ward._id,
  });

  /**
   * STEP 2: Respond immediately
   */
  res.status(201).json(
    new ApiResponse(201, complaint, "Complaint submitted successfully")
  );

  /**
   * STEP 3: AI + Priority (ASYNC, NON-BLOCKING)
   */
  try {
    const aiResult = await analyzeComplaintWithAI({
      imageUrl,
      description,
    });

    complaint.aiCategory = aiResult.category;
    complaint.aiSeverity = aiResult.severity;
    complaint.aiKeywords = aiResult.keywords;

    complaint.priorityScore = calculatePriority(complaint);

    await complaint.save();
  } catch (err) {
    console.error("AI processing failed:", err.message);
    // Fail silently – complaint already exists
  }
});

/**
 * ===============================
 * GET ALL COMPLAINTS (Map View)
 * ===============================
 */
export const getAllComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find()
    .select("location priorityScore aiCategory status")
    .sort({ priorityScore: -1 });

  res.json(
    new ApiResponse(200, complaints, "Complaints fetched successfully")
  );
});

// Get ward complaints (authority)

export const getWardComplaints = asyncHandler(async(req,res) => {
    const user = req.user;

    if(user.role !== "authority"){
        throw new ApiError(403,"Access Denied");
    }

    const complaints = await Complaint.find({
        wardId: user.wardId
    }).sort({priorityScore: -1, createdAt: -1});

    res.json(
        new ApiResponse(200, complaints,"Ward complaints fetched successfully")
    );
});

// get single complaint

export const getComplaintById = asyncHandler(async(req,res)=>{
    const {complaintId} = req.params;

    const complaint = await Complaint.findById(complaintId)
        .populate("reportedBy","name email")
        .populate("wardId","name city");

    if(!complaint){
        throw new ApiError(404,"Complaint not found");
    }

    res.json(
        new ApiResponse(200,complaint,"Complaint fetched successfully")
    );
});

// Update complaint status 

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const user = req.user;
  const { complaintId } = req.params;
  const { status, authorityRemarks, afterFixImageUrl } = req.body;

  if (user.role !== "authority") {
    throw new ApiError(403, "Only authorities can update complaints");
  }

  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  if (!complaint.wardId.equals(user.wardId)) {
    throw new ApiError(403, "Not authorized to update this complaint");
  }

  complaint.status = status;
  complaint.authorityRemarks = authorityRemarks || complaint.authorityRemarks;

  if (status === "resolved") {
    if (!afterFixImageUrl) {
      throw new ApiError(400, "After-fix image is required to resolve complaint");
    }

    complaint.afterFixImageUrl = afterFixImageUrl;
    complaint.resolvedAt = new Date();
  }

  await complaint.save();

  res.json(
    new ApiResponse(200, complaint, "Complaint updated successfully")
  );
});

// Delete Complaint

export const deleteComplaint = asyncHandler(async (req, res) => {
  const user = req.user;
  const { complaintId } = req.params;

  if (user.role !== "authority") {
    throw new ApiError(403, "Only municipal admins can delete complaints");
  }

  const complaint = await Complaint.findByIdAndDelete(complaintId);

  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }

  res.json(
    new ApiResponse(200, null, "Complaint deleted successfully")
  );
});