import user from '../controller/user.js';
import express from 'express';
import jwt from 'jsonwebtoken';
const apiRoutes = express.Router();
import config from '../config';
import mongoose  from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt  from 'bcrypt-nodejs';

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    apiRoutes.use(function(req, res, next) {
        let token = req.body.token || req.query.token || req.headers.token;
        if (token) {
            jwt.verify(token, config.secret, function(err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Failed to authenticate token.',
                        data: null
                    });
                } else {
                    req.user = decoded._doc;
                    req.userIp = get_ip(req).clientIp;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.',
                data: null
            });
        }
    });

    app.use('/api', apiRoutes);

    // login Auth
    app.post('/userLogin', user.login); // User Login
    app.post('/userRegister', user.register); // User Register

};
