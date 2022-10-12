'use strict';

var Login = require('../model/loginModel.js');

exports.do_login = function(req, res) {
    var user = new Login(req.body);

     //handles null error 
    if(!user.username || !user.password) {
        res.status(400).send({ error:true, message: 'Please provide username & password' });
    }
    else {
        const crypto = require('crypto');

        // This will hold the users and authToken related to users
        const authTokens = {};
    
        const getHashedPassword = (password) => {
            const sha256 = crypto.createHash('sha256');
            const hash = sha256.update(password).digest('base64');
            return hash;
            // return password;
        }

        
        // console.log(getHashedPassword('eci@123'));
        const generateAuthToken = () => {
            return crypto.randomBytes(30).toString('hex');
        }
    
        Login.doLogin(user.username, getHashedPassword(user.password), user.job_role, function(err, user) {
            
            if (err) {
                res.send(err);
            }
            if (user.length) {
                const authToken = generateAuthToken();
                // Store authentication token
                authTokens[authToken] = user;
                res.cookie('AuthToken', authToken);
            }
            res.json(user);
        });
    }
};

exports.check_examstatus = function(req, res) {
    //var user = new Login(req.body);
    Login.checkExamstatus(req.body.user_id, req.body.category, function(err, user) {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
};
