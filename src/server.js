const express = require('express')
var cors = require('cors')
var path = require('path')
var bp = require('body-parser');
var AWS = require("aws-sdk");
const fs = require('fs');

// Instantiate express app
const app = express()

let rawdata = fs.readFileSync('object.json');
let jsonData = JSON.parse(rawdata);
//console.log(jsonData);

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    // secret credentials
    console.log("Access key:", AWS.config.credentials.accessKeyId);
    console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
  }
});

// uuid for tracking of data
var uuid = require('uuid');

// Create unique bucket name
var bucketName = 'iotwateringproject'
// Create name for uploaded object key
var keyName = 'general_key'

// special function to upload newest info to s3
function uploadToS3(WaterDuration, key) {

  // super secret EXTREMELY insecure password to prevent spamming from open internet
  // this function by definition is not secure, it is a proof of concept
  
  // ----- CHANGE THIS before running -----
  if(key == "examplekey"){
  // --------------------------------------
  
    // Create params for putObject call
    jsonData["frontend"]["duration"] = WaterDuration
    jsonData["frontend"]["willWater"] = "True"


    var objectParams = {Bucket: bucketName, Key: keyName, Body: JSON.stringify(jsonData), ContentType: "application/json"}
    // Create object upload promise
    var uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise();
    uploadPromise.then(
      function(data) {
        console.log("Successfully uploaded data: " + WaterDuration + " to " + bucketName + "/" + keyName);
})}};

// port the app is currently serving to
const port = 6975

// Cross-Origin Resource Sharing
app.use(cors());

// temporary soln
app.use(bp.urlencoded({
  extended: true
}));

// Serve Homepage HTML
app.get('/', function(req, res) {
  res.status(200).sendFile(path.join(__dirname + '/../html/index.html'));
});

// Send CSS
app.get('/styles/styles.css', function(req, res) {
  res.sendFile(path.join(__dirname + '/../html/styles/styles.css'));
});

// When form is clicked it posts to the endpoint below
// then it redirects itself to the original page
app.post('/submit-form', (req, res) => {
  const duration = req.body.duration
  const key = req.body.key
  uploadToS3(duration, key)
  res.redirect('/')
  res.end()
})

// Send 404
app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname + '/../html/404.html'));
  res.status(404).sendFile(path.join(__dirname + '/../html/styles/styles.css'));
})


// main function call to start application
const server = app.listen(port, () => console.log(`PlantWateringFrontend app listening on port ${port}!\n`))

module.exports = server
