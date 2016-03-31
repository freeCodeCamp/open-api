
// This script inspects the users projects for suspicious submissions.

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if ( process.env.NODE_ENV === 'development') {
  require('dotenv').load();
}
const msecDAY = (24 * 60 * 60 * 1000);

const hitsThreshold = 1;
const projectsThreshold = 1;
const skipWhitelisted = false;

const ApiUser = require('../src/v1/api-user');
const mongoose = require('mongoose');
const fs = require('fs');

// Connect to database
const mongoUrl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
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
        return a.completedDate - b.completedDate;
      });

      console.log('Processing', user.username, projects.length);
      if (projects.length > projectsThreshold) {

        var evidence = [];
        evidence = evidence.concat(checkTotalSpeed(projects));
        evidence = evidence.concat(checkSameDay(projects));
        evidence = evidence.concat(checkUrls(projects));
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
                  separator = ' ,\n';
                  return 'OK';
               }
            );
        } else {
          processing--;
        }
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


var checkTotalSpeed = function(projects) {
  var suspects = [];
  var days = (projects[projects.length - 1].completedDate -
             projects[0].completedDate) / msecDAY;
  if (days + 1 < projects.length) {
    suspects.push({
        message: 'More than 1 project a day on average.',
        projectCount: projects.length,
        avgDaysPerProject: days,
        firstProjectCompleted: new Date(projects[0].completedDate),
        lastProjectCompleted: new Date(projects[projects.length - 1]
                                        .completedDate)
    });
  }
  return suspects;
};

var checkSameDay = function(projects) {

  var suspects = [];
  var lastDate = 0;
  var countDay = 0;
  projects.forEach(function(proj) {
    if (proj.completedDate - lastDate > msecDAY) {
      if (countDay > 2) {
        suspects.push({projectCount: countDay,
                       dateStart: new Date(lastDate),
                       dateEnd: new Date(proj.completedDate),
                       message: 'More than 2 projects on this day.'
                 });
      }
      countDay = 0;
      lastDate = proj.completedDate;
    }
  });
  return suspects;
};

var checkUrls = function(projects) {

  var suspects = [];
  var phttp = /^https?:\/\//i;
  var pheroku = /herokuapp.com/i;
  var pcodepen = /codepen.io/i;

  projects.forEach(function(proj) {
    if (!proj.solution || proj.solution.length === 0) {
        suspects.push({project: proj.name,
                       completed: new Date(proj.completedDate),
                       solution: proj.solution,
                       message: 'Project without solution.'
                 });
    } else if ( !(phttp.test(proj.solution) &&
                   (pheroku.test(proj.solution) ||
                    pcodepen.test(proj.solution)))) {
          suspects.push({project: proj.name,
                         completed: new Date(proj.completedDate),
                         solution: proj.solution,
                         message: 'Project not on Codepen or Heroku.'
                   });
    }
  });

  var orderedProjects = projects.sort(function(a, b) {
    if (a.solution.toLowerCase() > b.solution.toLowerCase()) {
      return 1;
    }
    if (a.solution.toLowerCase() < b.solution.toLowerCase()) {
      return -1;
    }
    return 0;
  });

  var prvUrl = '';
  var reported = false;
  orderedProjects.forEach(function(proj) {
    if (proj.solution !== null) {
      if (proj.solution === prvUrl) {
        if (!reported) {
            suspects.push({project: proj.name,
                           completed: new Date(proj.completedDate),
                           solution: proj.solution,
                           message: 'Same URL is used for more projects.'
                      });
          reported = true;
        }
      } else {
        prvUrl = proj.solution;
        reported = false;
      }
    }
  });
  return suspects;
};
