'use strict';

// This script inspects the users projects for suspicious submissions.

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if ( process.env.NODE_ENV === 'development') {
  require('dotenv').load();
}
const hitsThreshold = 0;
const projectsThreshold = 0;
const skipWhitelisted = false;

const ApiUser = require('../src/v1/api-user');
const mongoose = require('mongoose');
const fs = require('fs');

const allchecks = require('./checks/checks');

// Connect to database
const mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl);

var separator = '';
var processing = 0;
// false positives
var whitelist = fs.readFileSync('hidden/whitelist.json', 'utf8');
// true positives
var blacklist = fs.readFileSync('hidden/blacklist.json', 'utf8');

fs.writeFileSync('hidden/alerts.json', '[\n', 'utf8');

// Select users with projects
var promise = ApiUser.find({challenges: {$elemMatch: {type: 'P'}}})
  .exec(function(err, apiusers) {

    if (err) { return err;}

    apiusers.forEach(function(user) {
      processing++;
      var projects = user.challenges.filter(function(ch) {
        if (ch.type === 'P') {
          return true;
        } else {
          return false;
        }
      });
      projects.sort(function(a, b) {
        return a.completed - b.completed;
      });

      console.log('Processing', user.username, projects.length);
      if (projects.length > projectsThreshold) {
         var orderedProjects = projects.sort(function(a, b) {
            if (a.solution.toLowerCase() > b.solution.toLowerCase()) {
             return 1;
            }
            if (a.solution.toLowerCase() < b.solution.toLowerCase()) {
              return -1;
            }
            return 0;
        });

        var checks = [];
        checks.push(allchecks.checkTotalSpeed(projects));
        checks.push(allchecks.checkSameDay(projects));
        checks.push(allchecks.checkUrlSites(projects));
        checks.push(allchecks.checkDuplicateUrls(orderedProjects));
        checks.push(allchecks.checkStolenUrls(projects, user.username));

        Promise.all(checks).then(function(results) {

              var evidence = [];
              results.forEach(function(result) {
                  if (Array.isArray(result) && result.length > 0) {
                    evidence = evidence.concat(result);
                  }
              });
              var onWhitelist = (whitelist.indexOf(user.username) >= 0);
              if (evidence.length > hitsThreshold &&
                  (onWhitelist || !skipWhitelisted)) {
                 console.log('Potential cheater:', user.username);
                 var reported = {};
                 reported.username = user.username;
                 reported.onWhitelist = onWhitelist;
                 reported.onBlacklist = (blacklist.indexOf(user.username) >= 0);
                 reported.projectCount = projects.length;
                 reported.evidence = evidence;
                 fs.appendFile('hidden/alerts.json',
                     separator + JSON.stringify(reported, null, '  '),
                     'utf8',
                     function(err) {
                        processing--;
                        if (err) {return err;}
                        return 'OK';
                     }
                  );
                  separator = ' ,\n';
              } else {
                processing--;
              }

          });
      } else {
          processing--;
      }
    });
    return 'OK';
});

var waitForCompletion = function() {
  if (processing > 0) {
    setTimeout(waitForCompletion, 1000);
  } else {
    fs.appendFileSync('hidden/alerts.json', ']\n', 'utf8');
    mongoose.connection.close();
  }
};

promise.then(function() {
  setTimeout(waitForCompletion, 100);
}, function(err) {
  throw Error('Oops, something went wrong: ' + err);
});

