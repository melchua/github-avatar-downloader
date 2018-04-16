var request = require('request');
var secret = require('./secrets')


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

getRepoContributors("jquery", "jquery", function(err, result) {
  // console.log("Errors: ", err);
  // console.log("Results: ", result);
  var data = JSON.parse(result);
  data.forEach(function (contrib) {
    console.log(contrib.avatar_url);
  });


});

console.log('Welcome to the GitHub Avatar Downloader! 👾');