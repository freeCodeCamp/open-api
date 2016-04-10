const ApiUser = require('../../src/v1/api-user');

const msecDAY = (24 * 60 * 60 * 1000);

exports.checkTotalSpeed = function(projects) {
  var myProjs = projects;
  var p = new Promise(
      function(resolve, reject) {
        var suspects = [];
        var days = (myProjs[myProjs.length - 1].completedDate -
               myProjs[0].completedDate) / msecDAY;
        if (days + 1 < myProjs.length) {
          suspects.push({
              message: 'More than 1 project a day on average.',
              projectCount: myProjs.length,
              avgDaysPerProject: days,
              firstProjectCompleted: new Date(myProjs[0].completed),
              lastProjectCompleted: new Date(myProjs[myProjs.length - 1]
                                        .completed)
          });
        }
        resolve(suspects);
      });
    return p;
};

exports.checkSameDay = function(projects) {
  var myProjs = projects;
  var p = new Promise(
      function(resolve, reject) {
        var suspects = [];
        var lastDate = 0;
        var countDay = 0;
        myProjs.forEach(function(proj) {
          if (proj.completedDate - lastDate > msecDAY) {
            if (countDay > 2) {
              suspects.push({projectCount: countDay,
                             dateStart: new Date(lastDate),
                             dateEnd: new Date(proj.completed),
                             message: 'More than 2 projects on this day.'
                       });
            }
            countDay = 0;
            lastDate = proj.completedDate;
          }
        });
        resolve(suspects);
    });
    return p;
};

exports.checkUrlSites = function(projects) {
  var myProjs = projects;
  var p = new Promise(
      function(resolve, reject) {
        var suspects = [];
        var phttp = /^https?:\/\//i;
        var pheroku = /herokuapp.com/i;
        var pcodepen = /codepen.io/i;
        var pgithub = /github.io/i;
        var pnitrous = /nitrous/i;

        myProjs.forEach(function(proj) {
          if (!proj.solution || proj.solution.length === 0) {
              suspects.push({project: proj.name,
                             completed: new Date(proj.completed),
                             solution: proj.solution,
                             message: 'Project without solution.'
                       });
          } else if ( !(phttp.test(proj.solution) &&
                         (pheroku.test(proj.solution) ||
                          pcodepen.test(proj.solution) ||
                          pgithub.test(proj.solution) ||
                          pnitrous.test(proj.solution)
                        ))) {
                suspects.push({
						project: proj.name,
						completed: new Date(proj.completed),
						solution: proj.solution,
						message: 'Project not hosted on Codepen, Github, Nitrous or Heroku.'
                });
          }
        });
        resolve(suspects);
    });
    return p;
};

exports.checkDuplicateUrls = function(projects) {
  var myProjs = projects;
  var p = new Promise(
      function(resolve, reject) {
        var suspects = [];
        var prvUrl = '';
        var reported = false;
        myProjs.forEach(function(proj) {
          if (proj.solution !== null) {
            if (proj.solution === prvUrl) {
              if (!reported) {
                  suspects.push({project: proj.name,
                                 completed: new Date(proj.completed),
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
        resolve(suspects);
    });
    return p;
};

exports.checkStolenUrls = function(projects, user) {
  var myProjs = projects;
  var usernm = user;
  var p = new Promise(
		function(resolve, reject) {
			var suspects = [];
			var threads = [];
			myProjs.forEach(function(proj) {
				if (proj.solution === null ||
					proj.solution.toLowerCase().indexOf('http') < 0) {
					return;
				}
				var query = ApiUser.find({$and: [
					{challenges: {$elemMatch: {solution: proj.solution}}},
					{username: {$ne: usernm}}]});
				threads.push(query);
				query.then(function(data) {
					if (!data || data.length === 0) {
						return;
					}
					// Check the date, if older it's suspicious
					data.forEach(function(usr) {
						if (!usr.challenges || usr.challenges.length === 0) {
							return;
						}
						usr.challenges.some(function(chall) {
							if (chall.solution &&
								chall.type === 'P' &&
								chall.solution === proj.solution &&
								chall.completed < proj.completed) {
									suspects.push({
										project: proj.name,
										completed: new Date(proj.completed),
										solution: proj.solution,
										message: 'URL may be copied from an older ' +
												'project from user ' + usr.username
									});
									return true;
							}
							return false;
						});
					});
				});
			});
			Promise.all(threads).then(function() {
				resolve(suspects);
			});
	});
	return p;
};
