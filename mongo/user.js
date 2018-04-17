const validator = require("validator");
const UserModel = require("../model/user.js");
const moment = require("moment");
const fs = require("fs");

const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { "Content-Type": "text-plain" },
  body: message || "Incorrect id"
});

export function getUsers(args) {
  return new Promise((resolve, reject) => {
    UserModel.find(args)
      .then(users => {
        let userMap = [];
        users.forEach((user, index) => {
          userMap[index] = user;
        });
        let res = {};
        res.users = userMap;
        resolve(res.users);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function createUser(args) {
  return new Promise((resolve, reject) => {
    // Needs rewriting / updating
    const userModel = new UserModel(args); // Would need validation
    const newUser = userModel.save();

    if (!newUser) {
      reject("Failed to add user");
    }

    resolve(newUser);
  });
}
