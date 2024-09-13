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
   Example.find({  }).then(examples => {
       response.json(examples);
   }).catch(error => response.json(error));
});

// annotate example
app.patch('/api/annotate/example/:example_id', (request, response) => {
   const body = request.body;
   Example.findByIdAndUpdate(request.params.example_id, {
       $set: {
           'query': body.query,
           'response1': body.response1,
           'response2': body.response2,
           'reward_model_preferred_response': body.reward_model_preferred_response,
       },
   },
   { new: true }
   ).then(example => {
       response.json(example);
   }).catch(error => response.json(error));
});




// Define a new schema for the AnnotatedExamples collection
const annotatedExampleSchema = new mongoose.Schema({
   query_id: String,
   annotator_id: String,
   completed: Boolean,
   overall_preference: String,
   preference_reasons: [String],
   time_spent: Number
});

// Create the model for the AnnotatedExamples collection
const AnnotatedExample = mongoose.model('AnnotatedExample', annotatedExampleSchema);


// annotate example
/* app.patch('/api/annotate/example/:example_id', (request, response) => {
   const body = request.body;
   Example.findByIdAndUpdate(request.params.example_id, {
       $set: {
           'query': body.query,
           'response1': body.response1,
           'response2': body.response2,
           'reward_model_preferred_response': body.reward_model_preferred_response,
       },
   },
   { new: true }
   ).then(example => {
       response.json(example);
   }).catch(error => response.json(error));
}); */


app.post('/api/annotate/example/:example_id', (request, response) => {
   const body = request.body;

   console.log(body.query_id)

   // Create a new document using the AnnotatedExample model
   const newAnnotatedExample = new AnnotatedExample({
       query_id: body.query_id,
       annotator_id: body.annotator_id,
       completed: body.completed,
       overall_preference: body.overall_preference,
       preference_reasons: body.selectedValues,
       time_spent: body.time_spent
   });

   // Save the new document to the AnnotatedExamples collection
   newAnnotatedExample.save()
   .then(savedAnnotatedExample => {
       response.json(savedAnnotatedExample);
   })
   .catch(error => {
       response.status(400).json({ error: error.message });
   });
});


app.listen(PORT, () => {
   console.log('Listening on port', PORT);
});
