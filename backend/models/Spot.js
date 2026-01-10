const mongoose = require("mongoose");

const spotSchema = new mongoose.Schema({
  title:{
    type : String,
    required : true
  },
  description: String,
  category: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
  imageUrls: [String],
  
},{timestamps:true});

module.exports = mongoose.model("Spot", spotSchema);
