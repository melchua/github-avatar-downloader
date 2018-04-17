require('dotenv').config();


var request = require('request');
var fs = require('fs');
var rowner = process.argv[2];
var rname = process.argv[3];


function doesEnvExist() {
  var file = ".env";
    return (!fs.existsSync(file));
}

function getRepoContributors(repoOwner, repoName, cb) {
  if (doesEnvExist() === true) {
    console.log("Be careful, .env does not exist.");
    return;
  }
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + process.env.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}


function downloadImageByURL(url, filePath) {

  request.get(url)
  .on('error', function(err) {
    throw(err);
  })
  .on('response', function(response) {
    console.log('Response: ', response.statusMessage);
    console.log('Content-Type: ', response.headers['content-type']);
    console.log('Downloading image...');
  })
  .on('end', function() {
    console.log('Downloaded image.');
  })
  .pipe(fs.createWriteStream(filePath));
}


// introduce error checking to require at the 2 arguments
if (process.argv.length !== 4) {
  console.log("This application requires 2 arguments: Repo Owner and Repo Name. Please enter and try again.");
  return;
}

console.log('Welcome to the GitHub Avatar Downloader! 👾');

// when refactoring we could name the anonymous call back function something like "get avatar urls"
getRepoContributors(rowner, rname, function(err, result) {

  if (err) {
    console.log("Something be broke: ");
    console.error(err);
    return;
  }
  var data = JSON.parse(result);

  if (data.message === "Not Found") {
    console.log("Repo or Repo Owner doesn't exist");
    return;
  }

  var dir = "./avatars";
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  data.forEach(function (contrib) {
    downloadImageByURL(contrib.avatar_url, 'avatars/' + contrib.login + '.jpg');
  });
});


