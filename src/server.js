const express = require('express')
var cors = require('cors')
var path = require('path')
var bp = require('body-parser');

const app = express()

var AWS = require("aws-sdk");

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
    console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
  }
});

var uuid = require('uuid');

// Create unique bucket name
var bucketName = 'iotwateringproject'
// Create name for uploaded object key
var keyName = 'general_key'

function uploadToS3(duration, key) {

  if(key == "examplekey"){
    // Create params for putObject call
    var objectParams = {Bucket: bucketName, Key: keyName, Body: duration};
    // Create object upload promise
    var uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise();
    uploadPromise.then(
      function(data) {
        console.log("Successfully uploaded data: " + duration + " to " + bucketName + "/" + keyName);
})}};

//port the app is currently serving to
const port = 6975

app.use(cors());

app.use(bp.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  res.status(200).sendFile(path.join(__dirname + '/../html/index.html'));
});

app.get('/styles/styles.css', function(req, res) {
  res.sendFile(path.join(__dirname + '/../html/styles/styles.css'));
});

app.post('/submit-form', (req, res) => {
  const duration = req.body.duration
  const key = req.body.key
  //console.log(duration)
  uploadToS3(duration, key)
  res.redirect('/')
  res.end()
})

app.use(function (req, res) {
  res.status(404).sendFile(path.join(__dirname + '/../html/404.html'));
  res.status(404).sendFile(path.join(__dirname + '/../html/styles/styles.css'));
})



const server = app.listen(port, () => console.log(`PlantWateringFrontend app listening on port ${port}!\n`))

module.exports = server
