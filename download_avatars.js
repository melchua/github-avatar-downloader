var request = require('request');
var secret = require('./secrets');
var fs = require('fs');


function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token' + secret.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

// testing

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


console.log('Welcome to the GitHub Avatar Downloader! 👾');


// when refactoring we could name the anonymous call back function something like "get avatar urls"
getRepoContributors("jquery", "jquery", function(err, result) {
  var data = JSON.parse(result);

  var dir = "./avatars";
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  data.forEach(function (contrib) {
    downloadImageByURL(contrib.avatar_url, 'avatars/' + contrib.login + '.jpg');
  });
});
