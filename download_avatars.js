var request = require('request');


function getRepoContributors(repoOwner, repoName, cb) {
  // ...
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors: ", err);
  conosle.log("Results: ", result);
});

console.log('Welcome to the GitHub Avatar Downloader!');