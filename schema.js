const mongoose = require("mongoose");

const example = new mongoose.Schema({
   query: String,               // Maps to 'question' in the CSV
   response1: String,            // Maps to 'response 1' in the CSV
   response2: String,            // Maps to 'response 2' in the CSV
   reward_model_preferred_response: String,      // Maps to 'reward_model_preferred_response' in the CSV
});

// Modify the 3rd parameter to specify which MongoDB collection to use
module.exports = mongoose.model("Example", example, "length_perturbations");
