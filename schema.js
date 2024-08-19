const mongoose = require("mongoose");

const example = new mongoose.Schema({
   completed: Boolean,
   query: String,
   response1: String,
   response2: String,
   model_1: String,
   model_2: String,
   suitability_1: Number,
   helpfulness_1: Number,
   specificity_1: Number,
   correctness_1: Number,
   coherence_1: Number,
   suitability_2: Number,
   helpfulness_2: Number,
   specificity_2: Number,
   correctness_2: Number,
   coherence_2: Number,
   overall_preference: String,
   justification: String,
   annotator_id: String,
   time_spent: Number,
   follow_up_qas: [{ qa: String, satisfied_1: Boolean, satisfied_2: Boolean }],
   mode: String,  // Add mode field to specify whether the task is pairwise or absolute
});

// modify the 3rd parameter to specify which MongoDB collection to use
module.exports = mongoose.model("Example", example, "human-eval");
