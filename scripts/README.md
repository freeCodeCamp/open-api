![FreeCodeCamp](https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg)
This open-api project is a [FreeCodeCamp](http://www.freecodecamp.com) spin-off. Join FreeCodeCamp to learn to code and help nonprofits.

# open-api Project

## About
Free Code Camp's open API initiative is an implementation of the FreeCodeCamp's open-data policy. The open API exposes user performance and some more details on Free Code Camp users. Third parties are encouraged to develop tools to present FCC user data in a creative way. 

## Explanation on the scripts

This folder contains 2 Node scripts:
* Conversion tool
* Academic Honesty tool

### Conversion Tool
The script *convert-users.js* creates the collection *apiusers* that is the main collection behind the API. All data from the list endpoint is retrieved from collection apiusers. It contains aggregated data on the FCC users, to be used.
The script takes the huge FCC user collection as input. It creates a summary counts on several completed challenges. And loads all completed challenges in an array.

Execute: node scripts/convert-users.js


### Academic
The script *detect-suspects.js* analyzes the completed projects in the collection *apiusers*. It has to run after a new conversion. The result of this script is a JSON with suspected users and their projects. The list of projects is inspected on the following "suspicious" characteristics:
* -total duration to complete all challenges. Less than 1 day per challenge on average is a hit.
* -more than 1 completed project within 24 hours.
* -solution URLs that are not referring to Codepen or Heroku
* -duplicate URLs as a solution  

To reduce the number of repetitive hits, the tool can suppress users on a whitelist (false positives) and on a blacklist (true positives). The tool uses a couple of thresholds to adjust the tolerance. 
   
Execute: node scripts/detect-suspects.js
  


