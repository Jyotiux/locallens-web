const Spot = require("../models/Spot");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs").promises;

exports.createSpot = async (req, res) => {
  console.log("👉 Incoming request to createSpot");
  console.log("📦 Body received:", req.body);
  console.log("📁 Files received:", req.files?.length || 0);

  try {
    const { title, description, category, lat, lng } = req.body;

    // STEP 1: Validate input data
    if (!title || !category || lat === undefined || lng === undefined) {
      console.log("❌ Validation failed: Missing fields", {
        title, category, lat, lng
      });
      return res.status(400).json({ message: "Title, category and coordinates are required" });
    }

    if (isNaN(lat) || isNaN(lng)) {
      console.log("❌ Validation failed: Invalid coordinates", { lat, lng });
      return res.status(400).json({ message: "Latitude and longitude must be numbers" });
    }

    console.log("✅ Validation passed, proceeding with upload and save");

    const imageUrls = [];

    // process uploaded files (if any), upload to Cloudinary, then delete local files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path);
          imageUrls.push(result.secure_url);
        } catch (uploadErr) {
          console.error("Upload failed for file:", file.path, uploadErr);
        } finally {
          // attempt to delete the local file regardless of upload result
          try {
            await fs.unlink(file.path);
          } catch (unlinkErr) {
            console.error("Failed to delete local file:", file.path, unlinkErr);
          }
        }
      }
    }

    const newSpot = new Spot({
      title,
      description,
      category,
      coordinates: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
      imageUrls,
    });

    await newSpot.save();
    res.status(201).json({ message: "Spot created Successfully", spot: newSpot });
  } catch (error) {
    console.error("Error while creating spot:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/spots?limit=4&category=beach
exports.getAllSpots = async (req, res) => {
  try {
    console.log("👉 Incoming request to getAllSpots");
    console.log("🔍 Query params:", req.query);

    const limit = parseInt(req.query.limit) || 4;
    const category = req.query.category;

    const filter = category ? { category } : {};

    const spots = await Spot.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit);

    console.log(`✅ Found ${spots.length} spots (limit: ${limit}, category: ${category || "all"})`);

    res.json(spots);
  } catch (error) {
    console.error("❌ Failed to fetch spots:", error);
    res.status(500).json({ message: "Failed to fetch spots" });
  }
};
