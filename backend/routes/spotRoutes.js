const express = require("express");

const router = express.Router();

const spotController = require("../controllers/spotController");

const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/spots", upload.array("images", 5), spotController.createSpot);
router.get("/spots", spotController.getAllSpots);

module.exports = router;
