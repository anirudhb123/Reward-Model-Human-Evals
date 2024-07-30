const mongoose = require("mongoose");

const example = new mongoose.Schema({
   completed: Boolean,
   query: String,
   response1: String,
   response2: String,
   instruction_following_1: Number,
   depth_1: Number,
   coherence_1: Number,
   completeness_1: Number,
   factual_correctness_1: Number,
   instruction_following_2: Number,
   depth_2: Number,
   coherence_2: Number,
   completeness_2: Number,
   factual_correctness_2: Number,
   overall_preference: String,
   annotator_id: String,
   time_spent: Number,
});

// modify the 3rd parameter to specify which MongoDB collection to use
module.exports = mongoose.model("Example", example, "human-eval-sample");
