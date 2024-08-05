const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Example = require('./schema.js');

app.use(express.json());
app.use((req, res, next) => {
   console.log(req.path, req.method);
   next();
});
app.use(cors());
app.use(express.static('build'));

// route redirection for react router
app.get('/examples', (request, response) => {
   response.sendFile(path.join(__dirname, '/build/index.html'));
});

// get all tasks from a specific annotator (given an id)
app.get('/api/examples', (request, response) => {
   // Example.find({ annotator_id: request.params.annotator_id }).then(examples => {
   Example.find({ completed: false }).then(examples => {
       response.json(examples);
   }).catch(error => response.json(error));
});

// annotate example
app.patch('/api/annotate/example/:example_id', (request, response) => {
   const body = request.body;
   Example.findByIdAndUpdate(request.params.example_id, {
       $set: {
           'completed': body.completed,
           'time_spent': body.time_spent,
           'instruction_following_1': body.instruction_following_1,
           'depth_1': body.depth_1,
           'coherence_1': body.coherence_1,
           'completeness_1': body.completeness_1,
           'factual_correctness_1': body.factual_correctness_1,
           'instruction_following_2': body.instruction_following_2,
           'depth_2': body.depth_2,
           'coherence_2': body.coherence_2,
           'completeness_2': body.completeness_2,
           'factual_correctness_2': body.factual_correctness_2,
           'overall_preference': body.overall_preference,
       },
   },
   { new: true }
   ).then(example => {
       response.json(example);
   }).catch(error => response.json(error));
});

app.listen(PORT, () => {
   console.log('Listening on port', PORT);
});