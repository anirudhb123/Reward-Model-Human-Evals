const mongoose = require("mongoose");

const example = new mongoose.Schema({
   completed: Boolean,
   query: String,
   response1: String,
   response2: String,
   model_1: String,
   model_2: String,
   relevance_1: Number,
   helpfulness_1: Number,
   depth_1: Number,
   factual_correctness_1: Number,
   coherence_1: Number,
   relevance_2: Number,
   helpfulness_2: Number,
   depth_2: Number,
   factual_correctness_2: Number,
   coherence_2: Number,
   overall_preference: String,
   annotator_id: String,
   time_spent: Number,
   follow_up_qas: [{ qa: String, satisfied_1: Boolean, satisfied_2: Boolean }],
   mode: String,  // Add mode field to specify whether the task is pairwise or absolute
});

// modify the 3rd parameter to specify which MongoDB collection to use
module.exports = mongoose.model("Example", example, "human-eval");
