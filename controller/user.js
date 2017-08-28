import mongoose from 'mongoose';
import config from '../config';
import jwt from 'jsonwebtoken';
import async from 'async';
import qs from 'querystring';
import moment from 'moment-timezone';
import chalk from 'chalk';

const register = mongoose.model("user");

exports.login = function(req, res) {
  let receivedValues = req.body;
  if (JSON.stringify(receivedValues) === '{}' || receivedValues === undefined || receivedValues === null) {
    console.log(chalk.red("### Error Message: User Not available"));
    res.json({
      "code": 403,
      "status": "Error",
      "message": "User Not available!"
    });
    return;
  } else {
  let usercolumns = ["mail", "password"];
    for (let iter = 0; iter < usercolumns.length; iter++) {
      let columnName = usercolumns[iter];
      if (receivedValues[columnName] === undefined && (columnName === 'mail' || columnName === 'password')) {
        console.log(chalk.red(columnName, " field is undefined"));
        res.json({
          "code": 403,
          "status": "Error",
          "message": columnName + " field is undefined"
        });
        return;
      }
    }
    let user = new register();
    user.mail = req.body.mail;
    user.password = req.body.password;

    register.findOne({
      'mail': req.body.mail
    }, function(err, userDetail) {
      if (userDetail !== null) {
        if (userDetail.validPassword(req.body.password)) {
          let authToken = jwt.sign(userDetail, config.secret, {
            expiresIn: 1440 * 60 * 30 // expires in 24 hours
          });
          let data = {
            email: userDetail.mail,
            address: userDetail.address,
            status: "success"
          };
          res.json({
            "code": 200,
            "authToken": authToken,
            "data": data
          });
        } else {
          console.log(chalk.red("### Error Message: Email or Password is Worng"));
          res.json({
            "code": 403,
            "status": "Error",
            "message": "Email or Password is Worng"
          });
        }
      } else {
        console.log(chalk.red("### Error Message: Email or Password is Worng"));
        res.json({
          "code": 403,
          "status": "Error",
          "message": "Email or Password is Worng"
        });
      }
    });
  }
};

exports.register = function(req, res) {
  let receivedValues = req.body;
  if (JSON.stringify(receivedValues) === '{}' || receivedValues === undefined || receivedValues === null) {
    console.log(chalk.red("### Error Message: Invalid Data Enter"));
    res.json({
      "code": 403,
      "status": "Error",
      "message": "Invalid Data Enter"
    });
    return;
  } else {
    register.findOne({
      'mail': req.body.mail
    }, function(err, user) {
      if (user === null) {
        let userdata = new register();
        userdata.password = userdata.generateHash(req.body.password);
        userdata.mail = req.body.mail;
        userdata.username = req.body.username;

        userdata.save(function(err, login) {
          if (!err) {
            let data = {
              mail: login.mail,
              username: login.username,
              status: "success"
            };
            let authToken = jwt.sign(userdata, config.secret, {
              expiresIn: 1440 * 60 * 30 // expires in 1440 minutes
            });
            res.json({
              "code": 200,
              "authToken": authToken,
              "data": data
            });
          } else {
            res.json(false);
          }
        });
      } else {
        console.log(chalk.red("### Error Message: Account already exiting"));
        res.json({
          "code": 403,
          "status": "Error",
          "message": "Account already exiting"
        });
      }
    });
  }
};
